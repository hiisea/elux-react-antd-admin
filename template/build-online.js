/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const path = require('path');
const {fse} = require('@elux/cli-utils');
const archiver = require('archiver');

const dist = path.join(__dirname, '../template/online');
const src = path.join(__dirname, '../template/local/src');
console.log(`正在复制:${src}`);
const output = fse.createWriteStream(path.join(dist, 'src.zip'));
const archive = archiver('zip', {zlib: {level: 9}});
archive.pipe(output);
archive.directory(src, 'src');
archive.finalize();
console.log(`完成!`);
