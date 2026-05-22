<#
.SYNOPSIS
  Runs an 8-hour automation loop for enriching this project.

.DESCRIPTION
  The script is intentionally safe by default:
  - It generates iteration prompts.
  - It runs frontend/backend validation commands.
  - It writes logs and progress reports.
  - It only calls an implementation agent when -ImplementCommand is provided.
  - It only commits/pushes when -AutoCommit/-AutoPush are provided.

  This file uses ASCII-only strings so Windows PowerShell can parse it
  reliably even when the file has no UTF-8 BOM.

.EXAMPLE
  .\scripts\auto-enrich-8h.ps1 -Once -SkipInstall

.EXAMPLE
  .\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -RunE2E -AutoCommit

.EXAMPLE
  .\scripts\auto-enrich-8h.ps1 -DurationHours 8 -IterationMinutes 30 -RunE2E -AutoCommit -AutoPush

.EXAMPLE
  .\scripts\auto-enrich-8h.ps1 -ImplementCommand 'codex exec --full-auto --skip-git-repo-check "$(Get-Content -Raw {PROMPT_FILE})"'
#>

param(
  [double]$DurationHours = 8,
  [int]$IterationMinutes = 30,
  [switch]$Once,
  [switch]$SkipInstall,
  [switch]$RunE2E,
  [switch]$AutoCommit,
  [switch]$AutoPush,
  [string]$ImplementCommand = $env:AI_WORKBENCH_IMPLEMENT_COMMAND
)

$ErrorActionPreference = 'Stop'

$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$AutomationDir = Join-Path $Root '.automation'
$LogDir = Join-Path $AutomationDir 'logs'
$PromptDir = Join-Path $AutomationDir 'prompts'
$ReportPath = Join-Path $AutomationDir 'progress.md'

New-Item -ItemType Directory -Force -Path $AutomationDir, $LogDir, $PromptDir | Out-Null

function Write-Log {
  param(
    [string]$Message,
    [string]$Level = 'INFO'
  )

  $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  $line = "[$timestamp][$Level] $Message"
  Write-Host $line
  Add-Content -Path (Join-Path $LogDir 'automation.log') -Value $line -Encoding UTF8
}

function Invoke-LoggedCommand {
  param(
    [string]$Name,
    [string]$Command,
    [string]$WorkingDirectory = $Root,
    [switch]$AllowFailure
  )

  $safeName = $Name -replace '[^\w.-]', '-'
  $logFile = Join-Path $LogDir ("{0:yyyyMMdd-HHmmss}-{1}.log" -f (Get-Date), $safeName)
  $stdoutFile = Join-Path $LogDir ("{0:yyyyMMdd-HHmmss}-{1}.stdout.log" -f (Get-Date), $safeName)
  $stderrFile = Join-Path $LogDir ("{0:yyyyMMdd-HHmmss}-{1}.stderr.log" -f (Get-Date), $safeName)
  Write-Log "RUN $Name :: $Command"

  $process = Start-Process `
    -FilePath 'powershell' `
    -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', $Command) `
    -WorkingDirectory $WorkingDirectory `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutFile `
    -RedirectStandardError $stderrFile `
    -PassThru `
    -Wait

  $exitCode = $process.ExitCode
  $stdout = if (Test-Path $stdoutFile) { Get-Content $stdoutFile -Raw -ErrorAction SilentlyContinue } else { '' }
  $stderr = if (Test-Path $stderrFile) { Get-Content $stderrFile -Raw -ErrorAction SilentlyContinue } else { '' }
  if ($null -eq $stdout) { $stdout = '' }
  if ($null -eq $stderr) { $stderr = '' }
  Set-Content -Path $logFile -Value ($stdout + "`n" + $stderr) -Encoding UTF8

  if ($exitCode -ne 0) {
    $message = "$Name failed with exit code $exitCode. See $logFile"
    if ($AllowFailure) {
      Write-Log $message 'WARN'
      return $false
    }

    throw $message
  }

  Write-Log "PASS $Name"
  return $true
}

function Get-GitHasChanges {
  $status = git -C $Root status --porcelain
  $joined = $status -join ''
  return -not [string]::IsNullOrWhiteSpace($joined)
}

