
const vscode = require('vscode');
const azdata = require('azdata');
const letters = require('./letters')


function createAsciiArt(text, language) {
    let commentSymbol = language === 'python' ? '# ' : '--';
    let asciiArt = '';
    for (let i = 0; i < 5; i++) {
        asciiArt += commentSymbol;
        for (let j = 0; j < text.length; j++) {
            let char = text[j].toLowerCase();
            if (letters[char]) {
                asciiArt += letters[char].split('\n')[i] + ' ';
            } else {
                asciiArt += ' '.repeat(6);
            }
        }
        asciiArt += '\n';
    }
    return asciiArt;
}

function activate(context) {
    console.log('Congratulations, your extension "big-words" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand('big-words.gobig', async () => {
        // Check if a file is currently open for editing
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please open a file to use this extension');
            return;
        }
        // Get the current document type (language)
        let docType = editor.document.languageId;
        let text = await vscode.window.showInputBox({
            prompt: 'Enter the text you want to convert to ASCII art (30 characters at most)',
            value: '',
            valueSelection: [0, 30],
            validateInput: value => {
              if (value.length > 30) {
                return 'Text must be 30 characters or less.';
              }
              return null;
            }
        });
        if (!text) {
            return;
        }
        let asciiArt = createAsciiArt(text, docType);
        // Get the current cursor position
        let position = editor.selection.active;
        // Insert the ASCII art at the current cursor position
        editor.edit(editBuilder => {
            editBuilder.insert(position, asciiArt);
        });
    }));
}
exports.activate = activate;