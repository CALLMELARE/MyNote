# CSS编码规范

## 1.文件名规范

文件名建议用**小写字母加中横线**的方式。为什么呢？因为这样可读性比较强，看起来比较清爽，像链接也是用这样的方式，例如stackoverflow的url:

`https://stackoverflow.com/questions/25704650/disable-blue-highlight-when-touch-press-object-with-cursorpointer`

或者是github的地址：

`https://github.com/wangjeaf/ckstyle-node`

那为什么变量名**不用小写字母加小划线**的方式，如：`family_tree`，而是推荐用驼峰式的`familyTree`？C语言就喜欢用这种方式命名变量，但是由于因为下划线比较难敲(shift + -)，所以一般用驼峰式命名变量的居多。

引入CSS文件的`<link>`可以不用带`type="text/css"`，如下代码：

```html
<link rel="stylesheet" href="test.css">
```

因为`<link>`里面最重要的是`rel`这个属性，可以不要`type`，但是不能没有`rel`。

JS也是同样道理，可以不用`type`，如下代码：

```html
<script src="test.js"></script>
```

## 2. 属性书写顺序

* 属性的书写顺序对于浏览器来说没有区别，除了优先级覆盖之外。
* 但是如果顺序保持一致的话，扫一眼可以很快地知道这个选择器有什么类型的属性影响了它，所以一般要把比较重要的属性放前面。

比较建议的顺序是这样的：

```css
.container{
    display:block;
    position:relative;
    /*display,float,position这些直接影响盒模型和位置应当放在最前面*/
    width:200px;
    height:200px;
    padding:10px;
    border:1px solid #ccc;
    background-color:#dcdcdc;
    /* 盒模型的相关属性 */
    line-height:150%;
    font-size:15px;
    color:#282828;
    /* 文本属性 */
    z-index:2;
    transition:opacity 2s linear;
    /* CSS3的一些其他属性 */
}
```

## 3. 不要使用样式特点命名

有些人可能喜欢用样式的特点命名，例如：

```css
.red-font{
    color: red;
}
.p1{
    font-size: 18px;
}
.p2{
    font-size: 16px;
}
```

* 然后你在它的html里面就会看到套了大量的`p1/p2/bold-font/right-wrap`之类的类名，这种是不可取的，假设你搞了个red-font，下次UI要改颜色，那你写的这个类名就没用了，或者是在响应式里面在右边的排版在小屏的时候就会跑到下面去，那你取个right就没用了。
* 有些人先把UI整体瞄了一下，发现UI大概用了3种字号`18px/16px/14px`，于是写3个类p1/p2/p3，不同的字号就套不同的类。这乍一看，好像写得挺通用，但是当你看他的html时，你就疯掉了，这些p1/p2/p3的类加起写了有二三十个，密密麻麻的。我觉得如果要这样写的话还不如借助标题标签如下：

```css
.house-info h2{
    font-size: 18px;
}
.house-info h3{
    font-size: 16px;
}
```

* 因为把它的字号加大了，很可能是一个标题，所以为什么不直接用标题标签，不能仅仅担心因为标题标签会有默认样式。

* 类的命名应当使用它所表示的逻辑意义，如signup-success-toast、request-demo、agent-portrait、 company-logo等等。

如果有些样式你觉得真的特别通用，那可以把它当作一个类，如clearfix，或者有些动画效果，有几个地方都要用到，我觉得这种较为复杂并且通用的可以单独作为一个类。但是还是趋向于使用意义命名。

## 4. 不要使用hack

有些人在写CSS的时候使用一些hack的方法注释，如下：

```css
.agent-name{
    float: left;
    _margin: 10px;
    //padding: 20px;
}
```

这种方法的原理是由于`//`或者`_`开头的CSS属性浏览器不认识，于是就被忽略，分号是属性终止符，从//到分号的内容都被浏览器忽略，但是这种注释是不提倡的，要么把.css文件改成.less或者.scss文件，这样就可以愉快地用//注释了。

还有一些专门针对特定浏览器的hack，如*开头的属性是对IE6的hack。**不管怎么样都不要使用hack**。

## 5. 选择器的性能

选择器一般不要写超过3个，有些人写sass或者less喜欢套很多层，如下：

```scss
.listings-list{
    ul{
        li{
            .bed-bath{
                p{
                     color: #505050;
                }
            }
        }
    }
}
```

