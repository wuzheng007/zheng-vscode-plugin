import { commands, ExtensionContext, window } from "vscode";

export default function (context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("zheng.testMenuShow", () => {
      window.showInformationMessage("点了菜单项（测试菜单展示）");
    })
  );
}
