# Vue-cli 快速上手

## 概述

Vue-cli 是一个基于Vue.js的快速开发脚手架，内含三个组件

### Cli

`@vue/cli`全局安装，提供了终端内使用的Vue命令(如：`vue create`,`vue serve`,`vue ui`)

### Cli服务

`@vue/cli-service`是一个开发环境依赖。构建在`webpack`和`webpack-dev-server`上(如：`serve`,`build`,`inspect`)

### Cli插件

给项目提供可选功能包(如：`Babel/Typescript转译`,`Eslint集成`,`unit测试`,`e2e测试`)

## 前期准备

1. 下载安装`Node.js`
2. 安装及配置`npm`
3. 键入神奇代码
   
```bash
npm install -g vue-cli
```

## 快速开始

### 新建项目

```bash
vue init webpack projectname
```

> 此处`projectname`为项目名称，不能含有大写字母

**安装阶段，需要填写一些字段，括号内为缺省值：**

`Project name (vuetest)`
项目名称

`Project description (A Vue.js project)`
项目描述

`Author`
作者

`Install vue-router? (Y/n)`
是否安装vue-router

`Use ESLint to lint your code? (Y/n)`    
是否使用ESLint管理代码

`Setup unit tests with Karma + Mocha? (Y/n)`
是否安装单元测试

`Setup e2e tests with Nightwatch(Y/n)?`
是否安装e2e测试

接下来是一段安装过程，安装结束后，打开项目文件夹，目录结构如下

- node_modules
- build
- config
- src
  - assets
  - components
  - pages
    - App.vue
    - main.js
- static
  - ...
- package.json

### 安装依赖

切换至项目目录
```bash
cd projectname
```

安装模块
```bash
npm install module-name
```

### 运行项目

```bash
npm run dev
```

在浏览器内打开`http://localhost:8080`即可