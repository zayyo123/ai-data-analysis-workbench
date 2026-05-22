# 8 小时自动完善脚本使用说明

脚本路径：

```powershell
.\scripts\auto-enrich-8h.ps1
```

## 它会做什么

脚本会在 8 小时内按阶段推进项目：

1. 生成当前阶段的实施 Prompt。
2. 可选调用外部代码实现命令。
3. 运行前端检查。
4. 运行后端检查。
5. 写入 `.automation/progress.md` 和 `.automation/logs/`。
6. 可选自动提交和推送。

## 安全默认值

默认情况下，脚本不会自动改代码，也不会自动提交或推送。

它会：

- 生成 Prompt。
- 执行验证命令。
- 记录日志。

这适合先试跑：

```powershell
.\scripts\auto-enrich-8h.ps1 -Once
```

## 持续运行 8 小时

```powershell
.\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30
```

## 自动提交

```powershell
.\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -AutoCommit
```

## 自动提交并推送

```powershell
.\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -AutoCommit -AutoPush
```

## 接入外部代码执行器

脚本本身不会凭空写复杂业务代码。你可以通过 `-ImplementCommand` 接入任意代码执行器。

命令里可以使用占位符：

- `{PROMPT_FILE}`：本轮生成的 Prompt 文件路径。
- `{ROOT}`：项目根目录。

示例：

```powershell
.\scripts\auto-enrich-8h.ps1 `
  -DurationHours 8 `
  -IterationMinutes 30 `
  -ImplementCommand 'codex exec --full-auto --skip-git-repo-check "$(Get-Content -Raw {PROMPT_FILE})"' `
  -AutoCommit
```

也可以用环境变量：

```powershell
$env:AI_WORKBENCH_IMPLEMENT_COMMAND='codex exec --full-auto --skip-git-repo-check "$(Get-Content -Raw {PROMPT_FILE})"'
.\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -AutoCommit
```

## 推荐运行方式

第一轮先试跑：

```powershell
.\scripts\auto-enrich-8h.ps1 -Once
```

确认日志和命令正常后再持续运行：

```powershell
.\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -RunE2E -AutoCommit
```

如果你确认 GitHub 凭据可用，并希望自动推送：

```powershell
.\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -RunE2E -AutoCommit -AutoPush
```

## 输出文件

```text
.automation/
  progress.md
  prompts/
  logs/
```

这些是运行记录，不建议提交到 Git。