* 一个容器就套一层，一层一层地套下来，最底层套了七八层，这么长的选择器的性能比较差，因为Chrome里面是用递归从最后一个选择器一直匹配到第一个，选择器越多，匹配的时间就越长，所以时间会比较长，并且代码的可读性也比较差，为看到最里面的p标签的样式是哪个的我得一层层地往上看，看是哪里的`<p>`。代码里面缩进了7、8层看起来也比较累。

* 一般只要写两三个比较重要的选择器就好了，不用每个容器都写进去，重要的目标元素套上class或者id。

* 最后一个选择器的标签的应该少用，因为如果你写个`.container div{}`的话，那么页面上所有的`<div>`第一次都匹配中，因为它是从右往左匹配的，这样的写的好处是html不用套很多的类，但是扩展性不好，所以不要轻易这样用，如果要用需要仔细考虑，如果合适才使用，最起码不能滥用。

## 6. 避免选择器误选

有时候会出现自己的样式受到其他人样式的影响，或者自己的样式不小心影响了别人，有可能是因为类的命名和别人一样，还有可能是选择器写的范围太广，例如有人在他自己的页面写了：

```css
* {
    box-sizing: border-box;
}
```

结果导致在他个页面的公用弹框样式挂了。一方面不要写`*`全局匹配选择器，不管从性能还是影响范围来说都太大了，例如在一个有3个子选择器的选择器：

```css
.house-info .key-detail .location{}
```

* 在三个容器里面，`*`都是适用的，并且有些属性是会继承的，像`font-size`，会导致这三个容器都有`font-size`，然后一层层地覆盖。

* 还有一种情况是滥用了:`first-child`、`:nth-of-type`这种选择器，使用这种选择器的后果是扩展性不好，只要html改了，就会导致样式不管用了，或者影响到了其它无关元素。但是并不是说这种选择器就不能用，只要用得好还是挺方便的，例如说在所有的li里面要让最后一个`<li>`的`margin-left`小一点，那么可以这么写：

```css
.listing-list li:last-child{
    margin-left: 10px;
}
```

这可能比你直接套一个类强。但是不管怎么样，不能滥用，合适的时候才使用，而不是仅仅为了少写类名。

## 7. 减少覆盖

覆盖是一种常用的策略，也是一种不太优雅的方式，如下代码，为了让每个house中间的20px的间距，但是第一个house不要有间距：

```css
.house{
    margin-top: 20px;
}
.house:first-child{
    margin-top: 0;
}
```

其实可以改成这样：

```css
.house + .house{
    margin-top: 20px;
}
```

* 只有前面有`.house`的`.house`才能命中这个选择器，由于第一个`.house`前面没有，所以命不中，这样看起来代码就简洁多了。

还有这种情况，如下代码所示：

```css
.request-demo input{
    border: 1px solid #282828;
}
.request-demo input[type=submit]{
    border: none;
}
```

其实可以借助一个:not选择器：

```css
.request-demo input:not([type=sbumit]){
    border: 1px solid #282828;
}
```

这样看起来代码也优雅了很多。

**有一种覆盖是值得的，那就是响应式里面小屏的样式覆盖大屏**，如下：

```css
.container{
    width: 1080px;
    margin: 0 auto;
}
@media (min-width: 1024px){
    .container{
        width: auto;
        margin: 0 40px;
    }
}
```

大屏的样式也可以写成：

```css
@media (min-width: 1025px){
     .container{
         width: 1080px;
         margin: 0 auto;
    }
}
```

我一开始是就是这么写的，为了遵循减少覆盖原则，但是后来发现这种实践不好，代码容易乱，写成覆盖的好处在于可以在浏览器明显地看到，小屏的样式是覆盖了哪个大屏的样式，这个在大屏的时候又是怎么样的。

## 8. 使用CSS3的选择器完成一些高级的功能

上面提到`:not`可以让代码简洁，还有其它一些很好用的。例如说只有两个的时候一个占比50%,而有3个的时候一个占比33%，这个用CSS就可以实现，如下：

```css
.listing-list li{
    width: 33%;
}
.listing-list li:first-child:nth-last-child(2),
.listing-list li:first-child:nth-last-child(2) ~ li{
     width: 50%;
}
```

当`<li>`是第一个元素并且是倒数第二个元素的时候以及和它相邻的`<li>`被第二组选择器命中，它的宽度是50%，也就是只有两个`<li>`的时候才能满足这个条件。

另外还可以借用`:hover/:focus/:invalid/:disabled`等伪类选择器完成一些简单的交互。

## 9. 少用`!important`

