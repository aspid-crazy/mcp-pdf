# PDF Builder MCP

Lets the chat agent make PDF documents and check how they look:

- **pdf-document** — flowing text with automatic pages: headings, paragraphs with
  Markdown (bold, italic, lists), images, colors, page size and margins;
- **pdf-layout** — elements at exact positions: flyers, title pages, slides;
- **pdf-resume** — a résumé from JSON Resume data;
- **pdf-image** — renders pages to PNG and returns them as images, so the agent sees the
  result and fixes the layout;
- **text-measure** — how much space a text takes before laying it out.

Text in any script the font covers, Cyrillic included; images from files or https links.

The extension registers [mcp-pdf](https://github.com/mcp-z/mcp-pdf) (our fork:
<https://github.com/aspid-crazy/mcp-pdf>) with the editor. It runs on the editor's own
Node: Node.js and npx are not needed. The server appears in **MCP: List Servers** as
**PDF**.

Files go to the **`kvantPdfMcp.outputFolder`** folder (default `pdf`) of the first
workspace folder.

## Build

`npm ci && npm run build` at the repo root, then here `node build.mjs` and
`npx @vscode/vsce package --no-dependencies --target win32-x64` (or `linux-x64`).
