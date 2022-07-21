const fs = require('fs');
const path = require('path');
const {marked} = require('marked');

const md = fs.readFileSync(path.join(__dirname, 'readme.md'), 'utf-8').toString();
const html = marked.parse(md);
fs.writeFileSync(
  path.join(__dirname, 'src/modules/dashboard/views/Workplace/summary.html'),
  html.replace(
    /<a href="(http:\/\/admin-react-antd.eluxjs.com)([^#]+?)#([^#]+?)#([^#]+?)">(.+?)<\/a>/g,
    '<Link to="$1$2" action="$3" target="$4">$5</Link>'
  )
);
console.log('src/modules/dashboard/views/Workplace/summary.html');
