const path = require('path');
const {
  mkdir,
  rm,
  readdir,
  readFile,
  writeFile,
  appendFile,
  copyFile,
  truncate,
} = require('fs').promises;

const newDirPath = path.resolve('06-build-page', 'project-dist');
const newIndexPath = path.resolve(newDirPath, 'index.html');
const newStylePath = path.resolve(newDirPath, 'style.css');
const newAssetsPath = path.resolve(newDirPath, 'assets');

const oldStylePath = path.resolve('06-build-page', 'styles');
const oldIndexPath = path.resolve('06-build-page', '');
const oldAssetsPath = path.resolve('06-build-page', 'assets');
const componentsPath = path.resolve('06-build-page', 'components');

const REGEXP = /\{\{(\w+)\}\}/g;

createDir(newDirPath);
copyAssets(newAssetsPath, oldAssetsPath);
copyStyle(newStylePath, oldStylePath);
copyIndex(newIndexPath, oldIndexPath);

async function createDir(dirPath) {
  try {
    // await rm(dirPath, { recursive: true });
    await mkdir(dirPath, { recursive: true });
  } catch {
    // await mkdir(dirPath, { recursive: true });
    console.log('Directory does not exists');
  }
}

async function copyStyle(newDirPath, oldDirPath) {
  try {
    const styleFiles = await readdir(oldDirPath);
    await rm(newDirPath, { recursive: true, force: true });

    styleFiles.forEach(async (file) => {
      const filePath = path.resolve(oldDirPath, file);
      const ext = path.parse(filePath).ext;

      if (ext === '.css') {
        const style = await readFile(filePath);
        await appendFile(newDirPath, style);
        console.log('Style was added!');
      }
    });
  } catch {
    console.log('File style.css do not exist');
  }
}

async function copyIndex(newDirPath, oldDirPath) {
  try {
    const filePath = path.resolve(oldDirPath, 'template.html');
    await rm(newDirPath, { recursive: true, force: true });

    const html = await readFile(filePath);
    await appendFile(newDirPath, html);

    replaceComponents(newDirPath);

    console.log('Html was added!');
  } catch {
    console.log('File template.html do not exist');
  }
}

async function copyAssets(newDirPath, oldDirPath) {
  try {
    const assetFiles = await readdir(oldDirPath);

    //Walk all directories and copy them
    assetFiles.forEach(async (file) => {
      const filePath = path.resolve(oldDirPath, file);
      const isDir = path.parse(filePath).ext;

      if (isDir === '') {
        const dir = path.parse(filePath).dir;
        const base = path.parse(filePath).base;
        const newPath = path.resolve(newDirPath, base);
        const oldPath = path.resolve(dir, base);

        createDir(newPath);
        copyAssets(newPath, oldPath);
      }
    });

    //Walk all files and copy them to created directories
    assetFiles.forEach(async (file) => {
      const filePath = path.resolve(oldDirPath, file);
      const isDir = path.parse(filePath).ext;

      if (isDir !== '') {
        const newFilePath = path.resolve(newDirPath, file);
        createDir(newDirPath);
        await copyFile(filePath, newFilePath)
          .then(() => {})
          .catch((err) => {
            createDir(newDirPath);
            console.log(err);
          });
      }
    });
    console.log('Assets was copied!');
  } catch {
    console.log('File assets do not copied');
  }
}

async function replaceComponents(filePath) {
  try {
    const indexContent = await readFile(filePath, 'utf-8');
    let tempContent = indexContent;
    const tempWords = tempContent.match(REGEXP);

    tempWords.forEach(async (word) => {
      const compName = word.match(/\{\{(\w+)\}\}/)[1];
      const compPath = path.resolve(componentsPath, compName + '.html');
      const compContent = await readFile(compPath, 'utf-8');
      tempContent = tempContent.replace(word, compContent);
      await truncate(filePath);
      await writeFile(filePath, tempContent);
    });
  } catch {
    console.log('Components was not replaced');
  }
}
