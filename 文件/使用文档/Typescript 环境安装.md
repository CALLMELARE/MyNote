# Typescript环境安装

## 安装Node.js

[Nodejs官网](https://nodejs.org/zh-cn/)

```bash
node-v
```

出现版本提示，安装成功

## 安装YARN

首先确保正确安装了npm

```bash
npm install -g yarn
```

## 安装Typescript

```bash
npm install -g typescript
```

> **注意**
> Typescript自带的tsc命令并不能直接运行Typescript代码，所以还需要安装Typescript的运行时**ts-node**，它封装了Typescript编译的过程，是的Typescript代码可以直接运行

```bash
npm install -g ts-node
```