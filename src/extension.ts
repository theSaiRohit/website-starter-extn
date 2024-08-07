import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("website-starter-pack.newProject", async (uri: vscode.Uri) => {
    let projectName = "Document";

    const ProjectFiles = [
      {
        fileName: "index.html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./style.css">
    <script src="./script.js" async defer></script>
</head>
<body>
    
</body>
</html>`
      },
      {
        fileName: "style.css",
        code: `* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
/* write css code here */
`
      },
      {
        fileName: "script.js",
        code: `alert("Js file is connected");
// write your code here, (ofcourse remove the alert as well)
`
      }
    ];
    const optionItems = ["Use same folder (directory)", "Create new folder (directory)"];
    const options = await vscode.window.showQuickPick(optionItems, {
      title: "Select where to create your website project :"
    });

    if (options?.includes(optionItems[0])) {
      for (const file of ProjectFiles) {
        fs.writeFile(path.join(uri.fsPath, file.fileName), file.code);
      }
      vscode.window.showInformationMessage("Successfully created all three files in same directory");
    } else {
      projectName = (await vscode.window.showInputBox({
        placeHolder: "Enter Project Name"
      })) as string;
      if (!projectName) {
        vscode.window.showErrorMessage("Project Name is mandatory");
        return;
      }
      const selectedFolderPath = uri.fsPath;
      const projectPath = path.join(selectedFolderPath, projectName);
      await fs.mkdir(projectPath);
      for (const file of ProjectFiles) {
        fs.writeFile(path.join(projectPath, file.fileName), file.code);
      }
      vscode.window.showInformationMessage(`Project '${projectName}' created successfully.`);
    }
  });

  context.subscriptions.push(disposable);

  vscode.commands.executeCommand("setContext", "newProjectSupported", true);

  const executeHandler = (resource: any) => {
    vscode.commands.executeCommand("website-starter-pack.newProject", resource);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand("website-starter-pack.newProjectFromContextMenu", executeHandler)
  );
}

export function deactivate() {}
