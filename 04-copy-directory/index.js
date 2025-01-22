const path = require('path');
const { copyFile, readdir } = require('fs');
const { mkdir, rm } = require('fs').promises;

const oldDirPath = path.resolve('04-copy-directory', 'files');
const newDirPath = path.resolve('04-copy-directory', 'files-copy');

filesCopy(oldDirPath, newDirPath);

async function filesCopy(oldDirPath, newDirPath) {
  await rm(newDirPath, { recursive: true, force: true });
  await mkdir(newDirPath, { recursive: true });

  readdir(oldDirPath, (err, files) => {
    if (err) {
      console.log(err);
    }
    files.forEach((file) => {
      const oldFilePath = path.resolve(oldDirPath, file);
      const newFilePath = path.resolve(newDirPath, file);

      copyFile(oldFilePath, newFilePath, (err) => {
        if (err) {
          return console.error(`Error copying file: ${err}`);
        }
      });
    });
  });
}
