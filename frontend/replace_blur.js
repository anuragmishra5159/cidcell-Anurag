import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace accent instances
      content = content.replace(/(bg-accent\/[\d]+)(\s+rounded-full)?(\s+blur-\[\d+px\])/g, 'bg-glow-accent rounded-full');
      content = content.replace(/(bg-accent\/[\d]+)(\s+blur-\[\d+px\])(\s+rounded-full)?/g, 'bg-glow-accent rounded-full');
      
      // Replace blue instances
      content = content.replace(/(bg-accent-blue\/[\d]+|bg-blue-500\/[\d]+)(\s+rounded-full)?(\s+blur-\[\d+px\])/g, 'bg-glow-blue rounded-full');
      content = content.replace(/(bg-accent-blue\/[\d]+|bg-blue-500\/[\d]+)(\s+blur-\[\d+px\])(\s+rounded-full)?/g, 'bg-glow-blue rounded-full');

      // Replace magenta instances
      content = content.replace(/(bg-accent-magenta\/[\d]+)(\s+rounded-full)?(\s+blur-\[\d+px\])/g, 'bg-glow-magenta rounded-full');
      content = content.replace(/(bg-accent-magenta\/[\d]+)(\s+blur-\[\d+px\])(\s+rounded-full)?/g, 'bg-glow-magenta rounded-full');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src');
console.log('done running blur replacements');
