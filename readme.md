# 项目介绍

本模版是一个使用elux框架、包含简单`增删改查`功能的案例。

## 安装依赖注意事项

- 因为使用了`npm workspace`，所以推荐使用yarn安装依赖。如果使用npm，请保证其版本>=7.0，并使用命令 npm install --legacy-peer-deps
- @types/react不支持安装多版本，请保证只安装一份

## 运行脚本

- `yarn start` 以开发模式运行，该命令通常包含2个子命令：yarn mock && yarn dev，也可以自己分开运行
- `yarn mock` 在本地开起一个模拟api假数据的mock server，你也可不使用它
- `yarn build` 编译到dist目录
- `yarn demo` 模拟运行编译后的dist目录

默认开发服务器端口是4003(<http://localhost:4003/)，你可以在elux.config.js>中修改

# 关于“H5”与“Admin”风格说明

CSR浏览器项目提供了“H5”与“Admin”两种风格的模版，从中可以理解不一样的路由风格设置

# 关于“Taro”模版示例说明

- 先运行`yarn mock`，在本地开起一个模拟api假数据的mock server
- Taro工程使用的是Taro官方脚手架，具体使用方法见Taro官方

# 关于“微前端”模版示例说明

案例中假设有3个Team来合作开发这个项目：

1. basic-team 负责开发根模块：stage，独立运行端口：4003
2. article-team 负责开发模块：article，独立运行端口：4001
3. user-team 负责开发模块：my，独立运行端口：4002

每个Team都是一个独立工程，它们都可以独立运行，示例中为了安装和演示方便将它们放在一个父工程中，并使用lerna进行管理，
实际项目中不需要这个父工程中，而可以使用lerna管理子模块

除此之外示例中还有3个独立工程：

- app-build 集成案例：采用静态编译的方式集成以上3个Team的输出
- app-runtime 集成案例：采用动态注入(模块联邦)的方式集成以上3个Team的输出，以此模式运行时，**需要将3个独立站点都跑起来**，可以在父工程中运行`yarn start`
- app-api Mock一个API假数据Server

# 更多信息

更多信息请访问：[https://eluxjs.com](https://eluxjs.com)
