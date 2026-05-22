# 8 小时后端打通与商业化交付计划

目标：在 8 小时内，把当前 AI Data Analysis Workbench 从纯前端演示项目升级成一个前后端打通、功能完整、可部署、可演示、具备商业前景的 MVP 项目。

这个计划的核心原则是：不追求一次性做成大型 SaaS，而是做成一个可以真实登录、上传数据、保存项目、调用 AI、导出报告、可对外演示的商业化雏形。

## 1. 最终交付目标

8 小时结束时，项目应具备：

- 前端：继续使用现有 Vue 3 + TypeScript 工作台。
- 后端：新增 Node.js API 服务。
- 数据库：使用 SQLite + Prisma，方便本地开发和部署迁移。
- 鉴权：支持邮箱密码登录，使用 JWT。
- 项目管理：用户可以保存、读取、删除自己的分析项目。
- 数据集管理：用户可以上传 CSV / Excel，后端保存文件元信息和解析摘要。
- AI 分析：前端调用后端 AI 接口，后端统一封装 Mock / OpenAI 兼容模式。
- 报告管理：AI 报告可保存到后端，并可重新打开。
- 商业化基础：保留套餐、用量限制、团队空间、审计日志的扩展结构。
- 部署：前端可部署 Vercel，后端可部署 Render / Railway / Fly.io。

## 2. 技术方案

### 2.1 后端选型

推荐使用：

- Node.js 20
- Fastify
- TypeScript
- Prisma
- SQLite
- JWT
- Zod
- Multer 或 Fastify multipart

选择原因：

- Fastify 启动快、代码少，适合 8 小时内交付。
- SQLite 不需要额外数据库服务，适合本地和作品集演示。
- Prisma 让数据模型清晰，后续可迁移 PostgreSQL。
- JWT 足够支撑 MVP 登录态。
- Zod 保证接口入参校验，不让后端变成随意 JSON 接收器。

### 2.2 目录规划

新增后端目录：

```text
server/
  prisma/
    schema.prisma
    seed.ts
  src/
    app.ts
    server.ts
    config/
      env.ts
    plugins/
      auth.ts
      prisma.ts
    modules/
      auth/
        auth.routes.ts
        auth.service.ts
        auth.schema.ts
      datasets/
        datasets.routes.ts
        datasets.service.ts
        datasets.schema.ts
      projects/
        projects.routes.ts
        projects.service.ts
        projects.schema.ts
      ai/
        ai.routes.ts
        ai.service.ts
        promptBuilder.ts
      reports/
        reports.routes.ts
        reports.service.ts
      billing/
        billing.routes.ts
        billing.service.ts
    utils/
      password.ts
      errors.ts
      id.ts
  package.json
  tsconfig.json
  .env.example
```

前端新增：

```text
src/services/api/
  httpClient.ts
  authApi.ts
  datasetApi.ts
  projectApi.ts
  aiApi.ts
src/stores/authStore.ts
src/views/LoginView.vue
src/views/RegisterView.vue
```

## 3. 数据库模型

第一版数据库模型必须能支撑商业化扩展。

```prisma
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  plan         Plan      @default(FREE)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  projects     Project[]
  datasets     Dataset[]
  aiReports    AiReport[]
}

model Dataset {
  id          String   @id @default(cuid())
  userId      String
  name        String
  fileName    String
  fileType    String
  rowCount    Int
  fieldCount  Int
  fieldsJson  String
  sampleJson  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id])
  projects    Project[]
}

model Project {
  id            String   @id @default(cuid())
  userId        String
  datasetId     String
  name          String
  dashboardJson String
  filtersJson   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id])
  dataset       Dataset  @relation(fields: [datasetId], references: [id])
  aiReports     AiReport[]
}

model AiReport {
  id          String   @id @default(cuid())
  userId      String
  projectId   String
  type        String
  promptTitle String
  content     String
  tokenUsage  Int      @default(0)
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  project     Project  @relation(fields: [projectId], references: [id])
}

model UsageLog {
  id        String   @id @default(cuid())
  userId    String
  action    String
  amount    Int      @default(1)
  createdAt DateTime @default(now())
}

enum Plan {
  FREE
  PRO
  TEAM
}
```

商业化预留点：

- `User.plan` 用于套餐。
- `UsageLog` 用于限制上传次数、AI 次数、报告导出次数。
- `AiReport.tokenUsage` 用于未来计费。
- 后续可以加入 `Workspace`、`TeamMember`、`Subscription`。

## 4. API 设计

### 4.1 Auth

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

