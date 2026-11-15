// Kvant wrapper: registers the mcp-pdf server with the editor.
//
// The agent builds PDFs from text, Markdown, images and positioned layouts, and renders
// pages back to PNG to look at the result. The server and its dependencies ship inside
// the VSIX (server/) and run on the editor's own Node. Generated files go to
// kvantPdfMcp.outputFolder inside the first workspace folder.
'use strict';

const vscode = require('vscode');
const path = require('path');

const PROVIDER_ID = 'kvant.pdf-mcp';
const CONFIG = 'kvantPdfMcp';

function activate(context) {
    const changed = new vscode.EventEmitter();
    const version = context.extension.packageJSON.version;

    context.subscriptions.push(
        changed,
        vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, {
            onDidChangeMcpServerDefinitions: changed.event,
            provideMcpServerDefinitions() {
                const folder = vscode.workspace.workspaceFolders?.[0];
                if (!folder || folder.uri.scheme !== 'file') {
                    return [];
                }
                const sub = vscode.workspace.getConfiguration(CONFIG).get('outputFolder', 'pdf');
                const out = path.resolve(folder.uri.fsPath, sub);
                const definition = new vscode.McpStdioServerDefinition(
                    'PDF',
                    process.execPath,
                    [path.join(context.extensionPath, 'server', 'bin', 'server.js'), '--resource-store-uri', out, '--log-level', 'warn'],
                    { ELECTRON_RUN_AS_NODE: '1' },
                    version,
                );
                definition.cwd = folder.uri;
                return [definition];
            },
        }),
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(CONFIG)) {
                changed.fire();
            }
        }),
        vscode.workspace.onDidChangeWorkspaceFolders(() => changed.fire()),
    );
}

module.exports = { activate };
