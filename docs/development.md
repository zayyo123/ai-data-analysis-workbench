# Development

## 环境

- Node.js >= 20
- npm >= 10
- 前端默认端口：`5174`
- 后端默认端口：`4000`

## 前端本地模式

只运行前端即可完成上传、解析、图表、Mock AI 和 Markdown 导出。

```bash
npm install
npm run dev -- --port 5174
```

## 全栈开发模式

终端 A：

```bash
cd server
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed:demo
npm run dev
```

终端 B：

```bash
npm install
npm run dev -- --port 5174
```

如果后端没有启动，前端仍然可以走本地演示模式；注册登录、云端项目保存、AI 用量和报告列表需要后端在线。

## 数据库说明

第一版使用 SQLite + Prisma，适合本地演示和轻量部署。后端保存：

- 用户和密码哈希。
- 数据集字段摘要和前 20 行样本。
- 项目 Dashboard 配置。
- AI 报告内容。
- AI 用量记录。

后端 MVP 不保存全量明细 rows，避免 SQLite 文件快速膨胀。云端恢复工作台时使用数据样本快照，完整明细仍由用户上传或后续对象存储方案承接。

## 演示账号

后端提供可重复执行的演示数据初始化命令：

```bash
cd server
npm run seed:demo
```

该命令会创建或更新下面的账号，并预置销售数据集、Dashboard 和一份 AI 报告，方便销售演示、作品集录屏和部署验收：

```text
邮箱：demo@example.com
密码：password123
套餐：Pro
```

Seed 脚本是幂等的，重复执行会覆盖同一个演示项目，避免演示环境越跑越乱。

## 验证命令

前端：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
npm run e2e:fullstack
```

后端：

```bash
cd server
npm run typecheck
npm run test
npm run build
```

Windows 中文路径下如遇到 Prisma `db push` 或 `migrate` schema engine 空错误，可以先在纯英文路径验证数据库迁移；当前 `server/tests/setupTestDatabase.ts` 已用 SQL 建表绕开本地测试阻塞。

`npm run e2e:fullstack` 会使用 `server/.env.e2e` 启动真实后端，并在执行前重置 `server/prisma/e2e.db`。它覆盖注册、云端项目保存、AI 报告生成、用量展示和远程项目恢复链路。

## 示例流程

1. 打开首页。
2. 未登录时点击“销售经营分析”示例数据，验证本地模式完整链路。
3. 使用 `demo@example.com` / `password123` 登录，或注册一个新账号。
4. 再次加载示例数据，确认项目写入后端。
5. 返回首页打开最近项目，确认 Dashboard 和云端样本快照恢复。
6. 生成 AI 分析，确认套餐用量增加。
7. 在套餐卡点击升级 Pro，确认用量变为 AI 不限次。
8. 在 AI 面板点击已保存报告，确认历史报告可读回。
9. 进入报告页导出 Markdown。

当前升级接口是 Mock 商业化闭环，用于演示免费版转 Pro / Team 的产品路径；接入真实支付后，应由 Stripe / Lemon Squeezy / Paddle 等支付回调校验订阅状态，再更新用户套餐。
