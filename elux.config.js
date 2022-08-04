//工程配置文件，参见 https://eluxjs.com/guide/configure.html
// eslint-disable-next-line import/no-extraneous-dependencies
const antdVars = require('@elux-admin-antd/stage/assets/css/antd-var.json');
const {getLocalIP} = require('@elux/cli-utils');
const serverPort = 4003;
//允许用户build时通过设置APP_ENV=xxxx来使用不同的api前缀，也可以通过不同的env配置文件来实现
const apiHosts = {
  local: `http://${getLocalIP()}:3003/`,
  localhost: 'http://localhost:3003/',
};
const APP_ENV = process.env.APP_ENV || 'local';
module.exports = {
  type: 'react',
  mockServer: {port: 3003},
  cssProcessors: {less: {javascriptEnabled: true, modifyVars: antdVars}},
  all: {
    //开发和生成环境都使用的配置
    serverPort,
    clientGlobalVar: {
      ApiPrefix: apiHosts[APP_ENV],
      StaticPrefix: apiHosts[APP_ENV],
    },
  },
  dev: {
    //开发环境专用配置
    eslint: false,
    stylelint: false,
    //要使用开发代理可以放开下面代码
    // apiProxy: {
    //   '/api': {
    //     target: apiHosts[APP_ENV],
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
  },
};