function Get-CurrentPhase {
  param([double]$ElapsedHours)

  $phases = @(
    @{
      Name = 'Backend foundation'
      Start = 0.0
      End = 1.0
      Goal = 'Create a runnable Fastify backend with health checks.'
      Tasks = @(
        'Complete server package scripts, tsconfig and env example.',
        'Keep app/server layering clear.',
        'Ensure GET /api/health works.',
        'Install backend dependencies and pass backend typecheck.'
      )
    },
    @{
      Name = 'Database and auth'
      Start = 1.0
      End = 2.0
      Goal = 'Complete Prisma SQLite, register, login, JWT and current user APIs.'
      Tasks = @(
        'Complete Prisma schema and database initialization.',
        'Implement register, login and me endpoints.',
        'Implement password hashing and JWT verification.',
        'Add backend auth API tests.'
      )
    },
    @{
      Name = 'Dataset and project persistence'
      Start = 2.0
      End = 3.5
      Goal = 'Persist dataset summaries and dashboard projects through the backend.'
      Tasks = @(
        'Implement datasets CRUD APIs.',
        'Implement projects CRUD APIs.',
        'Add frontend API clients.',
        'Make projectStore prefer API persistence and keep localStorage fallback.'
      )
    },
    @{
      Name = 'AI backend proxy and reports'
      Start = 3.5
      End = 5.0
      Goal = 'Move AI analysis behind the backend and persist AI reports.'
      Tasks = @(
        'Implement POST /api/ai/analyze.',
        'Return mock Markdown when no AI key is configured.',
        'Persist AiReport records.',
        'Load report history from the backend.'
      )
    },
    @{
      Name = 'Commercial controls'
      Start = 5.0
      End = 6.0
      Goal = 'Add FREE/PRO/TEAM plan display and basic usage limits.'
      Tasks = @(
        'Implement UsageLog.',
        'Limit FREE users daily AI analysis count.',
        'Show current plan and remaining usage in the frontend.',
        'Show upgrade prompt when usage is exceeded.'
      )
    },
    @{
      Name = 'Product polish'
      Start = 6.0
      End = 7.0
      Goal = 'Make the app feel complete and demo-ready.'
      Tasks = @(
        'Add login and register pages.',
        'Add unified API error messages.',
        'Handle expired login by redirecting to login.',
        'Add save success, AI retry and commercial value content.'
      )
    },
    @{
      Name = 'Tests docs and CI'
      Start = 7.0
      End = 8.0
      Goal = 'Prepare a handoff-quality full-stack MVP.'
      Tasks = @(
        'Update frontend/backend startup docs.',
        'Add backend API tests and frontend login E2E.',
        'Update GitHub Actions for frontend and backend checks.',
        'Make lint, typecheck, tests, build and e2e pass where practical.'
      )
    }
  )

  foreach ($phase in $phases) {
    if ($ElapsedHours -ge $phase.Start -and $ElapsedHours -lt $phase.End) {
      return $phase
    }
  }

  return $phases[-1]
}

function New-PhasePrompt {
  param(
    [hashtable]$Phase,
    [int]$Iteration,
    [double]$ElapsedHours
  )

  $taskLines = ($Phase.Tasks | ForEach-Object { "- $_" }) -join "`n"
  $prompt = @"
You are improving the ai-data-analysis-workbench repository.

Iteration: $Iteration
Elapsed hours: $([Math]::Round($ElapsedHours, 2))
Phase: $($Phase.Name)
Phase goal: $($Phase.Goal)

Tasks for this iteration:
$taskLines

Rules:
- Preserve the existing Vue frontend.
- Backend stack: Fastify + TypeScript + Prisma + SQLite.
- Add concise Chinese comments for complex business logic.
- Prioritize a demoable full-stack commercial MVP.
- Do not delete user changes.
- Prefer focused implementation over broad rewrites.
- If blocked, write the blocker and next step into docs/automation-notes.md.

Validation priority:
1. npm run typecheck
2. npm run test
3. npm run build
4. cd server; npm run typecheck
5. cd server; npm run test
6. cd server; npm run build
"@

  $promptPath = Join-Path $PromptDir ("iteration-{0:D3}.md" -f $Iteration)
  Set-Content -Path $promptPath -Value $prompt -Encoding UTF8
  return $promptPath
}

function Invoke-ImplementationCommand {
  param([string]$PromptPath)

  if ([string]::IsNullOrWhiteSpace($ImplementCommand)) {
    Write-Log "No ImplementCommand configured. Prompt generated at $PromptPath" 'WARN'
    return
  }

  $command = $ImplementCommand.Replace('{PROMPT_FILE}', $PromptPath).Replace('{ROOT}', $Root)
  Invoke-LoggedCommand -Name 'implement-command' -Command $command -WorkingDirectory $Root -AllowFailure
}