返回：

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "demo@example.com",
    "name": "Demo User",
    "plan": "FREE"
  }
}
```

### 4.2 Dataset

```http
POST   /api/datasets
GET    /api/datasets
GET    /api/datasets/:id
DELETE /api/datasets/:id
```

`POST /api/datasets` 接收：

```json
{
  "name": "销售经营分析",
  "fileName": "sales.csv",
  "fileType": "csv",
  "rowCount": 1000,
  "fields": [],
  "sampleRows": []
}
```

说明：

- 8 小时版本不强制后端解析完整 CSV。
- 前端仍负责解析和字段识别。
- 后端保存字段摘要、样本数据和元信息。
- 后续商业版再把完整文件上传、异步解析和对象存储补上。

### 4.3 Project

```http
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

保存 Dashboard：

```json
{
  "name": "销售分析项目",
  "datasetId": "dataset_id",
  "dashboard": {},
  "filters": []
}
```

### 4.4 AI

```http
POST /api/ai/analyze
```

请求：

```json
{
  "projectId": "project_id",
  "datasetSummary": {},
  "dashboardSummary": {},
  "analysisType": "summary"
}
```

返回：

```json
{
  "reportId": "report_id",
  "content": "Markdown analysis content",
  "tokenUsage": 1200
}
```

8 小时版本默认：

- 无 API Key：后端返回 Mock AI 分析。
- 有 API Key：调用真实 AI 服务。

### 4.5 Report

```http
GET /api/reports/:projectId
```

返回项目下所有 AI 报告。

## 5. 8 小时时间安排

### 第 1 小时：后端工程初始化

目标：后端项目能启动。

任务：

- 创建 `server/` 目录。
- 初始化 `package.json`、`tsconfig.json`。
- 安装 Fastify、Prisma、Zod、JWT、bcrypt。
- 创建 `app.ts` 和 `server.ts`。
- 配置 `.env.example`。
- 创建健康检查接口 `GET /api/health`。

验收：

```bash
cd server
npm install
npm run dev
curl http://localhost:4000/api/health
```

返回：

```json
{ "status": "ok" }
```

### 第 2 小时：数据库和鉴权

目标：可以注册、登录、拿到当前用户。

任务：

- 编写 Prisma schema。
- 执行 migration。
- 实现密码哈希。
- 实现 JWT 签发和校验。
- 实现 `register`、`login`、`me`。
- 前端新增登录页和 `authStore`。

验收：

- 用户可以注册。
- 用户可以登录。
- 前端刷新后可以通过 token 恢复登录态。

### 第 3 小时：数据集保存接口

目标：前端解析后的数据摘要可以保存到后端。

任务：

- 实现 `POST /api/datasets`。
- 实现 `GET /api/datasets`。
- 实现 `GET /api/datasets/:id`。
- 前端上传/示例数据解析后，把数据集元信息保存到后端。
- 数据集列表从后端读取。

验收：

- 登录用户上传数据后，刷新页面仍能看到数据集记录。
- 不同用户只能看到自己的数据集。

### 第 4 小时：项目保存接口

目标：Dashboard 项目真正持久化到后端。

任务：

- 实现 `POST /api/projects`。
- 实现 `PUT /api/projects/:id`。
- 实现 `GET /api/projects`。
- 实现 `GET /api/projects/:id`。
- 前端 `projectStore` 从 localStorage 升级为 API 优先。
- localStorage 仅保留 token 和轻量 UI 偏好。

验收：

- 添加图表后点击保存，后端保存 Dashboard。
- 刷新页面后，从后端恢复项目。
- 删除项目后列表同步变化。

### 第 5 小时：AI 后端代理

目标：前端不再直接处理 AI 真实接口，由后端统一代理。

任务：

- 实现 `POST /api/ai/analyze`。
- 后端构造 Prompt。
- 无 API Key 走 Mock。
- 有 API Key 走真实 AI 服务。
- 保存 AI 报告到 `AiReport`。
- 前端 `aiStore` 改为调用后端接口。

验收：

- 点击“生成 AI 分析”后，后端生成报告。
- 报告保存到数据库。
- 重新打开项目能看到历史 AI 报告。

### 第 6 小时：报告和商业化基础

目标：项目开始具备商业产品形态。

任务：

- 实现 `GET /api/reports/:projectId`。
- 前端报告页从后端加载报告。
- 增加用户套餐展示：FREE / PRO / TEAM。
- 增加用量限制逻辑：
  - FREE：每日 AI 分析 5 次。
  - FREE：最多保存 10 个项目。
  - PRO / TEAM 预留无限制。
- 实现 `UsageLog` 写入。

