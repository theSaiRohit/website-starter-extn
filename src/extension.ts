import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("website-starter-pack.newProject", async (uri: vscode.Uri) => {
    const ProjectName = await vscode.window.showInputBox({
      placeHolder: "Enter Project Name"
    });
    if (!ProjectName) {
      vscode.window.showErrorMessage("Project Name is mandatory");
      return;
    }

    const selectedFolderPath = uri.fsPath;
    const ProjectPath = path.join(selectedFolderPath, ProjectName);
    await fs.mkdir(ProjectPath);

    const ProjectFiles = [
      {
        fileName: "index.html",
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ProjectName}</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- write html here -->
    <script src="script.js"></script>
  </body>
</html>
`
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

    for (const file of ProjectFiles) {
      fs.writeFile(path.join(ProjectPath, file.fileName), file.code);
    }

    vscode.window.showInformationMessage(`Project '${ProjectName}' created successfully.`);
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
