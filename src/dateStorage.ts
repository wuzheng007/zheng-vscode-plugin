/**
 * 数据存储 模块
 */
import * as path from "path";
import * as fs from "fs";
import { ExtensionContext, Uri, window, workspace } from "vscode";

export default async function (context: ExtensionContext) {
  const { storageUri, globalStorageUri } = context;

  if(!storageUri){
    return;
  }

  /* 1. 工作区存储 */
  // 设置用户名
  context.workspaceState.update("username", "张三");

  /* 2. 全局存储 */
  // 设置用户名
  context.globalState.update("username", "李四");

  /* 3. 工作区特定目录存储数据(文件形式) */
  if (storageUri.fsPath && !fs.existsSync(storageUri.fsPath)) {
    // 同步地 创建目录
    fs.mkdirSync(storageUri.fsPath, { recursive: true });
  }

  // 构造存储数据的文件路径
  const wordLibraryPath = path.join(storageUri.fsPath, 'wordLibrary.txt');
  // const wordLibraryContent = JSON.stringify();
  // 同步地 写入数据到文件，如果文件已存在，则替代文件
  fs.writeFileSync(wordLibraryPath, '你好\n世界！');

  // 读取存储的文件数据
  const wordLibrary = await readWordLibraryFromFile(wordLibraryPath);
  console.log('文件数据', wordLibrary);
}

// 读取词库数据
async function readWordLibraryFromFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading wordLibrary data:", err);
        reject(err);
      } else {
        const wordLibraryData = data.split("\n");
        resolve(wordLibraryData);
      }
    });
  });
}
