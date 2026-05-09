# 部署指南：让全世界都能访问你的网站

这份文档会带你一步步把你的轻体网站部署到公网，最终拿到一个 `https://你的域名.com` 的真实链接。

---

## 总览

```
[ 你的电脑 ]
    ↓ 推代码
[ GitHub ]  ← 代码仓库
    ↓
    ├── 后端 → Render（提供免费 Python 服务器）
    └── 前端 → Vercel（提供免费 Next.js 托管）
            ↑
            └── 绑定你买的域名
```

**预计耗时**: 1-2 小时
**预计花费**: 域名 60-80 元/年（其它都免费）

---

## 准备阶段：注册三个账号

请先注册这三个账号（都免费，都可以用 GitHub 一键登录）：

1. **GitHub**: https://github.com/signup
2. **Render**: https://render.com/  → 用 GitHub 登录
3. **Vercel**: https://vercel.com/signup → 用 GitHub 登录

---

## 第 1 步：把代码推到 GitHub

### 1.1 在电脑上装 Git

下载安装：https://git-scm.com/download/win

安装时一路点 Next 即可。

装完之后打开 PowerShell，输入：
```bash
git --version
```
看到版本号说明 OK。

### 1.2 配置 Git（第一次用要做）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的GitHub注册邮箱"
```

### 1.3 在 GitHub 创建一个仓库

1. 打开 https://github.com/new
2. Repository name: `qingti-project`（或者你喜欢的名字）
3. **不要勾选** "Add a README file"
4. 点 "Create repository"

### 1.4 把代码推上去

打开 PowerShell，进入项目目录：

```bash
cd 你解压的位置/qingti-project
```

然后：

```bash
git init
git add .
git commit -m "首次提交"
git branch -M main
git remote add origin https://github.com/你的用户名/qingti-project.git
git push -u origin main
```

第一次 `git push` 会让你登录 GitHub，照着提示来。

✅ **完成**: 现在你的代码在 GitHub 上了。

⚠️ **重要**：模型文件 `model.pkl` 比较大，可能会推不上去。如果遇到这个情况，先看下面"附录 A"。

---

## 第 2 步：部署后端到 Render

### 2.1 登录 Render

1. 访问 https://dashboard.render.com/
2. 点 "New +" → "Web Service"
3. 选 "Build and deploy from a Git repository" → "Next"

### 2.2 连接你的 GitHub 仓库

- 第一次会让你授权 Render 访问 GitHub
- 选择 `qingti-project` 仓库 → "Connect"

### 2.3 配置部署参数

填写以下信息：

| 字段 | 值 |
|------|-----|
| **Name** | `qingti-api`（这会成为你的后端域名 qingti-api.onrender.com） |
| **Region** | Singapore（离中国最近） |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ 重要 |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python train.py` |
| **Start Command** | `uvicorn api:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

✨ **关键解释**：
- Build Command 里加了 `python train.py`，意思是**部署时自动训练模型**，这样你不需要把 model.pkl 推到 GitHub
- 但前提是 `ObesityDataSet_raw_and_data_sinthetic.csv` 要在 backend/ 目录里推上 GitHub 了

### 2.4 点 "Create Web Service"

Render 会开始构建，全过程大概 5-10 分钟。第一次会比较慢，因为要下载 xgboost 等大依赖。

构建日志里你会看到：
```
正在加载数据...
正在训练 XGBoost...
✅ 训练完成！测试集准确率: 95.xx%
```

完成后顶部显示 "Live"，复制你的服务地址（形如 `https://qingti-api.onrender.com`），下一步要用。

### 2.5 测试后端

打开浏览器访问 `https://你的服务名.onrender.com/`，应该看到：
```json
{"service":"轻体 API","status":"running","model_accuracy":"95.xx%"}
```

⚠️ Render 免费版有个特点：**15 分钟没人访问就会休眠**，下次访问要等 30 秒左右"冷启动"。这是免费的代价。

✅ **完成**: 后端上线了。

---

## 第 3 步：部署前端到 Vercel

### 3.1 登录 Vercel

1. 访问 https://vercel.com/new
2. 找到你的 `qingti-project` 仓库 → "Import"

### 3.2 配置部署参数

| 字段 | 值 |
|------|-----|
| **Project Name** | `qingti`（默认即可） |
| **Framework Preset** | Next.js（自动识别） |
| **Root Directory** | 点"Edit"，选择 `frontend` ⚠️ 重要 |

### 3.3 配置环境变量（关键！）

展开 "Environment Variables"，添加一项：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://你的render服务名.onrender.com`（注意没有最后的斜杠） |

