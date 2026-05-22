# Architecture

项目采用 Vue 3 + TypeScript 单页应用架构。

- `components`：只负责 UI 和交互。
- `stores`：保存跨页面共享状态。
- `services`：解析、聚合、AI、报告导出等业务逻辑。
- `types`：统一领域模型。
- `utils`：纯工具函数。

核心原则：组件不直接写复杂算法，复杂逻辑放到可测试的纯函数中。
