/* 敏感词检测器模块 */
import * as vscode from "vscode";
import { workspace, window } from "vscode";
export default function (context: vscode.ExtensionContext) {
  // 获取当前活动的编辑器
  if (window.activeTextEditor) {
    // 获取给定资源的工作区文件夹
    const workspaceFolder = workspace.getWorkspaceFolder(
      window.activeTextEditor.document.uri
    );
    console.log("工作区文件夹", workspaceFolder);
  }

  // 遍历工作区所有打开的文档
  workspace.textDocuments.forEach((doc) => {
    console.log("文档", doc, doc.getText());
  });

  // console.log("workspace.textDocuments", workspace.textDocuments);

  /* const sensitiveWords = ["secret", "password", "private key"];
  // 创建诊断集合，集合名称为emoji
  const emojiDiagnostics = vscode.languages.createDiagnosticCollection("emoji");
  context.subscriptions.push(emojiDiagnostics);
  let disposable = vscode.commands.registerCommand(
    "sensitiveWords.refresh",
    () => {
      // 这里可以重新扫描整个工作区
      refreshSensitiveWords();
    }
  );

  context.subscriptions.push(disposable);

  // 监听文件变化
  vscode.workspace.onDidChangeTextDocument((event) => {
    checkDocumentForSensitiveWords(event.document);
  });

  // 初始扫描
  vscode.workspace.textDocuments.forEach((doc) => {
    checkDocumentForSensitiveWords(doc);
  });

  // 侧边栏树形视图更新逻辑（简化）
  function refreshSensitiveWords() {
    // 这里需要实现一个逻辑来收集所有敏感词和它们所在的文件，
    // 并更新到侧边栏的视图上。
  }

  function checkDocumentForSensitiveWords(document: vscode.TextDocument) {
    const text = document.getText();
    for (const word of sensitiveWords) {
      if (text.includes(word)) {
        // 报告错误
        const range = new vscode.Range(
          document.positionAt(text.indexOf(word)),
          document.positionAt(text.indexOf(word) + word.length)
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          `Sensitive word '${word}' found.`,
          vscode.DiagnosticSeverity.Error
        );
        emojiDiagnostics.set(document.uri, [diagnostic]);
      }
    }
  } */
}
