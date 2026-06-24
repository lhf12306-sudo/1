# 有丝分裂装片 AI 评价系统

一个可本地运行、也可部署到公网的 React + Vite / Node.js + Express MVP。学生上传 JPG 或 PNG 显微图片后，后端接收图片并调用可切换的 AI Provider，返回结构化评价结果。

## 项目结构

```text
frontend/   React + Vite 前端
server/     Node.js + Express 后端
```

## 本地运行

### 1. 安装前端依赖

```powershell
cd frontend
npm.cmd install
```

### 2. 安装后端依赖

```powershell
cd server
npm.cmd install
```

### 3. 配置后端环境变量

```powershell
cd server
Copy-Item .env.example .env
```

第一版使用模拟 AI：

```env
AI_PROVIDER=mock
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

### 4. 启动后端

```powershell
cd server
$env:AI_PROVIDER="mock"
npm.cmd run dev
```

后端默认运行在：

```text
http://localhost:3001
```

健康检查：

```text
http://localhost:3001/api/health
```

### 5. 启动前端

另开一个终端：

```powershell
cd frontend
npm.cmd run dev -- --host 127.0.0.1
```

浏览器打开：

```text
http://127.0.0.1:5173
```

本地开发环境中，Vite 会把 `/api` 请求代理到 `http://localhost:3001`。

## 部署到公网

你需要分别部署：

- 后端 `server/`
- 前端 `frontend/`

推荐组合：

- 后端：Render / Railway / Fly.io / 云服务器
- 前端：Vercel / Netlify / Cloudflare Pages

下面以 Render + Vercel 为例。

## 方案 A：Render 部署后端

### 1. 上传代码到 GitHub

把整个项目上传到一个 GitHub 仓库。

### 2. 在 Render 新建 Web Service

选择该 GitHub 仓库，并设置：

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

### 3. 设置后端环境变量

Render 后台添加：

```env
NODE_ENV=production
AI_PROVIDER=mock
FRONTEND_ORIGIN=https://你的前端域名.vercel.app
```

第一次部署前端域名还不知道时，可以先临时填空或填本地地址；等 Vercel 部署完成后，再回到 Render 更新 `FRONTEND_ORIGIN`。

部署完成后，你会得到一个后端地址，例如：

```text
https://mitosis-slide-ai-server.onrender.com
```

确认健康检查可访问：

```text
https://mitosis-slide-ai-server.onrender.com/api/health
```

## 方案 A：Vercel 部署前端

### 1. 在 Vercel 导入同一个 GitHub 仓库

设置：

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### 2. 设置前端环境变量

Vercel 后台添加：

```env
VITE_API_BASE_URL=https://你的后端域名.onrender.com
```

注意：不要在末尾加 `/api`。前端代码会自动请求：

```text
${VITE_API_BASE_URL}/api/analyze
```

### 3. 部署并回填后端 CORS

Vercel 部署后会得到前端地址，例如：

```text
https://mitosis-slide-ai.vercel.app
```

回到 Render，把后端环境变量改为：

```env
FRONTEND_ORIGIN=https://mitosis-slide-ai.vercel.app
```

然后重新部署或重启后端服务。

## 方案 B：使用一台云服务器部署

如果你有阿里云、腾讯云、华为云或其他 VPS，也可以把前后端部署在同一台服务器：

1. 安装 Node.js。
2. 上传项目代码。
3. 后端运行 `npm install && npm start`。
4. 前端运行 `npm install && npm run build`。
5. 用 Nginx 托管 `frontend/dist`，并把 `/api` 反向代理到后端端口。
6. 配置 HTTPS 域名。

这种方式更适合长期正式使用，但配置比 Render/Vercel 稍复杂。

## OpenAI Provider 后续接入

当前 `server/services/openaiProvider.js` 只保留接入结构，不会调用真实 API。后续接入时：

1. 在 `server` 中安装官方 SDK：

```powershell
npm.cmd install openai
```

2. 在后端部署平台设置环境变量：

```env
AI_PROVIDER=openai
OPENAI_API_KEY=你的服务端 API Key
OPENAI_MODEL=支持视觉输入的模型名称
```

3. 完成 `openaiProvider.js` 中的 TODO：

- 读取图片；
- 调用支持图像输入的模型；
- 要求模型严格返回规定 JSON；
- 解析响应并交给 `resultValidator` 校验。

不要把 API Key 写死在前端或代码仓库里。

## API

`POST /api/analyze`

- Content-Type: `multipart/form-data`
- 图片字段名：`image`
- 支持：`image/jpeg`、`image/png`
- 最大：5MB

成功响应：

```json
{
  "success": true,
  "data": {
    "overallLevel": "良好",
    "totalScore": 78,
    "scores": {
      "clarity": 16,
      "staining": 15,
      "cellDensity": 12,
      "mitoticVisibility": 19,
      "fieldSelection": 16
    },
    "problems": ["部分区域焦点略有偏移"],
    "suggestions": ["拍摄前再次微调细准焦螺旋"],
    "teacherComment": "装片整体质量良好，继续优化清晰度和视野选择。"
  }
}
```

