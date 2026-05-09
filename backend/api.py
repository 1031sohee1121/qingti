"""
=============================================================
  轻体 - FastAPI 后端
=============================================================
作用：
  - 加载训练好的 XGBoost 模型
  - 提供 /predict 接口：输入用户数据，返回预测结果 + SHAP 解释
  - 提供 /health 接口：健康检查

运行方式（在 backend/ 目录下）：
  uvicorn api:app --reload --port 8000

启动后访问 http://localhost:8000/docs 可以看到 API 文档
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import pandas as pd
import numpy as np
import joblib
import shap
import os

# ============== 启动应用 ==============
app = FastAPI(
    title="轻体 API",
    description="基于 XGBoost + SHAP 的体重状态预测服务",
    version="1.0.0",
)

# 允许跨域（前端 Vercel 的域名要能访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议改成具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== 加载模型 ==============
MODEL_PATH = "model.pkl"

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(
        f"找不到模型文件 {MODEL_PATH}！\n"
        f"请先运行 python train.py 来训练模型。"
    )

print("📦 正在加载模型...")
artifacts = joblib.load(MODEL_PATH)
model = artifacts['model']
scaler = artifacts['scaler']
label_encoder = artifacts['label_encoder']
feature_names = artifacts['feature_names']
numeric_features = artifacts['numeric_features']
categorical_features = artifacts['categorical_features']

# 创建 SHAP 解释器（多分类）
print("🔍 正在初始化 SHAP 解释器...")
explainer = shap.TreeExplainer(model)
print("✅ 后端启动就绪！")

# ============== 类别标签的中文映射 ==============
LABEL_ZH = {
    'Insufficient_Weight': '体重不足',
    'Normal_Weight': '正常体重',
    'Overweight_Level_I': '超重 I 型',
    'Overweight_Level_II': '超重 II 型',
    'Obesity_Type_I': '肥胖 I 型',
    'Obesity_Type_II': '肥胖 II 型',
    'Obesity_Type_III': '肥胖 III 型',
}

# 鼓励性的反馈语
LABEL_MESSAGE = {
    'Insufficient_Weight': '你比标准体重轻一些',
    'Normal_Weight': '你正处在健康的区间里',
    'Overweight_Level_I': '稍微超出了一点点',
    'Overweight_Level_II': '需要开始关注了',
    'Obesity_Type_I': '是时候温柔地行动起来',
    'Obesity_Type_II': '建议寻求专业的健康指导',
    'Obesity_Type_III': '建议尽快咨询医生',
}

# 特征中文名
FEATURE_ZH = {
    'Age': '年龄',
    'Height': '身高',
    'Weight': '体重',
    'FCVC': '蔬菜摄入',
    'NCP': '主餐次数',
    'CH2O': '饮水量',
    'FAF': '运动频率',
    'TUE': '屏幕时间',
    'Gender': '性别',
    'family_history_with_overweight': '家族超重史',
    'FAVC': '高热量食物',
    'CAEC': '餐间进食',
    'SMOKE': '吸烟',
    'SCC': '热量监控',
    'CALC': '饮酒',
    'MTRANS': '交通方式',
}

# ============== 请求体 ==============
class PredictRequest(BaseModel):
    """用户输入的 16 个特征"""
    Gender: str = Field(..., description="Female / Male")
    Age: float = Field(..., ge=10, le=100)
    Height: float = Field(..., ge=1.0, le=2.5, description="身高（米）")
    Weight: float = Field(..., ge=20, le=250, description="体重（千克）")
    family_history_with_overweight: str = Field(..., description="yes / no")
    FAVC: str = Field(..., description="高热量食物频率：yes / no")
    FCVC: float = Field(..., ge=1, le=3, description="蔬菜摄入：1=很少, 2=有时, 3=总有")
    NCP: float = Field(..., ge=1, le=4, description="主餐次数")
    CAEC: str = Field(..., description="餐间进食：no / Sometimes / Frequently / Always")
    SMOKE: str = Field(..., description="yes / no")
    CH2O: float = Field(..., ge=1, le=3, description="饮水量：1=<1L, 2=1-2L, 3=>2L")
    SCC: str = Field(..., description="热量监控：yes / no")
    FAF: float = Field(..., ge=0, le=3, description="运动频率：0=无, 1-2=适度, 3=频繁")
    TUE: float = Field(..., ge=0, le=2, description="屏幕时间：0=<2h, 1=3-5h, 2=>5h")
    CALC: str = Field(..., description="饮酒：no / Sometimes / Frequently / Always")
    MTRANS: str = Field(..., description="交通方式：Walking / Bike / Public_Transportation / Automobile / Motorbike")


def preprocess_input(data: PredictRequest) -> pd.DataFrame:
    """把单个用户输入转成模型可以接受的特征矩阵"""
    # 1. 转成 DataFrame
    raw = pd.DataFrame([data.dict()])

    # 2. 类别变量独热编码
    encoded = pd.get_dummies(raw, columns=categorical_features, drop_first=False)

    # 3. 补齐缺失的列（训练时存在但当前样本没有的独热列）
    for col in feature_names:
        if col not in encoded.columns:
            encoded[col] = 0

    # 4. 按训练集的列顺序排列
    encoded = encoded[feature_names]

    # 5. 数值特征标准化
    encoded[numeric_features] = scaler.transform(encoded[numeric_features])

    return encoded


@app.get("/")
def root():
    return {
        "service": "轻体 API",
        "status": "running",
        "model_accuracy": f"{artifacts['accuracy'] * 100:.2f}%",
        "endpoints": ["/predict", "/health", "/docs"],
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(req: PredictRequest):
    """核心预测接口"""
    try:
        # 1. 预处理
        X = preprocess_input(req)

        # 2. 预测概率
        probs = model.predict_proba(X)[0]
        pred_idx = int(np.argmax(probs))
        pred_label_en = label_encoder.classes_[pred_idx]

        # 3. SHAP 解释
        shap_values = explainer.shap_values(X)
        # 多分类下 shap_values 是 (1, n_features, n_classes) 的数组
        # 我们关注预测出的那个类别的 SHAP 值
        if isinstance(shap_values, list):
            sample_shap = shap_values[pred_idx][0]
        else:
            # 新版 shap 返回 ndarray，shape: (samples, features, classes)
            if shap_values.ndim == 3:
                sample_shap = shap_values[0, :, pred_idx]
            else:
                sample_shap = shap_values[0]

        # 4. 把 SHAP 值按特征聚合（独热的合并到原特征）
        feature_contributions = {}
        for i, fname in enumerate(feature_names):
            # 找出原始特征名
            original = None
            for cat in categorical_features:
                if fname.startswith(cat + '_'):
                    original = cat
                    break
            if original is None:
                original = fname

            feature_contributions[original] = feature_contributions.get(original, 0) + float(sample_shap[i])

        # 5. 组装 SHAP 列表（按 |值| 排序）
        shap_list = []
        for fname, val in feature_contributions.items():
            shap_list.append({
                'feature': fname,
                'feature_zh': FEATURE_ZH.get(fname, fname),
                'value': round(val, 4),
                'abs_value': abs(val),
            })
        shap_list.sort(key=lambda x: x['abs_value'], reverse=True)

        # 6. 概率分布（中文标签）
        probs_list = []
        for i, p in enumerate(probs):
            label_en = label_encoder.classes_[i]
            probs_list.append({
                'label_en': label_en,
                'label_zh': LABEL_ZH.get(label_en, label_en),
                'probability': round(float(p), 4),
            })

        # 7. BMI（参考用）
        bmi = req.Weight / (req.Height ** 2)

        return {
            'success': True,
            'prediction': {
                'label_en': pred_label_en,
                'label_zh': LABEL_ZH.get(pred_label_en, pred_label_en),
                'message': LABEL_MESSAGE.get(pred_label_en, ''),
                'confidence': round(float(probs[pred_idx]), 4),
            },
            'bmi': round(bmi, 2),
            'probabilities': probs_list,
            'shap_explanations': shap_list[:8],  # 返回前 8 个最重要的
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
