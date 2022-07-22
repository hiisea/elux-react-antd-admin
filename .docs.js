const fs = require('fs');
const path = require('path');
const {marked} = require('marked');

const md = fs.readFileSync(path.join(__dirname, 'readme.md'), 'utf-8').toString();
const html = marked.parse(md);
fs.writeFileSync(
  path.join(__dirname, 'src/modules/dashboard/views/Workplace/summary.html'),
  html
    .replace(/<a href="http:\/\/admin-react-antd.eluxjs.com(\/.*?)">(.+?)<\/a>/g, (str, url, text) => {
      return `<Link to="${url}" action="push" target="${url.indexOf('__c=_dialog') > -1 ? 'window' : 'page'}">${text}</Link>`;
    })
    .replace(/<pre>([\w\W]*?)<\/pre>/g, (str, code) => {
      return `<pre dangerouslySetInnerHTML={{__html:\`${code.replace(/`/g, '\\`')}\`}} />`;
    })
    .replace(/ align="center"/, '')
    .replace(/<img ([^>]*?)>/g, '<img $1 />')
    .replace(/public\/client\/imgs\//g, '/client/imgs/')
);
console.log('src/modules/dashboard/views/Workplace/summary.html');
