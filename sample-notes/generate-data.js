import fs from 'fs';
import path from 'path';

const getEntries = (p) => {
  const entries = [];

  for (const name of fs.readdirSync(p)) {
    const stat = fs.lstatSync(path.join(p, name));

    if (stat.isDirectory()) {
      entries.push({
        name,
        entries: getEntries(path.join(p, name)),
      });
    } else {
      entries.push({
        name,
        text: fs.readFileSync(path.join(p, name)).toString(),
        created: stat.birthtime,
        updated: stat.mtime,
      });
    }
  }

  return entries;
};

console.log(JSON.stringify({ name: '/', entries: getEntries(process.env.DIR) }));
