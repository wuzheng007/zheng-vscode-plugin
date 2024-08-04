import { ExtensionContext, commands, window } from "vscode";

export default function (context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("zheng.getCurrentFilePath", (uri) => {
      window.showInformationMessage(
        `当前文件（夹）路径是：${uri ? uri.path : "空"}`
      );
    })
  );
}
