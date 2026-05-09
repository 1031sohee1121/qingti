# 轻体后端 - FastAPI

## 本地运行步骤

### 第一次运行 

**1. 进入这个目录**

打开 PowerShell 或 cmd，进入 backend 目录：

```bash
cd 你解压的位置/qingti-project/backend
```

**2. 创建 Python 虚拟环境**（推荐，避免污染全局环境）

```bash
python -m venv venv
```

**3. 激活虚拟环境**

Windows PowerShell:
```bash
venv\Scripts\Activate.ps1
```

如果遇到"无法加载脚本"的错误，先在 PowerShell 里执行：
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
然后重新激活。

Windows cmd:
```bash
venv\Scripts\activate.bat
```

**4. 安装依赖**

```bash
pip install -r requirements.txt
```

⚠️ 如果下载很慢，使用国内镜像：
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**5. 把数据集放进来**

把你的 `ObesityDataSet_raw_and_data_sinthetic.csv` 复制到 backend/ 目录里。

**6. 训练模型**

```bash
python train.py
```

成功后你会看到：
- 终端打印准确率（应该在 95% 左右）
- 当前目录生成 `model.pkl`

**7. 启动 API 服务**

```bash
uvicorn api:app --reload --port 8000
```

看到这行说明启动成功：
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**8. 测试一下**

浏览器打开 http://localhost:8000/docs

会看到 Swagger 文档，可以点 `/predict` 试试发请求。

## 后续启动（已经训练过模型）

每次启动只需：
```bash
cd 你的位置/qingti-project/backend
venv\Scripts\Activate.ps1
uvicorn api:app --reload --port 8000
```

## 文件说明

| 文件 | 作用 |
|------|------|
| `train.py` | 训练脚本（只跑一次） |
| `api.py` | FastAPI 后端服务 |
| `model.pkl` | 训练好的模型（train.py 跑完会生成） |
| `requirements.txt` | Python 依赖 |
| `ObesityDataSet_*.csv` | 训练用的数据集 |
