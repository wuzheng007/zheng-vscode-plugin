/* 诊断模块，例如编译器错误或警告
官网示例 https://github.com/microsoft/vscode-extension-samples/tree/main/diagnostic-related-information-sample */
import {
  Diagnostic,
  DiagnosticCollection,
  DiagnosticSeverity,
  ExtensionContext,
  languages,
  Range,
  TextDocument,
  TextLine,
  Uri,
  window,
  workspace,
} from "vscode";

// 敏感词列表
const sensitiveWords = ["共产党", "国民党", "fuck"];
// 正则表达式
const regex = new RegExp(`${sensitiveWords.join("|")}`, "gi");

export default async function (context: ExtensionContext) {
  // 创建一个名字为 sensitiveWords 的诊断集合
  const diagnosticCollection =
    languages.createDiagnosticCollection("sensitiveWords");
  context.subscriptions.push(diagnosticCollection);

  // 初始化诊断
  await initDiagnostic(diagnosticCollection);

  context.subscriptions.push(
    // 当活动编辑器发生更改时触发的事件。请注意，当活动编辑器更改为 undefined 时，该事件也会触发。
    window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        refreshDocumentDiagnostic(editor.document, diagnosticCollection);
      }
    })
  );

  context.subscriptions.push(
    // 文本文档更改时发出的事件。这通常发生在内容发生变化时，也会发生在脏状态等其他事情发生变化时。
    workspace.onDidChangeTextDocument((e) =>
      refreshDocumentDiagnostic(e.document, diagnosticCollection)
    )
  );
}

/**
 * 初始化诊断
 */
async function initDiagnostic(collection: DiagnosticCollection) {
  // 获取当前工作区文件夹
  // const workspaceFolder = workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)

  // 获取 当前工作区除node_modules内的全部文件
  // console.time("获取当前工作区除node_modules内的全部文件");
  const files = await workspace.findFiles("**/*", "**/node_modules/**");
  // console.timeEnd("获取当前工作区除node_modules内的全部文件");
  // 遍历文件
  for (const file of files) {
    workspace.openTextDocument(file)
    .then((doc) => {
      refreshDocumentDiagnostic(doc, collection);
    });
  }
}

/**
 * 更新文档诊断
 */
async function refreshDocumentDiagnostic(document: TextDocument, collection: DiagnosticCollection) {
  try {
    const docText = document.getText();

    // ================方案1
    /* // 对整个文档进行匹配
    const matches = docText.matchAll(regex);
    if (Array.from(matches).length === 0) {
      return;
    }
    // 获取文档诊断结果
    const diagnostics = getDocumentDiagnosticResult(doc); */

    // ================方案2
    const diagnostics: Diagnostic[] = [];
    for (const word of sensitiveWords) {
      const regex = new RegExp(word, 'gi');
      let match;
      while ((match = regex.exec(docText)) !== null) {
        const range = new Range(
          document.positionAt(match.index), // 将从零开始的偏移量转换为位置。
          document.positionAt(match.index + word.length)
        );
        diagnostics.push(new Diagnostic(range, `${word} 是一个敏感词`, DiagnosticSeverity.Warning));
        // const result = getContentAndLineNo(document, range);
      }
    }

    collection.set(document.uri, diagnostics);
  } catch (error) {
    // 如果文件打开失败，则输出错误信息
    // console.log(error);
  }
}

/**
 * 获取文档诊断结果
 */
function getDocumentDiagnosticResult(doc: TextDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  // 遍历文档每一行
  for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
    const lineOfText = doc.lineAt(lineIndex);
    // 对每一行进行匹配
    const matches = lineOfText.text.matchAll(regex);
    if (Array.from(matches).length === 0) {
      continue;
    }
    diagnostics.push(...createLineDiagnostics(lineOfText, lineIndex));
  }
  return diagnostics;
}

/**
 * 创建诊断（文档行级别）
 * @param lineOfText
 * @param lineIndex
 * @returns
 */
function createLineDiagnostics(
  lineOfText: TextLine,
  lineIndex: number
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const matches = lineOfText.text.matchAll(regex);
  for (const match of matches) {
    const range = new Range(
      lineIndex,
      match.index,
      lineIndex,
      match.index + match[0].length
    );
    const diagnostic = new Diagnostic(
      range,
      `敏感词：${match[0]}`,
      DiagnosticSeverity.Warning
    );
    diagnostics.push(diagnostic);
  }
  return diagnostics;
}


/**
 * 获取内容和行号，生成mergeKey要用
 * 
 * @param document 文档对象
 * @param sensitiveWordRange 敏感词的范围
 * @returns 返回一个对象，包含content和lineNo,
 */
function getContentAndLineNo(document: TextDocument, sensitiveWordRange: Range): { lineNo: number; content: string } {
  const text = document.getText();
  const line = sensitiveWordRange.start.line;
  console.log('line', line);
  // 将文本按行分割
  const lines = text.split(/\r?\n/);
  // 移除空行和制表符
  const cleanedLines = lines.map((line) => {
      const trimmedLine = line.trim().replace(/\t/g, '');
      return trimmedLine ? trimmedLine : null;
  }).filter(line => line !== null);

  // 计算去除空行后的真实行号
  let adjustedLineNo = 0;
  for (let i = 0; i < line; i++) {
      if (lines[i].trim().replace(/\t/g, '')) {
          adjustedLineNo++;
      }
  }

  // 提取敏感词前后5行的内容
  const startExtractLine = Math.max(0, adjustedLineNo - 5);
  const endExtractLine = Math.min(cleanedLines.length, adjustedLineNo + 1 + 5); 

  return {
      lineNo: adjustedLineNo + 1,
      content: cleanedLines.slice(startExtractLine, endExtractLine).join('\n')
  };
}