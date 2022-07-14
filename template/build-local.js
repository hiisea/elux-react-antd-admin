/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const {fse} = require('@elux/cli-utils');

const dist = path.join(__dirname, '../template/local');
const sourceDist = path.join(dist, 'src/source');
const source = path.join(__dirname, '../');
const sourceFilter = {'.DS_Store': true, '.eslintcache': true, '.git': true, dist: true, node_modules: true, template: true};
const htmlTpl = path.join(sourceDist, 'public/client/index.html');

console.log(`正在删除:${sourceDist}`);
fse.removeSync(sourceDist);
console.log(`正在复制:${source}`);
fs.readdirSync(source).forEach((filename) => {
  if (sourceFilter[filename]) {
    return;
  }
  fse.copySync(path.join(source, filename), path.join(sourceDist, filename));
});
console.log(`正在替换%:${source}`);
fs.writeFileSync(htmlTpl, fs.readFileSync(htmlTpl, 'utf8').replace(/<%/g, '<%%').replace(/%>/g, '%%>'), 'utf8');
console.log(`完成!`);