* `important`用来覆盖属性，特别是在CSS里面用来覆盖`style`里的属性，但是`important`还是少用为妙。
* 有时候你为了偷懒直接写个`!important`，以为这个的优先级是最高的了，往往螳螂捕蝉，黄雀在后，很可能过不了多久又要再写一个优先级更高的覆盖掉，这样就略显尴尬了。所以能少用还是少用。
* 如果要覆盖还是先通过增加添加选择器权重的方式。

## 10. 多写注释

* **"程序猿最烦两件事，第一件事是别人要他给自己的代码写文档，第二件呢？是别人的程序没有留下文档"**。
* 注释也是同样道理，当看到很多绿色的注释代码神经会比较放松，而当看到揉成一团还没有注释的代码是比较压抑的。

CSS的注释可包括：

### 文件顶部的注释

```css
/*
 * @description 整个列表页样式入口文件
 * @author LARE
 */
```

### 模块的注释

```css
/*详情页贷款计算器*/
```

### 简单注释

```css
/*为了去除输入框和表单点击时的灰色背景*/
input,
form{
    -webkit-tap-highlight-color:  rgba(255, 255, 255, 0);
}
```

### TODO的注释

有时候你看源码的时候你会看到一些TODO的注释：

```css
/* TODO(littledan): Computed properties don't work yet in nosnap.
   Rephrase when they do.
*/
```

* 表示这些代码还有待完善，或者有些缺陷需要以后修复。而这种TODO的注释一般编辑器会把TODO高亮。

* 注意不要写一些错误的误导的注释或者比较废话的注释，这种还不如不写，如下：

```css
/* 标题的字号要大一点 */
.listings h2{
    font-size: 20px;
}
```

## 11.排版规范

* 不管是JS/CSS，缩进都调成4个空格，如果你用的`sublime`，在软件的右下角有一个`Tab Size`，选择`Tab Size 4`，然后再把最上面的`Indent Using Spaces`勾上，这样，当你打一个tab键缩进的时候就会自动转换成4个空格。
* 如果你使用`vim`，新增或者编辑`~/.vimrc`文件新增一行：`:set tabstop=4`也会自动把缩进改成4个空格，其它编辑器自行查找设置方法。因为\t在不同的编辑器上显示长度不一样，而改成空格可以在不同人的电脑上格式保持一致。

多个选择器共用一个样式集，每个选择器要各占一行，如下：

```css
.landing-pop,
.samll-pop-outer,
.signup-success{   
    display: none;
}
```

每个属性名字冒号后面要带个`空格`，`~`、`>`、`+`选择器的前后也要带一个空格：

```css
.listings > li{
    float: left;
}
```

## 12. 属性值规范

### 如果值是0，通常都不用带单位

例如：

```css
.list{
    border: 1px solid 0px;
    margin: 0px;
}
```

应改成：

```css
.list{
    border: 1px solid 0;
    margin: 0;
}
```

但是有个特例，就是和时间有关的时间单位都要带上秒s，如下两个都是不合法的：

```css
transition-duration:0;
transition:transform 0 linear;
```

### 色值用十六进制，少用rgb

如下：

```css
color: rgb(80, 80, 80);
```

应改成：

```css
color: #505050;
```

因为使用rgb是一个函数，它还要计算一下转换。如果是带有透明度的再用rgba.

如果色值的六个数字一样，那么写3个就好：

```css
color: #ccc;
```

### 注意border none和0的区别

如下两个意思一样：

```css
border: 0;
border-width: 0;
```

而下面这两个一样：

border: none;
border-style: none;
所以用0和none都可以去掉边框。

你可能会说打包工具其实最后会帮我处理，但自己要保持一个良好的书写习惯还是很重要的。

## 13. font-family的设置

* 注意使用系统字体的对应的`font-family`名称，如`SFUIText Font`这个字体，在Safari是`-apple-system`，而在Chrome是`BlinkMacSystemFont`，所以`font-family`可以这么写：

```css
font-family{
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
```

再如微软雅黑，很多中文网站都用这个字体，要写成：

```css
font-family{
    font-family: Microsoft YaHei;
}
```

另外font-family不能在代码任意设置，如果使用了自定义字体。如下代码：

```css
.title{
    font-family: Lato Bold;
}
```

因为如果你在代码里面写了好多个font-family，到时候要整体替换网页的字体就很麻烦了，正确的做法应该是这样的：

```css
h1,
strong,
b{
    font-family: Lato Bold;
    font-weight: normal;
}
```

