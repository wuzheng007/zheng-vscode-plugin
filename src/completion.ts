import {
  CompletionItem,
  ExtensionContext,
  languages,
  MarkdownString,
  SnippetString,
  Uri,
} from "vscode";
export default function (context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems(document, position, token) {
        // 一个简单的自动完成项，插入 `Hello World!`
        const simpleCompletion = new CompletionItem("Hello World!");

        // 一个自动完成项，插入其文本作为片段，
        // `insertText` 属性是一个 `SnippetString`，将被编辑器识别。
        const snippetCompletion = new CompletionItem("Good part of the day");
        snippetCompletion.insertText = new SnippetString(
          "Good ${1|morning,afternoon,evening|}. It is ${1}, right?"
        );
        const docs: any = new MarkdownString(
          "插入一个片段，允许您选择 [链接](x.ts)。"
        );
        snippetCompletion.documentation = docs;
        docs.baseUri = Uri.parse("http://example.com/a/b/c/");

        const commitCharacterCompletion = new CompletionItem("console");
        commitCharacterCompletion.commitCharacters = ["."];
        commitCharacterCompletion.documentation = new MarkdownString(
          "Press `.` to get `console.`"
        );

        return [simpleCompletion, snippetCompletion, commitCharacterCompletion];
      },
    })
  );
}
