/* eslint-disable no-console */
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const fallback = require('express-history-api-fallback');
const {createProxyMiddleware} = require('http-proxy-middleware');
const config = require('./config');

const {proxy, port} = config || {};
const serverUrl = `http://localhost:${port}`;
const staticPath = path.join(__dirname, './client');

const app = express();
Object.keys(proxy).forEach((key) => {
  app.use(key, createProxyMiddleware(proxy[key]));
});
app.use('/client', express.static(staticPath));

app.use(fallback('index.html', {root: staticPath}));

app.listen(port, () =>
  console.info(`\n🚀...Starting ${chalk.yellowBright.bgRedBright(' ProdServer ')} on ${chalk.underline.redBright(serverUrl)} \n`)
);