如果需要加粗就用标题标签，或者b/strong标签，并且要把font-weight调回来，因为那个字体本身就有加粗效果了，如果font-weight再是粗体的话浏览器会用自己的算法继续加粗。如果是细体怎么办，一方面一般细体用得比较少，另一方面没有细体的标签，可以通过套类的方式。

## 14. 不要设置太大的z-index

有些人喜欢设置z-index很大：

```css
z-index: 99999;
```

以为他是老大了，不会有人再比他高了，但是螳螂捕蝉，黄雀在后，很快得再写一个:

```css
z-index: 999999;
```

通常自己页面的业务逻辑的z-index应该保持在个位数就好了。

## 15. 合并属性

* 一般的说法是说为了提高性能，属性要合并，但其实Chrome每个属性都是单独的，就算你合在一起，它也会帮你拆出来，如把margin拆成left/right/top/bottom，但是我们还是推荐写成合的，因为它可以让代码看起来更简洁，代码量更少，如下代码：

```css
.container{
    margin-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
}
```

可以写成：

```css
.container{
    margin: 20px 10px 0;
}
```

但是合在一起写了，要注意别覆盖了其它的设置，如上面把margin-bottom设置成了0.

再如：

```css
.banner{
    background-image: url(/test.jpg);
    background-position: 0 0;
    background-repeat: no-repeat;
}
```

可以改成：

```css
.banner{
    background: url(test.jpg) 0 0 no-repeat;
}
```

## 16. 注意float/absolute/fixed定位会强制设置成block

如下代码：

```css
a.btn {
    float: left;
    display: block;
    width: 100px;
    height: 30px;
}
```

第二行的`display: block`其实是没用的，因为如果你浮动了，目标元素就会具有块级盒模型的特性，即使你`display: table-cell`或者`inline`也不管用。如果你是`display: flex`，那么`float`将会被忽略。

同样地，`absolute`定位和`fixed`定位也有同样的效果，会把行内元素变成块级的。

## 17. 清除浮动

清除浮动有多种方法，一般用`clearfix`大法，虽然这个方法有缺陷，但是它比较简单且能够适用绝大多数的场景，一个兼容IE8及以上的`clearfix`的写法：

```css
.clearfix:after{
    content: "";
    display: table;
    clear: both;
}
```

就不要在末尾添加一个多余元素的方法清除浮动了，虽然也可行，但是比较low.

## 18. 引号的使用

### font-family

一般来说`font-family`不需要添加引号，即使字体名称带有空格也没关系，但是有一种情况是一定要加上引号的，就是字体名称刚好是关键词，如下字体都需要加关键词：

```css
font-family: "inherit", "serif", "sans-serif", "monospace", "fantasy", and "cursive"
```

### background的url

```css
background-url: url("//cdn.test.me/test.jpg");
```

你不加也可以，但是有一种一定要加，那就是url里面带有特殊字符没有转义，如下：

```css
background-url: url(//cdn.test.me/hello world.jpg)
```

上面浏览器会去加载//cdn.test.me/hello，然后报404。这种情况通常是图片是用户上传的，图片的名字带有空格，后端给的url没有对特殊字符做处理，就会有问题，所以当url是可变的时候，最好还是带上引号：

```css
background-url: url('//cdn.test.me/hello world.jpg');
```

这样浏览器就能正常加载图片了。这种情况最好的还是从源头上避免，但我们也可以做个兼容。

### 单引号还是双引号

这两个都是合法的，只是统一一下比较好，不能一下子单引号，一下子双引号的，比较普遍的推荐是html使用双引号，css使用单引号。

## 19. CSS动画规范

### 不要使用all属性做动画

使用`transition`做动画的时候不要使用all所有属性，在有一些浏览器上面可能会有一些问题，如下：

```css
transition: all 2s linear;
```

在Safari上面可能会有一些奇怪的抖动，正确的做法是要用哪个属性做动画就写哪个，如果有多个就用隔开，如下代码所示：

```css
transition: transform 2s linear,
             opacity 2s linear;
```

### 使用transform替代position做动画

* 如果能用transform做动画的，就不会使用left/top/margin等，因为transform不会造成重绘，性能要比position那些高很多，特别是在移动端的时候效果比较明显。
* 基本上位移的动画都能用transform完成，不需要使用CSS2的属性，如一个框从右到左弹出。

### 偏向于使用CSS动画替代JS动画

