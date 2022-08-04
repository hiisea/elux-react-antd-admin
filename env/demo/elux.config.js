//该配置文件可以覆盖项目根目录下的elux.config.js
//使用yarn build:demo时会使用本配置文件进行编译
module.exports = {
  prod: {
    clientGlobalVar: {
      ApiPrefix: 'http://api-admin-demo.eluxjs.com/',
      StaticPrefix: 'http://api-admin-demo.eluxjs.com/',
    },
  },
};
