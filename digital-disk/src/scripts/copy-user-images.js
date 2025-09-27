import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../content/users');
const destDir = path.resolve(__dirname, '../../public/images/users');

console.log('Copying all .jpg files from:', srcDir);
console.log('To:', destDir);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

for (const userFolder of fs.readdirSync(srcDir, { withFileTypes: true })) {
  if (userFolder.isDirectory()) {
    const userFolderPath = path.join(srcDir, userFolder.name);
    for (const file of fs.readdirSync(userFolderPath)) {
      if (file.toLowerCase().endsWith('.jpg')) {
        const srcFile = path.join(userFolderPath, file);
        const destFile = path.join(destDir, `${userFolder.name}-${file}`);
        fs.copyFileSync(srcFile, destFile);
        console.log(`Copied: ${srcFile} -> ${destFile}`);
      }
    }
  }
}

console.log('Done.');