# 轻体前端 - Next.js

## 本地运行步骤

### 第一次运行 

**1. 进入这个目录**

```bash
cd 你解压的位置/qingti-project/frontend
```

**2. 安装 Node.js 依赖**

```bash
npm install
```

⚠️ 如果下载很慢，使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

需要等 1-3 分钟。

**3. 配置 API 地址**

把 `.env.local.example` 复制一份，重命名为 `.env.local`：

```bash
copy .env.local.example .env.local
```

打开 `.env.local`，里面默认是：
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

本地开发不用改，部署的时候才需要改。

**4. 启动前端**

⚠️ 启动前端之前，**必须先确保后端在运行**（看 backend/README.md）。

```bash
npm run dev
```

看到这行说明启动成功：
```
▲ Next.js 14.2.18
- Local: http://localhost:3000
```

**5. 打开浏览器访问 http://localhost:3000**

应该能看到完整的"轻体"网站。

往下滑到"测一测"，填表 → 点"看看结果"，应该能看到来自你后端真实模型的预测结果。

## 后续启动

```bash
cd 你的位置/qingti-project/frontend
npm run dev
```

## 文件说明

| 文件 | 作用 |
|------|------|
| `app/page.tsx` | 主页（首屏） |
| `app/layout.tsx` | 全局布局（含 SEO 标题） |
| `app/globals.css` | 全局样式 |
| `components/` | 各个组件 |
| `lib/api.ts` | API 调用封装 |
| `tailwind.config.js` | Tailwind 主题（颜色配置在这里） |
| `.env.local` | 环境变量（重要：API 地址） |
