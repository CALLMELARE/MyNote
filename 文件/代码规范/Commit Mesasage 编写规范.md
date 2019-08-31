# Commit Mesasage 编写规范

## 基本要求

* 提供更多历史信息，方便快速浏览
* 过滤某些commit，便于快速查找信息
* 直接从commit生成change log

## 格式规范

### 基本格式

Commit message 包括三个部分:`Header(必需)`, `Body(可选)`和 `Footer(可选)`

​任何一行都不得超过72字符，避免自动换行影响美观

```html
<type>(<scope>):<subject>
​<body>
<footer>
```

### Header

Header部分只有一行，包括三个字段:`type(必需)`,`scope(可选)`和`subject(必需)`

#### type

type用于说明commit的类别，从以下七个标识中选择

```c
feat //新功能
fix //修复bug
docs //文档
style //不影响代码运行的格式变动
refactor //重构，即不行增功能也不修改bug的变动
test //测试
chore //构建过程或辅助工具的变动
```
#### scope

`scope`用于说明commit影响的范围，比如数据层、控制层、视图层等，视项目不同而不同

#### subject

`subject`是commit目的的简单描述，一般不超过50个字符

* 以动词开头，使用第一人称现在时
* 第一个字母小写
* 结尾不加句号\(.\)

### Body

Body是对本次commit的详细描述，可以分为多行

* 使用第一人称现在时
* 说明代码改动的动机，以及与之前的对比

### Footer

Footer用于两种情况：不兼容变动/关闭Issue

#### 不兼容变动

如果当前代码与上一个版本不兼容，则footer部分应该以`BREAKING CHANGE`开头，后接对变动的描述、变动理由以及迁移方法。

#### 关闭Issue

如果当前commit对应某个issue，则可以在Footer部分关闭这个issue`Closes #123`

也可以一次关闭多个issue`Closes #123,#234,#345`

### Revert

如果当前的commit用于撤销之前的commit，则必须以`revert:`开头，后接被撤销的commit的Header

```md
revert: feat(pencil): add 'graphiteWidth' option
This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```
Body部分的格式是固定的，必须写成`This reverts commit &lt;hash>.`，其中的`hash`是被撤销 commit 的 SHA 标识符。

如果当前 commit 与被撤销的 commit，在同一个发布`release`里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的Reverts小标题下面。

## 生成Change Log

如果你的所有 Commit 都符合 Angular 格式，那么发布新版本时，Change log 就可以用脚本自动生成，生成的文档包括以下三个部分:

* New features
* Bug fixes
* Breaking changes

change log 生成工具：[conventional\-changelog](https://github.com/ajoslin/conventional-changelog)

```bash
$npm install -g conventional-changelog
$cd my-project
$conventional-changelog -p angular -i CHANGELOG.md -w
```
上面命令不会覆盖以前的 Change log，只会在CHANGELOG.md的头部加上自从上次发布以来的变动。

如果你想生成所有发布的 Change log，要改为运行下面的命令。

```bash
$conventional-changelog -p angular -i CHANGELOG.md -w -r 0
```
为了方便使用，可以将其写入package.json的scripts字段。

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -w -r 0"
  }
}
```
最后，直接运行下面的命令即可。

```bash
$npm run changelog
```

