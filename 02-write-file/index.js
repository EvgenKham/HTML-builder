const fs = require('fs');
const path = require('path');
const process = require('process');

const filePath = path.resolve('02-write-file/', 'text.txt');
const writableStream = fs.createWriteStream(filePath, 'utf-8');

const welcomeText = 'Hello, user! Enter your text: \n';
const goodbyeText = 'GoodBye, user!';
// eslint-disable-next-line quotes
const textExit = `Enter 'exit' or 'ctrl + c' for the end\n`;

process.stdout.write(textExit + welcomeText);

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  writableStream.write(data);
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => process.stdout.write(goodbyeText));
