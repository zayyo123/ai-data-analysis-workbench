# Development

## 启动

```bash
npm install
npm run dev
```

## 验证

```bash
npm run typecheck
npm run test
npm run build
```

## 示例流程

1. 打开首页。
2. 点击“销售经营分析”示例数据，或上传 `examples/sales.csv`。
3. 查看字段识别结果。
4. 添加推荐图表到 Dashboard。
5. 点击 Dashboard 图表，在右侧配置面板编辑标题、字段、聚合方式和 Top N。
6. 生成 Mock AI 分析。
7. 保存 AI 结果并导出 Markdown 报告。

## 当前增强点

- 首页内置示例数据入口，方便演示和面试讲解。
- Dashboard 图表支持选中态和配置编辑。
- 报告页使用 Markdown 渲染，不再只是纯文本预览。
- E2E 覆盖示例数据链路和本地 CSV 上传链路。
