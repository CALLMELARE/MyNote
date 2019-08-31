# HTML编码规范

## 1.img标签要写alt属性

```html
<img src="logo.svg" alt="Company Logo">
```

## 2.单标签不写闭合标签

常见的单标签：`img` `link` `input` `hr`  `br` 

```html
<img src="example.jpg" alt="example"><br>
<input type="email" value="">
```

## 3.自定义属性以data-开头

```html
<div data-count="5"></div>
```

## 4.`<td>`放在`<tr>`里面，`<li>`放在`<ul>` `<ol>`里面

## 5.`<ul>` `<ol>`的直接子元素只能是`<li>`，`<tr>`的直接子元素只能是`<td>`

## 6.`<section>`里面要写标题标签

如果你用了`<section>`/`<aside>`/`<article>`/`<nav>`这种标签的话，需要在里面写一个`<h1>`/`<h2>`/`<h3>`之类的标题标签，因为这四个标签可以划分章节，它们都是独立的章节，需要有标题。
如果UI里面根本就没有标题呢？那你可以写一个隐藏的标题标签，如果出于SEO的目的，你不能直接`display: none`，而要用一些特殊的处理方式，如下套一个`hidden-text`的类

```html
<style>.hidden-text{position: absolute; left: -9999px; right: -9999px}</style>
<section>
    <h1 class="hidden-text">Listing Detail</h1>
</section>
```

## 7.使用`<section>`标签增强SEO

使用`<section>`可以划分章节

```html
<body>
<h1>Listing Detail</h1>
<section>
    <h1>House Infomation</h1>
    <section>
       <h1>LOCATION</h1>
       <p></p>
    </section>
    <section>
        <h1>BUILDING</h1>
        <p></p>
    </section>
</section>
<section>
    <h1>Listing Picture</h1>
</section>
</body>
```

会由outline生成大纲

## 8.行内元素不可以用块级元素

`<a>`标签是一个行内元素，如果行内元素里面套了一个`<div>`的标签，这样可能会导致`<a>`标签无法正常点击。再或者是`<span>`里面套了`<div>`，这种情况下需要把`<inline>`元素显式地设置`display`为`block`，如下代码：

```html
<a href="/listing?id=123" style="display: block">
    <div></div>
</a>
```

## 9.每个页面都要写`<!DOCType html>`

## 10.要用`<table>`布局写邮件模版

由于邮件客户端多种多样，你不知道用户是使用什么看的邮件，有可能是用的网页邮箱，也有可能用的gmail/outlook/网易邮箱大师等客户端。这些客户端多种多样，对html/css的支持也不一，所以我们不能使用高级的布局和排版，例如flex/float/absolute定位，使用较初级的table布局能够达到兼容性最好的效果，并且还有伸缩的效果。

另外邮件模板里面不能写媒体查询，不能写script，不能写外联样式，这些都会被邮件客户端过滤掉，样式都得用内联style，你可以先写成外联，然后再用一些工具帮你生成内联html。

写完后要实际测一下，可以用QQ邮箱发送，它支持发送html格式文本，发完后在不同的客户端打开看一下，看有没有问题，如手机的客户端，电脑的客户端，以及浏览器。

由于你不知道用户是用手机打开还是电脑打开，所以你不能把邮件内容的宽度写死，但是完全100%也不好，在PC大屏幕上看起来可能会太大，所以一般可以这样写：

```html
<table style="border-collapse:collapse;font-family: Helvetica Neue,Helvetica,Arial;font-size:14px;width:100%;height:100%">
    <tr><td align="center" valign="top"><table style="border:1px solid #ececec;border-top:none; max-width:600px;border-collapse:collapse">
    <tr><td>内容1</td></tr>
    <tr><td>内容2</td></tr>
</table></td></tr></table>
```

最外面的table宽度100%，里面的table有一个max-width:600px，相对于外面的table居中。这样在PC上最大宽度就为600px，而在手机客户端上宽度就为100%。

但是有些客户端如比较老的outlook无法识别max-width的属性，导致在PC上太宽。但是这个没有办法，因为我们不能直接把宽度写死不然在手机上就要左右滑了，也不能写script判断ua之类的方法。所以无法兼容较老版本outlook.

## 11.html要保持简洁，不要套多余的层

## 12.特殊情况下才在html里面写`<script>`和`<style>`

## 13.样式要写在`<head>`标签里

样式不能写在`body`里，写在`body`里会导致渲染两次，特别是写得越靠后，可能会出现闪屏的情况，例如上面的已经渲染好了，突然遇到一个style标签，导致它要重新渲染，这样就闪了一下，不管是从码农的追求还是用户的体验，在body里面写style终究是一种下策。

## 14.html要加上`lang`的属性

有利于SEO和屏幕阅读器使用者，他可以快速地知道这个网页是什么语言的

```html
<html lang="zh-CN">
```

## 15.要在`<head>`标签靠前位置写上`charset`的`<meta>`标签

一般`charset`的`<meta>`标签要写在`<head>`标签后的第一个标签

避免网页显示unicode符号时乱码，写在前面是因为w3c有规定，语言编码要在html文档的前1024个字节。如果不写的话在老的浏览器会有utf-7攻击的隐患

```html
<head>
   <meta charset="utf-8">
</head>
```

## 16.特殊符号使用html实体

不要直接把Unicode的特殊符号直接拷到html文档里面，要使用它对应的实体Entity，常用的如下表所示

| 符号  | 实体编码 |
| :---: | :------: |
|   ©   | `&copy;` |
|   ¥   | `&yen;`  |
|   ®   | `&reg;`  |
|   >   |  `&gt;`  |
|   <   |  `&lt;`  |
|   &   | `&amp;`  |
| 空格  | `&nbsp;` |