* 例如把一个框，从下到上弹出，可以用jQuery的slideUp函数，或者自己写setInterval函数处理，但是这些没有比用CSS来得好。
* 使用CSS，初始状态可以把框translate移动屏幕外，然后点击的时候加上一个类，这个类的transform值为0，然后再用transition做动画就好了。

## 20. 不要断词

英文的单词或者数字如果当前行排不下会自动切到下一行，这样就导致每行长短不一，有时候可能不太美观，但是不能使用`word-break: break-all`把一个单词拆成两行，还有一种是使用：

```css
hyphens: auto;
```

它会把单词拆成用-连接的形式，看起来好像挺合理，但是由于它断词断得不够彻底，有些单词断不了，长短不一的现象看起来也比较明显，有些单词还被拆成了两行，所以还不如不加。

因此，不要使用断词。

## 21. 不要设置图标字体`font-family`

这个和上面提到的`font-family`设置是一样的，不要在代码里面手动设置`font-family`，如下：

```css
.icon-up:before{
    content: "\e950";
    font-family: "icon-font";
}
```

正确的做法是给`.icon-up`的元素再套一个`.icon`的类，`font-family`等对图标字体的相关设置都统一在这个类里面：

```css
.icon{
    font-family: "icon-font";
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```

因为我们可能会添加其它一些设置，有个`.icon`的类统一处理比较好。就不要手动一个个去设置`font-family`了。

## 22.设置常见样式`reset`

由于每个浏览器都有自己的UA样式，并且这些样式还不太统一，所以需要做样式`reset`，常见的`reset`有以下：

```css
/* IE浏览器对输入控件有自己的font-family，需要统一 */
input,
textarea,
button{
    font-family: inherit;
}

/* Chrome浏览器会在输入控制聚集的时候添加一个蓝色的outline*/
input:focus,
textarea:focus,
select:focus{
    outline: none;
}

/* 去掉textarea的可拉大小功能*/
textarea{
    resize: none;
}

/* IOS Safari在横屏的时候会放大字体，第二个属性让滑动更流畅 */
html{
    -webkit-text-size-adjust: 100%;
    -webkit-overflow-scrolling : touch;
}

/* 统一标签的margin值和p标签的line-height*/
body, p, h1, h2, ul, ol, figure, li{
    padding: 0;
    margin: 0;
}

h1, h2, p{
    line-height: 150%;
}

/* 去掉select的默认样式 */
select{
    -webkit-appearance: none;
}
/* 如果有输入内容IE会给输入框右边加一个大大的X */
input::-ms-clear{
    display: none;
    width: 0;
    height: 0;
}

/* 去掉number输入框右边点击上下的小三角 */
input::-webkit-inner-spin-button{
    -webkit-appearance: none;
}

input::-webki-outer-spin-button{
    -webki-appearance: none;
}
```

## 23. 图片压缩

* 不管是UI直接给的图片还是自己从UI图里切出来的图片，都需要把图片压缩一下，建议使用`tinypng`，它可以在保持图片质量减少较低的情况下，把图片压得很厉害，比直接在PS里面设置压缩质量要强。
* 如果是色彩比较丰富的图片要使用`jpg`格式，不能使用`png`格式，`png`会大得多，如果是`logo`那种矢量图片，直接使用`svg`格式即可。一般来说要把图片控制在300k以内，特别是`banner`头图，图片的大小也要控制住。

## 24. 正确使用`background`和`img`

* 显示一张图片有两种方式，可以通过设置CSS的`background-image`，或者是使用`img`标签，究竟什么时候用哪种呢？

* 如果是头图等直接展示的图片还是要img标签，如果是做为背景图就使用`background`，因为使用`<img>`可以写个`alt`属性增强SEO，而背景图那种本身不需要SEO。虽然`background`有一个一个`background-position: center`, `center`很好，但是头图那种还是使用`<img>`吧，自己去居中吧，不然做不了SEO。

## 25. 响应式的规范

* 响应式开发最不好不要杂合使用`rem`，文字字号要么全部使用`rem`，要么不要用，也不要使用`transform: scale`去缩小，因为被缩小的字号看起来会有点奇怪，别人都是`14px`，而你变成了`13.231px`，小了一点。
* 响应式的原则一般是**保持中间或者两边间距不变，然后缩小主体内容的宽度**。

## 26. 适当使用`:before`/`:after`

* `:before`和`:after`可以用来画页面的一些视觉上的辅助性元素，如三角形、短的分隔线、短竖线等，可以减少页面上没有用的标签。
* 但是页面上正常的文本等元素还是不要用`before`/`after`画了。

## 27. 少用`absolute`定位