function Invoke-FrontendChecks {
  $null = Invoke-LoggedCommand -Name 'frontend-lint' -Command 'npm run lint' -WorkingDirectory $Root -AllowFailure
  $null = Invoke-LoggedCommand -Name 'frontend-typecheck' -Command 'npm run typecheck' -WorkingDirectory $Root -AllowFailure
  $null = Invoke-LoggedCommand -Name 'frontend-test' -Command 'npm run test' -WorkingDirectory $Root -AllowFailure
  $null = Invoke-LoggedCommand -Name 'frontend-build' -Command 'npm run build' -WorkingDirectory $Root -AllowFailure

  if ($RunE2E) {
    $null = Invoke-LoggedCommand -Name 'frontend-e2e' -Command 'npm run e2e' -WorkingDirectory $Root -AllowFailure
  }
}

function Invoke-BackendChecks {
  $serverPath = Join-Path $Root 'server'
  if (-not (Test-Path (Join-Path $serverPath 'package.json'))) {
    Write-Log 'server/package.json not found, skipping backend checks' 'WARN'
    return
  }

  if (-not $SkipInstall -and -not (Test-Path (Join-Path $serverPath 'node_modules'))) {
    $null = Invoke-LoggedCommand -Name 'server-install' -Command 'npm install' -WorkingDirectory $serverPath -AllowFailure
  }

  $null = Invoke-LoggedCommand -Name 'server-prisma-generate' -Command 'npm run prisma:generate' -WorkingDirectory $serverPath -AllowFailure
  $null = Invoke-LoggedCommand -Name 'server-typecheck' -Command 'npm run typecheck' -WorkingDirectory $serverPath -AllowFailure
  $null = Invoke-LoggedCommand -Name 'server-test' -Command 'npm run test' -WorkingDirectory $serverPath -AllowFailure
  $null = Invoke-LoggedCommand -Name 'server-build' -Command 'npm run build' -WorkingDirectory $serverPath -AllowFailure
}

function Save-Progress {
  param(
    [hashtable]$Phase,
    [int]$Iteration,
    [double]$ElapsedHours,
    [string]$PromptPath
  )

  $status = git -C $Root status --short
  $entry = @"

## Iteration $Iteration - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

- Elapsed hours: $([Math]::Round($ElapsedHours, 2))
- Phase: $($Phase.Name)
- Goal: $($Phase.Goal)
- Prompt: $PromptPath

### Git Status

````text
$($status -join "`n")
````
"@

  Add-Content -Path $ReportPath -Value $entry -Encoding UTF8
}

function Invoke-AutoCommit {
  param(
    [hashtable]$Phase,
    [int]$Iteration
  )

  if (-not $AutoCommit) {
    return
  }

  if (-not (Get-GitHasChanges)) {
    Write-Log 'No changes to commit'
    return
  }

  git -C $Root add .
  git -C $Root commit -m "chore: automation iteration $Iteration - $($Phase.Name)"

  if ($LASTEXITCODE -ne 0) {
    Write-Log 'git commit failed' 'WARN'
    return
  }

  if ($AutoPush) {
    git -C $Root push origin main
    if ($LASTEXITCODE -ne 0) {
      Write-Log 'git push failed' 'WARN'
    }
  }
}

Write-Log "Automation started. Root=$Root DurationHours=$DurationHours IterationMinutes=$IterationMinutes"

if (-not $SkipInstall) {
  if (-not (Test-Path (Join-Path $Root 'node_modules'))) {
    Invoke-LoggedCommand -Name 'frontend-install' -Command 'npm install' -WorkingDirectory $Root -AllowFailure
  }
}

$start = Get-Date
$deadline = $start.AddHours($DurationHours)
$iteration = 1

while ($true) {
  $now = Get-Date
  $elapsedHours = ($now - $start).TotalHours
  if ($now -ge $deadline) {
    Write-Log 'Reached automation deadline'
    break
  }

  $phase = Get-CurrentPhase -ElapsedHours $elapsedHours
  Write-Log "Iteration $iteration phase: $($phase.Name)"

  $promptPath = New-PhasePrompt -Phase $phase -Iteration $iteration -ElapsedHours $elapsedHours
  Invoke-ImplementationCommand -PromptPath $promptPath
  Invoke-FrontendChecks
  Invoke-BackendChecks
  Save-Progress -Phase $phase -Iteration $iteration -ElapsedHours $elapsedHours -PromptPath $promptPath
  Invoke-AutoCommit -Phase $phase -Iteration $iteration

  if ($Once) {
    Write-Log 'Once mode completed'
    break
  }

  $iteration += 1
  Write-Log "Sleeping $IterationMinutes minutes before next iteration"
  Start-Sleep -Seconds ($IterationMinutes * 60)
}

Write-Log 'Automation finished'