## 17.`<img>`空src的问题

有时候可能你需要在写一个空的img标签，然后在JS里面动态地给它赋src，所以你可能会这么写：

```html
<img src="" alt>
```

但是这样写会有问题，如果你写了一个空的src，会导致浏览器认为src就是当前页面链接，然后会再一次请求当前页面，就跟你写一个a标签的href为空类似。如果是background-image也会有类似的问题。这个时候怎么办呢？如果你随便写一个不存在的url，浏览器会报404的错误。
有两种解决方法

* 第一种是把src写成about:blank，如下：

```html
<img src="about:blank" alt>
```

这样它会去加载一个空白页面，这个没有兼容问题，不会加载当前页面，也不会报错。

* 第二种办法是写一个1px的透明像素的base64，如下代码所示：

```html
<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
```

第二种可能比较符合规范，但是第一种比较简单，并且没有兼容性问题。

## 18. 关于行内元素空格和换行的影响

有时候换行可能会引入空格，如下代码：

```html
<form>
    <label>Email: </label>
    <input type="email">
</form>
```

* 块级元素开始的空白文本将会被忽略，并且，块级元素后面的空白文本结点将不会参与渲染
* 要注意的是注释标签也是正常的页面标签，也会给它创建一个相应的节点，只是它不参与渲染。

## 19. 类的命名使用小写字母加中划线连接

如下使用-连接，不要使用驼峰式：

```html
<div class="hello-world"></div>
```

## 20. 不推荐使用自定义标签

是否可以使用自定义标签，像angular那样都是用的自定义标签，如下代码：

```html
<my-cotnainer></my-container>
```

* 一般不推荐使用自定义标签，`Angular`也有开关可以控制是否要使用自定义标签。
* 虽然使用自定义标签也是合法的，只要你给他`display: block`，它就像一个`<div>`一样了
* 不管是从SEO还是规范化的角度，自定义标签还是有点另类，虽然可能你会觉得它的语义化更好。

## 21. 重复杂id和重复属性

我们知道，如果在页面写了两个一模一样的id，那么查DOM的时候只会取第一个，同理重复的属性也会只取第一个，如下：

```html
<input class="books" type="text" name="books" class="valid">
```

第二个class将会被忽略，className重复了又会怎么样？重复的也是无效的，这里主要是注意如果你直接操作原生className要注意避免className重复，如下代码：

```js
var input = form.books;
input.className += " valid";
```

如果重复执行的话，className将会有重复的valid类。

## 22. 不推荐使用属性设置样式

例如，如果你要设置一个图片的宽高，可能这么写：

```html
<img src="test.jpg" alt width="400" height="300">
```

这个在ios的safari上面是不支持的，可以自行实验。

或者`<table>`也有一些可以设置：

```html
<table border="1"></table>
```

但是这种能够用CSS设置的就用CSS，但是有一个例外就是canvas的宽高需要写在html上，如下代码：

```html
<canvas width="800" height="600"></canvas>
```

如果你用CSS设置的话它会变成拉伸，变得比较模糊。

## 23. 使用适合的标签，标签使用上不要太单调

1. 如果内容是表格就使用`<table>`，`<table>`有自适应的优点；如果是一个列表就使用`<ol>`/`<ul>`标签，扩展性比较好

2. 如果是输入框就使用`<input>`，而不是写一个`<p>`标签，然后设置`contenteditable=true`，因为这个在IOS Safari上光标定位容易出现问题。如果需要做特殊效果除外

3. 如果是粗体就使用`<b>`/`<strong>`，而不是自己设置`font-weight`

4. 如果是表单就使用`<form>`标签，注意`<form>`里面不能套`<form>`

5. 如果是跳链就使用`<a>`标签，而不是自己写`onclick`跳转。`<a>`标签里面不能套`<a>`标签

6. 使用html5语义化标签，如导航使用`<nav>`，侧边栏使用`<aside>`，顶部和尾部使用`<header>`/`<footer>`，页面比较独立的部分可以使用`<article>`，如用户的评论。

7. 如果是按钮就应该写一个`<button>`或者`<input type=”button”>`，而不是写一个`<a>`标签设置样式，因为使用`<button>`可以设置`disabled`，然后使用CSS的`:disabled`，还有`:active`等伪类使用，例如在`:active`的时候设置按钮被按下去的感觉

8. 如果是标题就应该使用标题标签`<h1>`/`<h2>`/`<h3>`，而不是自己写一个`<p class=”title”></p>`，相反如果内容不是标题就不要使用标题标签了

9. 在手机上使用`<select>`标签，会有原生的下拉控件，手机上原生`<select>`的下拉效果体验往往比较好，不管是IOS还是android，而使用`<input type=”tel”>`在手机上会弹一个电话号码的键盘，`<input type=”number”>` `<input type=”email”>`都会弹相应的键盘

10. 如果是分隔线就使用`<hr>`标签，而不是自己写一个`border-bottom`的样式，使用`<hr>`容易进行检查

11. 如果是换行文本就应该使用`<p>`标签，而不是写`<br>`，因为`<p>`标签可以用`margin`设置行间距，但是如果是长文本的话使用`<div>`，因为`<p>`标签里面不能有`<p>`标签，特别是当数据是后端给的，可能会带有`<p>`标签，所以这时容器不能使用`<p>`标签。

## 24.不要在https的链接里写http的图片

只要https的网页请求了一张http的图片，就会导致浏览器地址栏左边的小锁没有了，一般不要写死，写成根据当前域名的协议去加载，用//开头：

```html
<img src=”//static.chimeroi.com/hello-world.jpg”>
```
