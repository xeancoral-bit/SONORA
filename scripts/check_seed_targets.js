const fs = require('fs');
const path = require('path');

const seedPath = path.join(process.cwd(), 'lib', 'seedData.ts');
const content = fs.readFileSync(seedPath, 'utf8');

const targets = ['The Black Eyed Peas', 'Wild Orchid', 'Lizzy McAlpine'];
for (const t of targets) {
  const inSeed = content.includes(t);
  console.log(`In seedData.ts: [${t}] -> ${inSeed}`);
}
