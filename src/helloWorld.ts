import { commands, ExtensionContext, window } from "vscode";
export default function (context: ExtensionContext) {
  // 将 disposable 添加到 context.subscriptions。这样，当扩展被停用时，它也会被清理
  context.subscriptions.push(
    // 命令已在 package.json 文件中定义
    // 现在使用 registerCommand 提供命令的实现
    // commandId 参数必须与 package.json 中的 command 字段相匹配
    commands.registerCommand("zheng-vscode-plugin.helloWorld", () => {
      window.showInformationMessage("来自我的插件的 hello World！");
    })
  );
}
