"""
=============================================================
  轻体 - 模型训练脚本
=============================================================
作用：
  1. 读取 UCI 肥胖数据集
  2. 数据预处理（独热编码 + 标准化）
  3. 训练 XGBoost 模型
  4. 保存模型 + 编码器 + 标签映射 到 model.pkl

运行方式（在 backend/ 目录下打开终端）：
  python train.py

成功后会生成：
  - model.pkl          训练好的 XGBoost 模型 + 预处理器
  - test_accuracy.txt  测试集准确率
"""

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import os

# ============== 配置 ==============
DATA_PATH = "ObesityDataSet_raw_and_data_sinthetic.csv"
OUTPUT_PATH = "model.pkl"
RANDOM_STATE = 42
TEST_SIZE = 0.2

# ============== 1. 读取数据 ==============
print("📂 正在加载数据...")
df = pd.read_csv(DATA_PATH)
print(f"   数据规模: {df.shape[0]} 行 × {df.shape[1]} 列")

# ============== 2. 特征定义 ==============
# 数值特征（论文中需要标准化的）
NUMERIC_FEATURES = ['Age', 'Height', 'Weight', 'FCVC', 'NCP', 'CH2O', 'FAF', 'TUE']

# 类别特征（论文中需要独热编码的）
CATEGORICAL_FEATURES = ['Gender', 'family_history_with_overweight', 'FAVC',
                        'CAEC', 'SMOKE', 'SCC', 'CALC', 'MTRANS']

TARGET = 'NObeyesdad'

# ============== 3. 预处理 ==============
print("🔧 正在做特征工程...")

# 类别变量独热编码
df_encoded = pd.get_dummies(df, columns=CATEGORICAL_FEATURES, drop_first=False)

# 分离特征与目标
y_text = df_encoded[TARGET]
X = df_encoded.drop(columns=[TARGET])

# 目标变量编码（7 个类别 → 0~6）
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_text)

# 把数值特征标准化
scaler = StandardScaler()
X[NUMERIC_FEATURES] = scaler.fit_transform(X[NUMERIC_FEATURES])

# 保存特征名字顺序（预测时要用同样的顺序）
feature_names = X.columns.tolist()

print(f"   编码后特征数: {len(feature_names)}")
print(f"   类别标签顺序: {list(label_encoder.classes_)}")

# ============== 4. 划分训练集 ==============
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
)
print(f"   训练集: {X_train.shape[0]} 样本 | 测试集: {X_test.shape[0]} 样本")

# ============== 5. 训练 XGBoost ==============
print("\n🚀 正在训练 XGBoost...")
model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    objective='multi:softprob',
    num_class=7,
    random_state=RANDOM_STATE,
    eval_metric='mlogloss',
    use_label_encoder=False,
)
model.fit(X_train, y_train)

# ============== 6. 评估 ==============
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ 训练完成！测试集准确率: {acc * 100:.2f}%")
print("\n📊 分类报告:")
print(classification_report(y_test, y_pred,
                            target_names=label_encoder.classes_, digits=3))

# ============== 7. 保存模型 ==============
# 把所有需要的东西一起保存（模型 + 标准化器 + 标签编码器 + 特征名）
artifacts = {
    'model': model,
    'scaler': scaler,
    'label_encoder': label_encoder,
    'feature_names': feature_names,
    'numeric_features': NUMERIC_FEATURES,
    'categorical_features': CATEGORICAL_FEATURES,
    'accuracy': acc,
}
joblib.dump(artifacts, OUTPUT_PATH)
print(f"\n💾 模型已保存到 {OUTPUT_PATH}")

# 写入准确率文件
with open('test_accuracy.txt', 'w', encoding='utf-8') as f:
    f.write(f"测试集准确率: {acc * 100:.2f}%\n")

print("\n🎉 全部完成！现在可以运行 python api.py 启动后端了。")
