// 模块 'vscode' 包含VS Code的可扩展性API
import { ExtensionContext, commands, window } from "vscode";
// 导入 helloWorld 模块
import helloWorld from "./helloWorld";
// 导入 测试命令参数 模块
import testCommandParams from "./testCommandParams";
// 导入 测试菜单展示
import testMenuWhen from "./testMenuWhen";
// 此方法在您的扩展被激活时调用
// 您的扩展在首次执行命令时被激活
export function activate(context: ExtensionContext) {
  // 这行代码只会在您的扩展被激活时执行一次
  console.log("恭喜，您的扩展“zheng-vscode-plugin”现在已激活！");

  helloWorld(context);
  testCommandParams(context);
  testMenuWhen(context);
}

// 此方法在您的扩展被停用时调用
export function deactivate() {
  console.log("您的扩展“zheng-vscode-plugin”已停用！");
}
