const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  let changedFiles = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      changedFiles += replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      content = content.replace(/localStorage\.(getItem|setItem|removeItem)\(['"]user['"]/g, "sessionStorage.$1('user'");
      content = content.replace(/localStorage\.(getItem|setItem|removeItem)\(['"]token['"]/g, "sessionStorage.$1('token'");

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
        changedFiles++;
      }
    }
  }
  return changedFiles;
}

const total = replaceInDir(path.join(__dirname, 'frontend', 'src'));
console.log(`Total files updated: ${total}`);