* 首先`absolute`定位的元素渲染性能会比较高，因为它独立出来了，计算量会少，用得好还是可以的。
* 但是如果你页面的主要布局是使用`absolute`的那肯定是不可取的，因为`absolute`定位的可扩展性很差，你把每个元素的位置都定死了就变不了了。
* 可以多用`float`，虽然`float`的性能相对较差，但是不管是实用性还是兼容性都是挺好的。

## 28. 少用inline-block布局

有些人喜欢用`inline-block`，特别是刚开始学切图的人，因为`block`会换行，而`inline-block`不会换行还具有盒模型，因此`inline-block`用得很顺手，而`float`比较复杂，还要处理清除浮动之类的问题。

## 29. 图片的居中和宽高设定

一般来说，UI给的图片展示宽高是固定的，但是实际的图片长宽是不固定，大部分图片是长是比宽大，小部分图片是宽比长大。所以需要居中裁剪展示

```html
<div class="img-container">
    <img src="test.jpg" alt onload="resizeImg(this, '400px', '300px'">
</div>
```

借助一个`resizeImg`函数，在`onload`函数里面做处理。然后居中用CSS：

```css
.img-container{
    position: relative;
    width: 400px;
    height: 300px;
}
.img-container img{
    position: absolute;
    left: -9999px;
    right: -9999px;
    top: -9999px;
    bottom: -9999px;
    margin: auto;
}
```

上面代码用了一个`margin: auto`做居中

## 30. 移动端提高可点区域范围

移动端的的一些图标如`X`，可能会设计得比较小，所以点起来会不太好点，因此要提高可点区域范围，可通过增加`padding`，如下代码：

```css
.icon-close{
    position: abosulte;
    right: 0;
    top: 0;
    padding: 20px;
}
```

这样区域就增加了一圈，点起来就容易多了。

## 31. 不要设置`<input>`的`line-height`

如果设置`<input>`的`line-height`，如下代码，你可能要做垂直居中：

```css
.request-demo input{
    height: 40px;
    line-height: 40px;
}
```

设置了line-height为一个很高的值，这样会导致Safari浏览器的输入光标|变得巨大，所以如果你要居中的话，使用padding吧。

## 32. 移动端弹框要禁止body滑动

* 因为IOS Safari切换输入框的时候会页面会弹闪得很厉害，因为你在切的时候它会先把键盘收起来，然后再弹出来，这个时间很短，给人感觉页面弹闪了一下，但如果把body禁止滑动了就不会有这个问题。
* 这有两个解决办法，第一种是把`body` `fixed`住，第二种设置`body overflow: hidden`，相对来说第二种比较简单一点。IOS10完全不会闪，IOS9以下还是会闪。

## 33. 对于渐变的处理

* 有时候UI里面会有一些渐变的效果，无法复制CSS出来，这个时候可以用一个在线的工具，生成渐变的CSS：`www.cssmatic.com/gradient-ge…`，但是这个需要自己手动调一个和UI一模一样的效果，或者可以直接给UI调一个它理想的效果，它会生成兼容性很强的CSS：

```css
background: #fff;
background: -moz-linear-gradient(left, #fff 0%, #d2d2d2 43%, #d1d1d1 58%, #fefefe 100%);
background: -webkit-gradient(left top, right top, color-stop(0%, #fff), color-stop(43%, #d2d2d2), color-stop(58%, #d1d1d1), color-stop(100%, #fefefe));
background: -webkit-linear-gradient(left, #fff 0%, #d2d2d2 43%, #d1d1d1 58%, #fefefe 100%);
background: -o-linear-gradient(left, #fff 0%, #d2d2d2 43%, #d1d1d1 58%, #fefefe 100%);
background: -ms-linear-gradient(left, #fff 0%, #d2d2d2 43%, #d1d1d1 58%, #fefefe 100%);
background: linear-gradient(to right, #fff 0%, #d2d2d2 43%, #d1d1d1 58%, #fefefe 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fff', endColorstr='#fefefe', GradientType=1 );
```

## 34. 行内元素可以直接设置margin-left/margin-right

如下有些人为了把span撑开，设置`span display: inline-block`

```css
span.phone-numer{
    display: inline-block;
    margin-left: 10px;
}
```

其实行内元素可直接margin的左右，能够把它撑开，不需要设置inline-block：

```css
span.phone-numer{
    margin-left: 10px;
}
```

另外需要注意的是`img`/`input`/`textarea`/`button`默认就是`inline-block`，也不用再设置。
