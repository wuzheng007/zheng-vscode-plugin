// 模块 'vscode' 包含VS Code的可扩展性API
import { ExtensionContext, commands, window } from "vscode";
// 导入 helloWorld 模块
import helloWorld from "./helloWorld";
// 导入 测试命令参数 模块
import testCommandParams from "./testCommandParams";
// 导入 测试菜单展示
import testMenuWhen from "./testMenuWhen";
// 导入 自动补全 模块
import completion from "./completion";
// 导入 诊断 模块
import diagnosticDemo from "./diagnosticDemo";
// 导入 敏感词检测 模块
import sensitiveWordDetector from "./sensitiveWordDetector";
// 导入 数据存储 模块
import dateStorage from "./dateStorage";
// 此方法在您的扩展被激活时调用
// 您的扩展在首次执行命令时被激活
export function activate(context: ExtensionContext) {
  // 这行代码只会在您的扩展被激活时执行一次
  window.showInformationMessage("您的扩展“zheng-vscode-plugin”现在已激活！");

  helloWorld(context);
  testCommandParams(context);
  testMenuWhen(context);
  completion(context);
  diagnosticDemo(context);
  // sensitiveWordDetector(context);
  dateStorage(context);

  setTimeout(() => {
    const workspaceUsername: string | undefined = context.workspaceState.get("username");
    if(workspaceUsername) {
      window.showInformationMessage(`工作区存储的用户名：${workspaceUsername}`);
    }
    const globalUsername: string | undefined = context.globalState.get("username");
    if(globalUsername) {
      window.showInformationMessage(`全局存储的用户名：${globalUsername}`);
    }
  }, 3000);
}

// 此方法在您的扩展被停用时调用
export function deactivate() {
  console.log("您的扩展“zheng-vscode-plugin”已停用！");
}