### 3.4 点 "Deploy"

构建大概 2-3 分钟。完成后会得到 `https://qingti-xxx.vercel.app` 的地址。

### 3.5 测试前端

打开 Vercel 给的地址，应该能看到完整网站。滑到"测一测"试一下，应该能调通后端的真实模型。

⚠️ 如果"测一测"报错，可能是后端 Render 在冷启动，等 30 秒重试。

✅ **完成**: 前端上线了，整个网站可以全世界访问了！

---

## 第 4 步：买域名 + 绑定

### 4.1 在哪买域名

国内推荐（需要实名认证）：
- **腾讯云**: https://dnspod.cloud.tencent.com/  （`.com` 大约 70 元/年）
- **阿里云**: https://wanwang.aliyun.com/

国外推荐（不用实名）：
- **Namecheap**: https://www.namecheap.com/ （`.com` 大约 9 美元 ≈ 65 元/年）
- **Cloudflare**: https://www.cloudflare.com/products/registrar/ （成本价，最便宜）

### 4.2 取一个域名

建议长这样：
- `qingti.com` / `qingti.net`
- `qingti.app`（健康相关用 .app 不错）
- `qingti.health`

### 4.3 在 Vercel 绑定域名

1. 进入你的 Vercel 项目 → Settings → Domains
2. 输入你买的域名（如 `qingti.com`）→ Add
3. Vercel 会显示需要在域名注册商那边添加的 DNS 记录

通常是这两条：
- `A 记录`：指向 Vercel 的 IP（如 76.76.21.21）
- `CNAME 记录`：`www` 指向 `cname.vercel-dns.com`

### 4.4 在域名注册商那边设置 DNS

回到你买域名的网站，找到"DNS 解析"页面，按 Vercel 的提示添加记录。

DNS 生效通常要 5 分钟 ~ 几小时。

### 4.5 大功告成

打开 `https://qingti.com`（你买的那个域名），就是你的网站了！

---

## 后续维护

### 修改代码后怎么更新到线上？

```bash
cd qingti-project
git add .
git commit -m "更新了 xxx"
git push
```

推完之后，Vercel 和 Render 会**自动重新部署**，2-5 分钟后线上就更新了。这就是 GitHub + Vercel/Render 的魅力。

### 如何看错误日志？

- 后端日志：Render Dashboard → 你的服务 → Logs
- 前端日志：Vercel Dashboard → 你的项目 → Deployments → 点最新一次

---

## 常见问题

### Q1: 后端构建失败，说找不到数据集

**原因**: 数据集 CSV 没推到 GitHub。
**解决**: 把 `ObesityDataSet_raw_and_data_sinthetic.csv` 放到 `backend/` 目录里，重新 git push。

### Q2: 后端构建失败，提示 xgboost 安装失败

**原因**: Render 免费版内存只有 512MB，xgboost 编译可能 OOM。
**解决**: 在 `requirements.txt` 里把 `xgboost==2.1.2` 改成 `xgboost==1.7.6`（更轻量）。

### Q3: 前端显示了，但点"看看结果"报错

**原因**: 大概率是 Render 后端在冷启动。
**解决**: 先访问 `https://你的render服务名.onrender.com/`，等返回 JSON 后再回去试。

### Q4: 域名解析了但访问不通

**原因**: DNS 缓存。
**解决**: 等 30 分钟 ~ 24 小时。Windows 命令行执行 `ipconfig /flushdns` 刷一下本地缓存。

---

## 附录 A：如果 model.pkl 太大推不上去

不要把 model.pkl 推到 GitHub。在项目根目录建一个 `.gitignore` 文件，内容：

```
backend/model.pkl
backend/venv/
backend/__pycache__/
backend/test_accuracy.txt
frontend/node_modules/
frontend/.next/
frontend/.env.local
.DS_Store
```

然后：
```bash
git rm --cached backend/model.pkl 2>nul
git add .gitignore
git commit -m "ignore generated files"
git push
```

部署到 Render 时，模型会在云端通过 `train.py` 重新训练。

---

## 附录 B：成本估算

| 项目 | 价格 |
|------|------|
| GitHub | 免费 |
| Render Free Web Service | 免费（750 小时/月，够用） |
| Vercel Hobby | 免费 |
| 域名 (.com) | 60-80 元 / 年 |
| **合计** | **60-80 元/年** |

如果你想避免 Render 冷启动（永远在线），可以升级到 Render Starter（$7/月 ≈ 50 元/月）。但对于个人项目来说，免费版完全够。

---

🎉 **祝你部署顺利！**

如果遇到任何问题，把错误信息复制给 Claude，我来帮你解决。
