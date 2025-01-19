const path = require('path');
const { readdir, unlink, readFile, appendFile } = require('fs');

const stylesDiPath = path.resolve('05-merge-styles', 'styles');
const bundlePath = path.resolve('05-merge-styles/project-dist', 'bundle.css');

(function () {
  unlink(bundlePath, (err) => {
    if (err) console.log(err);
    console.log('File deleted successfully!');
  });

  readdir(stylesDiPath, (err, files) => {
    if (err) {
      console.log(err);
    }
    files.forEach((file) => {
      const filePath = path.resolve(stylesDiPath, file);
      const ext = path.parse(filePath).ext;

      if (ext === '.css') {
        readFile(filePath, 'utf-8', (err, data) => {
          if (err) console.log(err);
          appendFile(bundlePath, data, (err) => {
            if (err) console.log(err);
            console.log('Data was added!');
          });
        });
      }
    });
  });
})();
