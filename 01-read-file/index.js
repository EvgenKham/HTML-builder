const fs = require('fs');
const path = require('path');

const targetFilePath = path.resolve('01-read-file', 'text.txt');
const readableStream = fs.createReadStream(targetFilePath);

readableStream.on('data', (chunk) => console.log(chunk.toString()));
readableStream.read();
