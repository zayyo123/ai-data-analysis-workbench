# Deployment

项目由两个部分组成：

- 前端：Vue 3 + Vite，可部署到 Vercel / Netlify / 静态 CDN。
- 后端：Fastify + Prisma + SQLite，可部署到支持 Node.js 持久化磁盘的环境。

## 前端部署

推荐 Vercel 或 Netlify。

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: `20`

环境变量：

```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_ENABLE_MOCK_AI=true
VITE_AI_API_BASE_URL=
VITE_AI_API_KEY=
```

如果只部署前端演示站，可以不提供后端地址，应用仍可使用本地模式和 Mock AI。

## 后端部署

后端需要持久化 SQLite 文件。适合的部署形态：

- VPS / 云服务器。
- Render / Railway 等支持持久化卷的 Node.js 服务。
- Docker + volume。

基本命令：

```bash
cd server
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run build
npm run start
```

环境变量：

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=4000
CORS_ORIGIN="https://your-frontend-domain.com"
AI_API_BASE_URL=""
AI_API_KEY=""
ENABLE_MOCK_AI=true
```

## 商业化部署建议

SQLite 适合 MVP 和单机演示。进入真实商业化阶段后，建议迁移：

- 数据库：PostgreSQL。
- 文件存储：S3 / R2 / OSS，用于保存原始 CSV / Excel。
- AI 调用：后端统一代理，前端永不暴露真实 API Key。
- 计费：Stripe / Lemon Squeezy / Paddle。
- 队列：BullMQ / Cloud Tasks，用于大文件解析和定时报告。

## CI

GitHub Actions 已拆分为前端和后端两条任务：

- 前端：install、typecheck、test、build。
- 后端：install、typecheck、test、build。

Pull Request 合并前应保证两条任务全部通过。