验收：

- 免费用户超过次数后，后端返回明确错误。
- 前端显示升级提示。

### 第 7 小时：体验打磨和错误处理

目标：让项目能给别人演示，不像半成品。

任务：

- 统一后端错误格式。
- 前端增加 API 错误提示。
- 登录过期自动跳转登录页。
- Dashboard 保存成功显示提示。
- AI 生成失败显示重试按钮。
- 首页增加“商业价值”区域：
  - 自动数据分析
  - AI 报告生成
  - 团队数据洞察
  - 适合中小企业经营分析

验收：

- 断网、未登录、接口失败都有清晰提示。
- 项目演示流程可以 3 分钟走完。

### 第 8 小时：测试、文档、部署准备

目标：形成完整可交付版本。

任务：

- 后端补核心接口测试：
  - 注册
  - 登录
  - 创建数据集
  - 创建项目
  - 生成 AI 报告
- 前端 E2E 增加登录流程。
- 更新 README：
  - 前后端启动方式
  - API 环境变量
  - 商业化路线图
  - 部署说明
- 增加 `docker-compose.yml` 可选。
- 更新 GitHub Actions：
  - frontend check
  - backend check

验收：

```bash
npm run typecheck
npm run test
npm run build
cd server
npm run typecheck
npm run test
npm run build
```

全部通过。

## 6. 商业化功能设计

### 6.1 目标用户

第一阶段目标用户：

- 中小企业运营人员。
- 电商店铺经营者。
- 市场投放人员。
- 数据分析初学者。
- 咨询顾问和自由职业者。

### 6.2 核心卖点

- 不需要写 SQL。
- 上传表格即可生成 Dashboard。
- AI 自动输出经营分析报告。
- 报告可以导出给老板、客户或团队。
- 比传统 BI 更轻，比纯 ChatGPT 更结构化。

### 6.3 可收费功能

免费版：

- 每日 5 次 AI 分析。
- 最多 10 个项目。
- 支持 CSV / Excel。
- 支持 Markdown 报告。

Pro 版：

- 无限项目。
- 更多 AI 分析次数。
- PDF / HTML 报告导出。
- 更大的文件上传。
- 自定义报告模板。

Team 版：

- 团队空间。
- 成员权限。
- 共享 Dashboard。
- 审计日志。
- 企业数据保留策略。

### 6.4 后续增长方向

- 接入 Stripe 支付。
- 支持云端文件存储。
- 支持自然语言生成图表。
- 支持自动异常检测。
- 支持定时报告。
- 支持分享链接。
- 支持企业私有化部署。

## 7. 关键取舍

8 小时内必须控制范围。

必须完成：

- 后端启动。
- 登录注册。
- 项目和数据集持久化。
- AI 后端代理。
- 报告保存。
- 基础用量限制。
- 前端能跑通完整登录后流程。

可以延后：

- 完整文件对象存储。
- 大文件异步解析。
- 真正的 Stripe 支付。
- 团队协作。
- PDF 高保真导出。
- 权限矩阵。
- 多租户工作区。

## 8. 最终演示脚本

演示控制在 3 到 5 分钟。

1. 打开首页，介绍项目定位：AI 数据分析工作台。
2. 注册并登录。
3. 点击“销售经营分析”示例数据。
4. 系统自动识别字段。
5. 添加推荐图表到 Dashboard。
6. 编辑图表标题和聚合方式。
7. 点击生成 AI 分析。
8. 保存 AI 报告。
9. 进入报告页，展示 Markdown 报告。
10. 刷新页面，证明项目从后端恢复。
11. 展示套餐和用量限制，说明商业化路径。

## 9. 交付清单

8 小时完成后应该提交：

- `server/` 后端源码。
- Prisma schema 和 migration。
- 前端 API client。
- 登录 / 注册页面。
- 后端项目保存接口。
- 后端 AI 分析接口。
- 后端报告接口。
- 前后端 `.env.example`。
- README 前后端启动说明。
- 基础接口测试。
- 前端 E2E 登录后流程测试。
- GitHub Actions 前后端 CI。

## 10. 成功标准

项目达到下面状态即可视为可交付：

- 新用户可以注册登录。
- 上传或加载示例数据后可以创建项目。
- Dashboard 可以保存到后端。
- AI 报告可以从后端生成和读取。
- 报告页可以展示完整分析报告。
- 刷新页面不会丢失项目。
- 有免费版用量限制。
- 文档能指导别人本地启动。
- 前后端测试和构建通过。

这就是一个具备商业前景的可交付 MVP，而不是单纯的前端作品集。
