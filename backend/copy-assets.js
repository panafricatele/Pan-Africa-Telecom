const fs = require('fs');
const path = require('path');

const files = ['products.json', 'coverage-zones.json', 'providers.json', 'phones.json'];
const srcDir = path.join(__dirname, 'src', 'database');
const outDir = path.join(__dirname, 'dist', 'database');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
  console.log(`Copied ${file} to ${outDir}`);
}
