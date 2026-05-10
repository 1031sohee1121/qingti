---
title: 轻体 API
emoji: 🌿
colorFrom: pink
colorTo: green
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: 基于 XGBoost + SHAP 的体重健康预测 API
---

# 轻体 API

基于 XGBoost 与 SHAP 的体重健康状态预测服务，支持多源行为数据建模。

## 接口

- `GET /` — 服务状态
- `GET /health` — 健康检查
- `POST /predict` — 预测 + SHAP 解释
- `GET /docs` — Swagger 文档（可视化测试）

## 模型

- 算法: XGBoost
- 数据集: UCI Obesity Dataset (2111 样本)
- 测试集准确率: ~95%
- 可解释性: SHAP TreeExplainer
