const fs = require('fs');
const path = require('path');

const dirPath = path.resolve('03-files-in-folder/', 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const fileName = file.name;
        const filePath = path.resolve(dirPath, fileName);
        const name = path.parse(filePath).name;
        const ext = path.parse(filePath).ext.slice(1);

        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          const sizeKb = (stats.size / 1024).toFixed(3);
          console.log(`${name} - ${ext} - ${sizeKb}kb`);
        });
      }
    });
  }
});
