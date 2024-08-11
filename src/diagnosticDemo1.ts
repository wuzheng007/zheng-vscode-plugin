import * as vscode from 'vscode';

// 敏感词列表
const SENSITIVE_WORDS = ['fuck', 'data'];

// 诊断集合
const sensitiveWordDiagnostics = vscode.languages.createDiagnosticCollection('sensitiveWords');

// 激活函数
export default function (context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.scanSensitiveWords', () => {
      scanAndReportDiagnostics();
    })
  );

  subscribeToDocumentChanges(context, sensitiveWordDiagnostics);
}

// 扫描文件并报告诊断信息
async function scanAndReportDiagnostics() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {return;}

  const files = await vscode.workspace.findFiles('**/*.{js,vue}', "**/node_modules/**");
  for (const file of files) {
    const document = await vscode.workspace.openTextDocument(file);
    const text = document.getText();
    const diagnostics = [];

    for (const word of SENSITIVE_WORDS) {
      const regex = new RegExp(word, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        const range = new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + word.length)
        );
        diagnostics.push(new vscode.Diagnostic(range, `${word} 是一个敏感词`, vscode.DiagnosticSeverity.Error));
      }
    }

    sensitiveWordDiagnostics.set(document.uri, diagnostics);
  }
}

// 订阅文档变化事件
function subscribeToDocumentChanges(context: vscode.ExtensionContext, diagnostics: vscode.DiagnosticCollection) {
  if (vscode.window.activeTextEditor) {
    scanAndReportDiagnostics();
  }

  context.subscriptions.push(
    // 当活动编辑器发生更改时触发的事件
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        scanAndReportDiagnostics();
      }
    }),

    // 文本文档更改时发出的事件
    vscode.workspace.onDidChangeTextDocument((e) => {
      scanAndReportDiagnostics();
    }),

    // 文本文档关闭时发出的事件
    vscode.workspace.onDidCloseTextDocument((doc) => {
      diagnostics.delete(doc.uri);
    })
  );
}