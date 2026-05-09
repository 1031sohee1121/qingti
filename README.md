# 轻体 (QingTi) - 体重健康管理网站

> 基于刘雯怡《基于机器学习的多源行为数据体重状态预测与可视化系统设计》构建的现代化健康管理网站。

## 项目结构

```
qingti-project/
├── backend/              # Python FastAPI 后端
│   ├── train.py         # 模型训练脚本
│   ├── api.py           # API 服务
│   ├── requirements.txt # Python 依赖
│   └── README.md        # 后端启动说明
├── frontend/            # Next.js 前端
│   ├── app/             # 页面路由
│   ├── components/      # 组件
│   ├── lib/             # 工具库
│   ├── package.json     # Node 依赖
│   └── README.md        # 前端启动说明
└── DEPLOYMENT.md        # 部署到线上的完整指南（重点！）
```

## 技术栈

**后端**: Python + FastAPI + XGBoost + SHAP
**前端**: Next.js 14 + React 18 + TypeScript + Tailwind CSS + Recharts
**部署**: Render（后端） + Vercel（前端） + 域名提供商（你买的）

## 快速开始（本地）

### 第 1 步：本地跑后端

```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1                      # 进入虚拟环境
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
# 把数据集 ObesityDataSet_raw_and_data_sinthetic.csv 放到 backend/ 里
python train.py                                # 训练模型，生成 model.pkl
uvicorn api:app --reload --port 8000           # 启动 API
```

确认 http://localhost:8000/docs 可访问。

### 第 2 步：本地跑前端（新开一个终端）

```bash
cd frontend
npm install --registry=https://registry.npmmirror.com
copy .env.local.example .env.local
npm run dev
```

打开 http://localhost:3000 应该能看到完整网站，"测一测"会调用你本地的真实模型。

### 第 3 步：部署上线

请打开 **DEPLOYMENT.md**，那里有非常详细的一步步部署指南。

## 论文成果在这个网站里的对应

| 论文章节 | 网站功能 |
|---------|---------|
| 第 4 章：XGBoost 模型 | 后端 `/predict` 接口的核心 |
| 第 5 章：SHAP 可解释性 | 前端"为什么是这个结果"模块 |
| 第 6 章：Streamlit 系统 | 整个网站（升级版） |
| 数据集（UCI） | `ObesityDataSet_*.csv` 训练用 |

## 核心创新点

相比论文里的 Streamlit 系统，这个版本：

1. **真正的 Web 产品**：可公网访问，可绑定自己的域名
2. **温暖的用户体验**：去掉"肥胖""超重"等刺眼措辞，改成鼓励性语言
3. **闭环设计**：测一测 → 健康画像 → 个性化建议 → 数据追踪
4. **现代化前端**：响应式设计，移动端友好，动画丰富
5. **真实 SHAP**：保留了论文的可解释性优势，对比市面 APP 这是独特的差异点

## 帮助

如果遇到任何问题，可以问 Claude：
- "我在跑 train.py 时遇到 XX 报错怎么办？"
- "前端启动后样式不对怎么办？"
- "Render 部署时显示 build failed 怎么办？"
