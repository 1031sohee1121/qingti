# 用于 Hugging Face Spaces 部署
# 文档: https://huggingface.co/docs/hub/spaces-sdks-docker

FROM python:3.10-slim

# HF Spaces 要求非 root 用户
RUN useradd -m -u 1000 user

# 设置工作目录
WORKDIR /app

# 把数据集和代码先以 root 身份拷过来再设置权限
COPY --chown=user requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY --chown=user . /app

USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    PYTHONUNBUFFERED=1

# 部署时自动训练模型（如果还没有 model.pkl）
RUN if [ ! -f /app/model.pkl ]; then python /app/train.py; fi

# HF Spaces 必须监听 7860
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
