# Contributing

感谢你关注 AI Data Analysis Workbench。

## 本地开发

```bash
npm install
npm run dev
```

## 提交前检查

```bash
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
