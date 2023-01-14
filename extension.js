//
//   #####   ######   ####           ##   ##   ####   #####   #####    ####  
//   ##  ##    ##    ##              ##   ##  ##  ##  ##  ##  ##  ##  ##     
//   #####     ##    ## ###   ####   ## # ##  ##  ##  #####   ##  ##   ####  
//   ##  ##    ##    ##  ##          #######  ##  ##  ##  ##  ##  ##      ## 
//   #####   ######   ####            ## ##    ####   ##  ##  #####   ####  
//
//   Mat Milne - 2023
////

const vscode = require('vscode');
const letters = require('./letters');
const comments = require('./comments');

//   ##   ##   ####   ##  ##  ######         ######  ###### 
//   ### ###  ##  ##  ## ##   ##               ##      ##   
//   ## # ##  ######  ####    ####             ##      ##   
//   ##   ##  ##  ##  ## ##   ##               ##      ##   
//   ##   ##  ##  ##  ##  ##  ######         ######    ##   

function createAsciiArt(word, letters, comment) {
    let L1 = comment[0] + '  ';
    let L2 = comment[0] + '  ';
    let L3 = comment[0] + '  ';
    let L4 = comment[0] + '  ';
    let L5 = comment[0] + '  ';
    let lines = [L1, L2, L3, L4, L5];
    for (let i = 0; i < word.length; i++) {
        let char = word[i];
        let charLines = letters[char].split('\n');
        for (let j = 0; j < 5; j++) {
            lines[j] += charLines[j+1];
        }

//   ######   ####    ####   ######  ######  #####          ######   ####  
//   ##      ##  ##  ##        ##    ##      ##  ##           ##    ##  ## 
//   ####    ######   ####     ##    ####    #####            ##    ##  ## 
//   ##      ##  ##      ##    ##    ##      ##  ##           ##    ##  ## 
//   ######  ##  ##   ####   ######  ######  ##  ##           ##     ####  


    }
    if (comment[1]) {
        for (let i = 0; i < lines.length; i++) {
            lines[i] += comment[1];
        }
    }
    lines = '\n' + lines.join('\n') + '\n'
    return lines;
}

//    ####    ####   #####    ####   ##      ##              ####    ####   #####   ###### 
//   ##      ##  ##  ##  ##  ##  ##  ##      ##             ##  ##  ##  ##  ##  ##  ##     
//    ####   ##      #####   ##  ##  ##      ##             ##      ##  ##  ##  ##  ####   
//       ##  ##  ##  ##  ##  ##  ##  ##      ##             ##  ##  ##  ##  ##  ##  ##     
//    ####    ####   ##  ##   ####   ######  ######          ####    ####   #####   ###### 

function activate(context) {
    console.log('Congratulations, your extension "big-words" is now active!');

    context.subscriptions.push(vscode.commands.registerCommand('big-words.embiggen', async () => {

        // Check if a file is currently open for editing
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Please open a file to use this extension');
            return;
        }

        // Get the current document type (language)
        let language = editor.document.languageId;
        let comment = comments[language];

        // Make art
        let input = await vscode.window.showInputBox({
            prompt: 'Enter little words',
            value: ''
        });
        if (!input) {
            return;
        }
        let asciiArt = createAsciiArt(input, letters, comment)

        // Get the current cursor position
        let position = editor.selection.active;
        if (!position) {
            return;
        }

        // Insert the ASCII art at the current cursor position
        editor.edit(editBuilder => {
            editBuilder.insert(position, asciiArt);
        });
    }));
}
exports.activate = activate;
