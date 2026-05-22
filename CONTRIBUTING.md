# Contributing

感谢你关注 AI Data Analysis Workbench。

## 本地开发

前端本地模式：

```bash
npm install
npm run dev -- --port 5174
```

后端：

```bash
cd server
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 提交前检查

前端：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e
```

后端：

```bash
cd server
npm run typecheck
npm run test
npm run build
```

## 分支命名

- `feat/xxx`：新功能
- `fix/xxx`：问题修复
- `docs/xxx`：文档
- `test/xxx`：测试

## Commit 规范

- `feat: add csv parser`
- `fix: handle empty csv`
- `docs: update development guide`
- `test: cover chart recommendation`

## 中文注释要求

字段识别、数据聚合、AI Prompt、报告导出、Worker 协议等关键逻辑必须写中文注释。简单赋值和明显判断不写无意义注释。
