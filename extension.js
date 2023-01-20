//
//   #####   ######   ####           ##   ##   ####   #####   #####    ####  
//   ##  ##    ##    ##              ##   ##  ##  ##  ##  ##  ##  ##  ##     
//   #####     ##    ## ###   ####   ## # ##  ##  ##  #####   ##  ##   ####  
//   ##  ##    ##    ##  ##          #######  ##  ##  ##  ##  ##  ##      ## 
//   #####   ######   ####            ## ##    ####   ##  ##  #####   ####  
//
//   Mat Milne - 2023

const vscode = require('vscode');
const letters = require('./data/letters');
const comments = require('./data/comments');

function createAsciiArt(word, letters, comment) {

	// Create a 5 line high horizontal 'display'. Each value in letters.js is a 5 line high 
	// ascii art representation of a letter that gets appended horizontally to this. 
	let L1 = comment[0] + '  ';
	let L2 = comment[0] + '  ';
	let L3 = comment[0] + '  ';
	let L4 = comment[0] + '  ';
	let L5 = comment[0] + '  ';
	let lines = [L1, L2, L3, L4, L5];

	// Iterate through input characters, appending ascii art letters to lines display
	for (let i = 0; i < word.length; i++) {
		let char = word[i];
		let charLines;
		
		// use char, lowercase char or fallback to _
		if (letters[char]) {
			charLines = letters[char].split('\n');
		} else {
			let lowerCaseChar = char.toLowerCase();
			if (letters[lowerCaseChar]) {
				charLines = letters[lowerCaseChar].split('\n');
			} else {
				charLines = letters["_"].split('\n');
			}
		}

		for (let j = 0; j < 5; j++) {
			lines[j] += charLines[j+1];
		}
	}
	// Some comment blocks need end tags
	if (comment[1]) {
		for (let i = 0; i < lines.length; i++) {
			lines[i] += comment[1];
		}
	}
	lines = '\n' + lines.join('\n') + '\n'
	return lines;
}

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('big-words.embiggen', async () => {

		// Check if a file is currently open for editing
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('Please open a file to use this extension');
			return;
		}

		// Get current document language type, lookup appropriate comment or fallback to #
		let comment = comments[editor.document.languageId] || comments['default'];

		// Get inspiration and make art. Be bold. Make a statement.
		let input = await vscode.window.showInputBox({
			prompt: 'Enter puny words',
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
