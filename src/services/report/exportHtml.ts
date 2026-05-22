import { saveAs } from 'file-saver'
import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

export function exportHtmlReport(filename: string, markdownContent: string): void {
  const html = buildHtmlReportDocument(markdownContent)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  saveAs(blob, filename.endsWith('.html') ? filename : `${filename}.html`)
}

export function buildHtmlReportDocument(markdownContent: string): string {
  // HTML 报告仍然以 Markdown 为单一内容源，避免 Markdown/HTML 两套报告模板后续出现信息不一致。
  const renderedContent = markdown.render(markdownContent)

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI 数据分析报告</title>
  <style>
    :root {
      color: #111827;
      background: #f6f8fb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
    }

    body {
      margin: 0;
      padding: 32px;
      background: #f6f8fb;
    }

    main {
      max-width: 920px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      padding: 36px;
      box-shadow: 0 12px 32px rgb(15 23 42 / 8%);
    }

    h1 {
      margin-top: 0;
      font-size: 30px;
      line-height: 1.25;
    }

    h2 {
      margin-top: 32px;
      border-bottom: 1px solid #eef2f7;
      padding-bottom: 8px;
      font-size: 19px;
    }

    p,
    li {
      line-height: 1.8;
    }

    code {
      border-radius: 4px;
      background: #f3f4f6;
      padding: 2px 5px;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }

      main {
        border: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <main>
${renderedContent}
  </main>
</body>
</html>`
}
