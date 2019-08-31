# JavaScript编码规范

## 1. 变量命名

* 总地来说，变量名要准确完整地描述该变量所表述的事物，具体来说：

### 变量名不应以短巧为荣

如以下好的变量名和不好的变量名：

|         **×**          |              **√**              |
| :--------------------: | :-----------------------------: |
|         `inp`          |      `input` `priceInput`       |
| `day1` `day2` `param1` |       `today` `tomorrow`        |
|          `id`          |       `userId` `olderId`        |
|         `obj`          |    `orderData` `houseInfos`     |
|         `tId`          |       `removeMsgTimerId`        |
|       `handler`        | `submitHandler` `searchHandler` |

* 左边的变量名都不太清楚，代码的扩展性不好，一旦代码需要加功能的话，就容易出现`obj1`、`obj2`、`obj3`这种很抽象的命名方式。所以一开始就要把变量的名字起得真实有意义，不要搞一些很短很通用的名字。

* 当然变量名取得太长也不好，如`maximumNumberOfTeamMembers`

### 变量名不要使用计算机术语

* 变量名应直指问题领域，来源于现实世界，而不是计算机世界，例如取了`texareaData`之类的名字，应该取一个和业务相关的名字，如`leaveMsg`.

### 变量名的对仗要明确

如`up`/`down`、`begin`/`end`、`opened`/`closed`、`visible`/`invisible`、`scource`/`target`，对仗明确可以让人很清楚地知道两个变量的意义和用途。

### 警惕临时变量

* 有些喜欢取`temp`和`obj`之类的变量，如果这种临时变量在两行代码内就用完了，接下来的代码就不会再用了，还是可以接受的，如交换数组的两个元素。但是有些人取了个`temp`，接下来十几行代码都用到了这个`temp`，这个就让人很困惑了。所以应该尽量少用`temp`类的变量，如下代码：

```js
var temp = 10;
var leftPosition = currentPosition + temp，
    topPosition = currentPosition - temp;
```

应改成：

```js
var adjustSpace = 10;
var leftPosition = currentPosition + adjustSpace，
     topPosition = currentPosition - adjustSpace;
```

### bool变量

建议布尔变量不用以`is`/`do`之类的开头，如：

```js
var isMobile = true,
    isError = true,
    doUpdate = false;
```

可改成：

```js
var mobile = true,
    error = true,
    updated = false;
```

还有其它一些常用的名称如`done`/`found`/`successs`/`ok`/`available`/`complete`等，结合具体的语境：

```js
var ajaxDone = true,
    fileFound = false,
    resourceUpdated = true;
```

另外变量名不要使用否定的名词，如`notOk`，`notReady`，因为否定的词取反的时候就会比较奇怪，如`if(!notOk)`. 要使用肯定的布尔变量名。如果是参数的话可结合ES6的默认形参值。

### 变量名使用正确的语法

不要使用中文拼音，如`shijianchuo`应改成`timestamp`，如果是复数的话加`s`，或者加上`List`，如`orderList`、`menuItems`，而过去式的加上`ed`，如`updated`/`found`等，如果正在进行的加上`ing`，如`calling`.

## 2.声明变量时要赋值

如下声明三个变量：

```js
var registerForm,
     question,
     calculateResult;
```

* 以上绝对是合法JS语法，但是这三个变量的用途会让人比较困惑，特别是中间第二个question，问题是什么。但是当你把上面的变量赋一个初始值的时候：

```js
var registerForm = null,
     question = "",
     calculateResult = 0;
```

* 就让人豁然开朗了，原来`question`是一个问题的字符串，而`result`是一个数字，`form`是一个对象。这也有利于JS解释器提前做一些优化处理，不用等到使用的时候才知道这些变量是什么类型的。

## 3.函数的返回值类型要确定

如下代码：

```js
function calculatePrice(seatCount){
    if (seatCount <= 0) {
        return "";
    } else {
        return seatCount * 79;
    }
}
```

这个代码可能返回整型，也有可能返回字符串，就会让人比较困惑，同时从代码性能来说也是不高的，虽然它是合法的JS语法，一个函数的返回类型要统一。你可能会说我用上面的函数做为输入框显示的值，如果是负数或者0，那么输入框就不要显示任何东西，所以才会返回空的字符串。即使是这样的原因也不建议这样写，从长远来看这样写是不利的，你应该用其它的方法组织你的代码。要养成强类型的代码风格，这样不容易出bug，扩展也容易。另外如果一个变量你把它当成数字使用，下面就不要再把它当成字符串使用了，因为这样也容易让人困惑。

* 微软的**Typescript**就是一种强类型的书写语法，很多大型项目会使用typescript写JS，有兴趣的可以继续了解怎么写typescript.

## 4.不要给变量赋值`undefined`

`undefined`表示一个变量未定义，你定义了一个变量又说它未定义本身就很奇怪。这可能会造成的问题是使用上的歧义，因为我们经常使用`undefined`来判断变量有没有定义：

```js
if (typeof window.HTMLVideoElement === "undefined")
```

如果要赋值应该要赋空值，如对象赋值为`null`，数字赋值为`0`，字符串赋值为空字符，那你可能会说0也是一个正常的数字，如果赋值为0会导致我误认为它是一个正常的数据，那怎么办呢？如果你的数字都是非负数，那么可以把初始值置为-1，实在不行就置成`NaN`.

函数的返回值也不要显式地`return undefined`.

## 5.排版规范

一个比较流行的空格和缩进排版如下代码所示：

```js
//逗号后面带个空格，) {中间带个空格
function getSeatDiscount(seatCount, currentPrice) {
    //双目运算符左右两边都带个空格
    var originPrice = editOrder.getSeatsPrice(seatCount);
    return Math.round((originPrice - currentPrice) / originPrice * 100);
}
```

一行太长要换行，如V8的源码里面一行最长是70个字符，超过就换行：

```js
function ArrayUnshift(arg1) {  // length == 1
//if判断里面进行了换行，并且if (中间带个空格
  if (len > 0 && UseSparseVariant(array, len, IS_ARRAY(array), len) &&
      !%object_is_sealed(array)) {
    SparseMove(array, 0, 0, len, num_arguments);
  } else {
    SimpleMove(array, 0, 0, len, num_arguments);
  }
}
```

一行代码太长了就换行是一种好的习惯，太长让人看起来比较费劲。基本上一行不要超过100个字符，超过就要换行，不管是注释还是代码。

## 6.使用`===`代替`==`

`==`会带上类型转换，这和上面一样的，我们要用强类型的风格写代码，所以不要使用`==`，如果有类型转换自己做类型转换，不要让别人去猜这里面有类型转换，使用==会有一些比较奇怪的结果：

```js
null == undefined          //true
'' == '0'                  //false
0  == ''                   //true
0  == '0'                  //true
' \t\r\n ' == 0            //true
new String("abc") == "abc" //true
new Boolean(true) == true  //true
true == 1                  //true'
```

## 7. 减少魔数

对一些比较重要的常量起一个名字，例如下面的代码：

```js
const ONE_DATE = 3600 * 24 * 1000;
var tomorrow = today + ONE_DATE;
```

再如下面不好的写法：

```js
dialogHandler.showQuestionNaire（"seller", "sell", 5, true）;
```

上面四个常量会让人看起来比较困惑，如果可以的话给它们起个名字，如果觉得麻烦那就加上注释。

## 8.不要让代码暴露在全局作用域下运行

一个原因是在全局作用域下，变量的查找时间会更长，第二个原因是污染全局作用域，有时候会造成一些意想不到的结果，如下：

```js
var name = "hi boy";
console.log(window.name);
```

定义了一个变量，但是刚好不巧`window.name`是本来有这个属性，这个属性通常用来跨域传递数据。如果你设置了`name`这个变量，就把全局的`window.name`给覆盖了。

## 9. `let`/`var`/`const`的使用

ES6新增了`let`/`const`定义变量，使用let有一些好处，如：

### 避免变量重复定义

```js
let me = "go";
// Uncaught SyntaxError: Identifier 'me' has already been declared
let me = "go"; 
```

使用`babel loader`打包的时候它会做静态检查：

```js
Module build failed: Duplicate declaration "me"
```

### for循环的变量作用域是独立的

```js
for(let i = 0; i <= 4; i++) {
    tasks.push(function(){
        console.log("i is " + i);
    });
}
```

使用`let`使得`i`在`for`循环里面每次运行的作用域都是独立的。并且`for`里定义的变量在`for`循环外是不可见的。

`babel`在转换的时候，会在`for`循环里面套一个`function`，然后把i当作函数的参数:

```js
var _loop = function _loop(_i) {
    tasks.push(function () {
        console.log("i is " + _i);
    });
};

for (var _i = 0; _i <= 4; _i++) {
    _loop(_i);
}
```

由于`let`可以避免变量重复定义，就冲着这一点，就使得它很有意义。所以**推荐多用**`let`**定义变量**。所以本规范下面的变量将使用let代替var.

而`const`适合于给常量起个名字，如上面提到的：

```js
const ONE_DAY = 3600 * 24 * 1000;
const adjustSpace = 10;
```

或者是定义其它一些不需要修改的变量，防止不小心被其它代码修改了。

## 10. 简洁代码

### 使用三目运算代替简单的`if-else`

可以写一行就不要写三行，如下：

```js
let seatDiscount = 100;
if(seat < 5) {
    seatDiscount = 90;
} else if(seat < 10) {
    seatDiscount = 80;
} else {
    seatDiscount = 70;
}
```

可以改成三目运算符：

```js
let seatDiscount = seat < 5 ? 90 :seat < 10 ? 80 : 70;
```

代码从8行减少到了2行。

### 使用箭头函数取代简单的函数

例如以下代码：

```js
setTimeout(function(){
    window.location.reload(true);
}, 2000);
```

可改成：

```js
setTimeout(() => window.location.reload(true), 2000);
```

代码从3行变成了1行。

## 11. 注意避免执行过长时间的JS代码

对于一般的页面的数据量来说，加减乘除等计算不足以造成性能瓶颈。容易造成瓶颈的是DOM操作，特别是大批量的DOM操作，只要一次有几百上千的级别就容易造成页面卡顿。特别是不要在一个for循环里不断地修改DOM，如下代码：

```js
for(var i = 0; i < 1000; i++) {
    ul.appendChild(li);
}
```

这种可以先把li拼好了，再一次性append到ul里面，如下代码：

```js
var fragment = document.createDocumentFragment();
for(var i = 0; i < 1000; i++) {
    fragment.appendChild(li);
}
ul.appendChild(fragment);
```

* 如果你用jq的话应该先把模板渲染好，然后再一次性append到dom里面，而不是不断地append到dom里面。现在的浏览器一般也比较智能，它会做一些优化，但是我们不能老是指望浏览器会优化。

* 但是还是要注意数据量特别大的情况，你可能要使用setTimeout的方式分段处理数据，甚至使用多线程。使用setTimeout可以这样：

```js
function sliceWorks(data, finishedCallback) {
    if(!data.length) {
        finishedCallback();
    } else {
        const PIECES = 100;
        process(data.splice(0, PIECES));
        setTimeout(() => sliceWorks(data, finishedCallback), 100);
    }
}
```

我们使用一个递归，把数据分段处理，每段100个，当数据处理完再调完成回调函数。

## 12. 多写注释

这个和CSS规范类似：

### 文件顶部的注释，包括描述、作者、更新

```js
/*
 * @file listing-detail.js
 * @description 房源详情页的JS主文件，处理轮播、房贷计算器、约看房等逻辑
 * @author yincheng.li
 * @update (yincheng.li 2017/8/19)
 */
 ```

### 函数的注释

```js
/*
 * 和搜索界面展示有关的处理逻辑
 * @namespace
 */

var searchWinHandler = {
    /*
     * 初始化驱动函数
     * 
     * @param {bool} realTimeSearch 是否需要进行实时搜索
     * @param {HTMLFormElement} form 搜索表单DOM元素
     *
     */
    init(realTimeSearch, HTMLFormElement){

    }

    /*
     * 搜索条件展示点击X按钮的处理函数
     *
     * @param {object} jquery的点击事件event
     * @trigger 会触发search按钮的点击事件，以触发搜索
     * @returns 无返回
     *
     * TODO 这里临时使用了一个全局变量的flag，这种实现方式不太好
     * 虽然比较方便
     */
    closeFilterSpan(event){

    }

};
```

上面的`@auhor` `@return`都是注释标签，其它常用的注释标签还有：

```js
/*
@class 表示一个类
@constructor 构造函数
@deprecated 被弃用
@global 全局的变量
@namespace 具有命名空间作用的object，如$.fn.remove，$.fn.append，$和fn就是一个namespace，而fn是$的子命名空间
@this 这里的this指向哪里
@throws 在这个函数里面可能会抛出什么异常
@version 当前版本
*/
```

### 变量定义和代码的注释

* 对一些比较重要的变量加注释，标明它是什么用途，以及对一些核心代码逻辑加上注释，或者比较复杂的业务逻辑，写了5个case，每个case分别代表什么；
* 为了改某个bug而加入的代码，说明下为了解决什么问题；还有某些易混的判断，为什么if判断条件写了四个，为什么代码到这个if判断不通过就直接return了；
* 一些常量的注释，为什么会突然冒出来100这个数字；改动了别人的代码，为什么要改动；

如：

```js
 var requestData = {
        listingId: listingData.listingId,
        page: 1,
        //把200改成5，点击More的时候是重新刷新页面的，也没有其他地方用到，
        //没必要请求那么多，严重影响性能
        pageSize: 5//200    
};
```

总之多写注释还是好的，只要不是废话：

```js
//定义了一个number的变量
let number = 5;
```

或者是和逻辑不符合的错误注释。
还有一种排版的注释，右括号的对应关系：

```js
            } //function ajax
        } //switch(b)
    } //if(a)
}  //searchHandler
```

* 主要是为了方便在后面加代码，例如我要在`switch(b)`后面加代码，当我看到这个注释我就很清楚地知道需要在哪里按回车。
* 不过一般不推荐嵌套很深的代码，或者写得很长，一个函数几百行。

## 13. 代码不要嵌套太深

有些人的代码经常会套个七八层，以jq代码为例，如下：

```js
var orderHandler = {
    bindEvent: function(){
        $(".update-order").on("click", function(){
            if(orderStatus === "active"){
                ajax({
                    url: "/update-order",
                    success: function(data){
                        for(let i = 0; i < data.orders.length; i++){
                            dom.append();
                        }
                    }
                });
            } else {
                ajax({
                    url: "/create-order",
                    success: function(data){
                    }
                });
            }
        });
    }
};
```

上面的代码最深的一层缩进了八层，你可能会觉得这样逻辑挺清晰的啊，但是这种写法同时也有点面条式。以上代码如果让我写，我会这么组织：

```js
var orderHandler = {
    sendUpdateOrderReq: function(requestUrl, successCallback){
        ajax({
            url: requestUrl,
            success: successCallback;
        });
    },
    updateOrder: function(event){
        let requestUrl = orderStatus === "active" ? "/update-order" 
                                : "create-order";
        //更新订单回调函数
        let activeUpdateCallback = function(data){ 
            for(var i = 0; i < data.orders.length; i++){
                console.log(data.orders[i].id);
            }
        };
        //创建订单回调函数
        let inactiveUpdateCallback = function(data){
        };
        let successCallback = {
            active: activeUpdateCallback,
            inactive: inactiveUpdateCallback
        };
        //发请求处理订单
        searchHandler.sendUpdateOrderReq(requestUrl, 
                                                    successCallback[orderStatus]);
    },
    bindEvent: function(){
        $(".update-order").on("click", searchHandler.updateOrder);
    }
};
```

* 首先把绑定的匿名函数改成有名的函数，这样有个好处，当你想要off掉的时候随时可off掉，然后可以减少一层缩进，接着把根据orderStatus不同的回调先用变量判断好，而不是同时积压到后面再一起处理。
* 再把发送请求的函数再单独抽出来做为一个函数，这样可以减少两层缩进。上面最深的缩进为4层，减少了一半。并且你会发现这样写代码逻辑会更加清晰，我在bindEvent里面扫一眼就可以知道哪些DOM绑了哪些事件，然后我对如对哪个DOM的事件感兴趣再跳到相应的回调函数去看，而不用拉了一两页才在bindEvent里面找到目标DOM。
* 并且把updateOrder单独做为一个独立的函数，其它地方如果需要也可以使用，例如可能还有一个组合功能的操作可能会用到。
* 另外把ajax再做一层抽象主要是这个东西实在是太常用，让人一眼就知道要干嘛，把它分离到另外一个地方可以让具体的业务代码更加简单，例如上面发请求，我把回调函数准备好之后，只要执行一行代码就好了。

你缩进太多层，一行就被空格占掉了三、四十个字符，感观上就不是很好，还会出现上面提到的，最后面要写好多个右括号收尾的情况，并且一个函数动不动就两、三百行。

## 14.jQuery编码规范

如果你使用了jQuery。

### 使用closest代替parent

尽量不要使用`parent`去获取DOM元素，如下代码：

```js
var $activeRows = $this.parent().parent().children(".active");
```

这样的代码扩展性不好，一旦DOM结构发生改变，这里的逻辑分分钟会挂，如某天你可能会套了个`<div>`用来清除浮动，但是没想到导致有个按钮点不了了就坑爹了。

应该用`closest`，如：

```js
var $activeRows = $this.closest(".order-list").find(".active");
```

直接定位和目标元素的最近共同祖先节点，然后find一下目标元素就好了，这样就不会出现上面的问题，只要容器的类没有变。如果你需要处理非自己的相邻元素，可以这么搞：

```js
$this.closest("li").siblings("li.active").removeClass("active");
$this.addClass("active");
```

有时候你可以先把所有的`<li>`都置成某个类，然后再把自己改回去也是可取的，因为浏览器会进行优化，不会一见到DOM操作就立刻执行，会先排成一个队列，然后再一起处理，所以实际的DOM操作对自己先加一个类然后再去掉的正负相抵操作很可能是不会执行的。

### 选择器的性能问题

如下代码：

```js
$(".page ul").addClass("shown");
$(".page .page-number").text(number);
$(".page .page-next").removeClass("active");
```

上面的代码做了三个全局查找，其实可以优化一下：

```js
var $page = $(".page");
$page.find("ul").addClass("shown");
$page.find(".page-number").text(number);
$page.find(".page-next").removeClass("active");
```

先做一个全局查找，后续的查DOM都缩小到`$page`的范围，`$page`的节点只有几十个，在几个里面找就比在`document`几百几千个节点里面查找要快多了。jQuery的查DOM也是用的`querySelectorAll`，这个函数除了用在`document`之外，可用在其它DOM结点。

### `on`事件之前需要的时候才`off`

* 有些人喜欢在绑事件之前先`off`掉，这样感觉可以确保万无一失，但是如果你绑的事件是匿名的，你很可能会把其它JS文件绑的一起`off`掉了，并且这样不容易暴露问题，有时候你的问题可能是重复绑定事件，如点一次按钮就绑一次就导致了绑多次，所以根本原因在这里。
* 你应该要确保事件只被绑一次，而不是确保每次写之前都先`off`掉。如果你的事件容易出现绑多次的情况说明你的代码组织有问题，这个在开发的时候应该是能够暴露出来的。

### 对DOM节点较少的不要使用委托

例如说一个表单只有几个`<input>`元素，然后你给`<input>`加了个委托到`<form>`上面，甚至有时候是`<body>`上面，由于事件冒泡导致在`<form>`上或者在页面上的所有操作都会冒泡到`<form>`/`<body>`上，即使操作的不是目标元素，这样jQuery就会收到在`<body>`上的事件，然后再判断处理所有的操作的目标元素是不是你指定的那个，如果是再触发你绑的回调函数。特别是像`mousemove`触发得频繁的事件都需要执行。所以如果元素比较少或者不需要动态增删的那种就不要使用冒泡了，直接绑在对应的多个元素就好了。

### 有时候使用原生更简单

例如获取表单的`<input>`的和它的`value`：

如果`<form>`里面有一个`<input[name=email]>`的输入框，就可以这么用。

再如，改变一个button的状态，下面两个其实差不多，但是如果获取不到dom元素的话第一个会挂：

```js
$("#update-order")[0].disabled = true;
$("#update-order").prop("disabled", true);
```

设置一个元素的`display`为`block`：

```js
div.style.display = "block";
```

但是绝大多数的情况下还是要使用jq的API以确保兼容性，如下获取scrollTop：

```js
//在Firefox永远返回0
let _scrollTop = document.body.scrollTop();
//正确方法
let scrollTop = $(window).scrollTop();
```

因为在firefox里面需要使用：

```js
document.documentElement.scrollTop
```

而这个在Chrome永远返回0。再如window.innerWidth在某些低版本的安卓手机会有问题。所以当你不确定兼容性的时候，就不要使用原生API，不然你得经过小心验证后再使用。你可以不用，但不是说不要去了解原生API，多去了解原生DOM操作还是挺有帮助的。

## 15.对于常用的属性进行缓存

如下代码，频繁地使用了`window.location`这个属性：

```js
let webLink = window.location.protocol + window.location.hostname;
if(openType === "needtoTouch"){
    webLink += "/admin/lead/list/page" + 
             window.location.search.replace(/openType=needToTouch(&?)/, "") +
             window.location.hash;
}
```

可以先把它缓存一下，加快变量作用域查找：

```js
let location = window.location;
let webLink = location.protocol + location.hostname;
if(openType === "needtoTouch"){
    webLink += "/admin/lead/list/page" +
                location.search.replace(/openType=needToTouch(&?)/, "") +
                location.hash;
}
```

当把location变成一个局部变量之后，它的查找时间将明显快于全局变量。你可能会说就算再快这点时间对于用户来说还是没有区别的吧，但是这是做为一名程序员的追求，以及可以让代码更简洁。

## 16.尽量不要在JS里面写CSS
如下代码，如果是非选中状态就把颜色置灰：

```js
$menuItem.css("color", "#ccc");
```

反之颜色恢复正常：

```js
$menuItem.css("color", "#000");
```

这样的代码有问题，如果以后颜色改了，那么你需要改两个地方，一个是CSS里设置，另一个是JS里面设置，而JS写的样式特别容易被忽略，查起来也不好定位。好的做法应该是通过添加删除类的方法：

```js
//变成选中态
$menuItem.addClass("selected");
//变成非选中态
$menuItem.removeClass("selected");
```

然后再通过CSS给selected的类添加样式。如果是button之类的控件可以结合:`disabled`、`:checked`、`:valid`等伪类，连类都不用添加

但是有一种是一定要用JS控制的，就是需要先计算然后动态地改变`position`或者`transform`的值，如果用CSS3的`transition`实现不了.

## 17. 在必要的地方添加非空判断

添加非空判断可以提高代码的稳健性，如下代码：

```js
//弹框时显示other monthly charge
showOtherMonthlyCharge: function(otherCharges, $dialog){
    if(!otherCharges || !otherCharges.length){
        return;
    }
}
```

* 如果传的为空就不用处理，有时候你可能要抛个异常，告诉调用者。对一些比较重要的地方可能还要添加类型检验。
* 后端传的数据要确保会有那个属性，如果不确定也要添加非空判断。如果调了第三方的API，添加出错处理也很重要，因为你不能确保第三方API一定能正常工作，在一些你觉得可能会挂的地方做处理，如请求可能会超时，或者返回了`undefined`的异常结果，这种多使用一般能够发现。

## 18. 不要用for in循环数组

如下代码：

```js
let a = [9, 3, 5];
for(let i in a){
  console.log(a[i])
}
```

正常情况下将会输出数组的元素，但是很不幸的是，如果有人给数组原型添加了一个函数：

```js
Array.prototype.add = function(){};
```

循环里的i将会有4个值：0, 1, 2, "add"，这样就导致你的遍历出现问题，所以数组遍历应该使用length属性或者数组的forEach/map方法。

## 19. 分号规范

JS里面的表达式是可以不用分号结尾，例如Zepto的源码几乎没看到一个分号，但是我们还是提倡要每个句子后面都要加上分号，这样不容易出错。

## 20. 使用location跳转需要先转义

对于那些根据用户输入内容做跳转，需要先把用户内容做转义，如下有问题的代码：

```js
let searchContent = form.search.value.trim();
window.location.href = `/search?key=${searchContent}`;
```

如果用户输入了一个#号，将会导致#后面的内容被当作锚点，或者用户可能会输入一个空格。

所以如果不确定内容的东西需要先encode一下，如下代码：

```js
let searchContent = encodeURIComponent(form.search.value.trim());
window.location.href = `/search?key=${searchContent}`;
```

这样跳转就没有问题了。

## 21. 点击跳转尽量不要使用onclick跳转

点击一个容器的时候做跳转，有些人喜欢这么写：

```html
<div onclick="window.locatioin.href='/listing/detail?id={{listingId}}'">
    <img>
    <div></div>
</div>
```

其实这样写不好，不利于SEO，如果是一个跳转应该用a标签，如下：

```html
<a href="window.locatioin.href='/listing/detail?id={{listingId}}'">
    <img>
    <div></div>
</a>
```

同时把`<a>`标签变成块级。就算你不用做SEO，也应当尽量使用这种方式，因为用这种方式比较自然，还可以控制是否要新开页，如果在移动端也不用考虑`click`事件是否有延迟的问题。

## 22. 不要直接使用localStorage

由于Safari的隐身模式下本地存储会被禁用，如果你尝试往`localStorage`写数据的话，会报超出使用限制的错误：

```js
QuotaExceededError (DOM Exception 22): The quota has been exceeded.
```

而Chrome的隐身窗口不会禁用。而使用Safari的用户可能会开隐身窗口，特别是手机上的。这样就导致代码抛异常了，所以为了兼容Safari，不能直接使用localStorage，要做个兼容：

```js
Data.hasLocalStorage = true;
try{
    window.localStorage.trySetData = 1;
}catch(e){
    Data.hasLocalStorage = false;
}
setLocalData: function(key, value){ 
    if(Data.hasLocalStorage){
        window.localStorage[key] = value;
    }
    else{   
        util.setCookie("_LOCAL_DATA_" + key, value, 1000);
    }
},
getLocalData: function(key){
    if(Data.hasLocalStorage){
        return window.localStorage[key];
    }
    else{
        return util.getCookie("_LOCAL_DATA_" + key);
    }
}
```

上面代码做了个兼容，如果不支持`localStorage`就使用cookie。要**注意cookie一个域名最多只能有4kB，50个key，而本地存储限制为5MB**.

## 23.使用简便的转换

### 把字符串转整型可以使用`+`号

```js
let maxPrice = +form.maxPrice.value;
```

`+`号相当于Number：

```js
let maxPrice = Number(form.maxPrice.value);
```

`parseInt`和`Number`有一个很大的区别是`parseInt(“10px”)`结果为`10`，而`Number(“10px”)`是`NaN`，`parseInt`会更加自然，其它编程语言也有类似的转换。但是`Number`还是能适用很多的场景。

### 把小数去掉尾数转成整型，可以使用 >> 0

如果计算某个数字在第几排：

```js
let _row = Math.floor(index / columns);
let row = parseInt(index / columns);
```

都可改成：

```js
let row = index / columns >> 0;
```

这个用位运算的效率会明显高于上面两个。

### 转成`boolean`值用`!!`

```js
let mobile = !!ua.match(/iPhone|iPad|Android|iPod|Windows Phone/)
```

## 24. 注意返回`false`的变量

有几个值在if判断里面都返回`false`：`0`、`false`、`""`、`undefined`、`null`、`NaN`都是`false`，所以判断一个数组有没有元素可以这么写：

```js
if (array.length) {}
```

而不用写成：

```js
if (array.length !== 0) {}
```

判断一个字符串是不是空可以写成：

```js
if (str) {}
```

但是判断一个变量有没有定义还是要写成：

```js
if (typeof foo !== “undefined”) {}
```

因为如果直接if变量的话，上面的几个可能取值都将认为是没定义。

## 25. 使用Object.assgin简化数据赋值

如下代码，在发请求之前，经常需要获取表单的值，然后去修改和添加老数据提交：

```js
var orderData = {
    id: 123,
    price: 500
}
orderData.price = 600;
orderData.discount = 15;
orderData.manageFee = 100;
```

其实有一种更优雅的方式那就是使用Object.assign：

```js
var setOrderData = {
    price: 600,
    discount: 15,
    manageFee: 100
}
Object.assgin(orderData, setOrderData);
```

使用这个的好处是可以弄一个setOrderData的Object，写成大括号的形式，而不用一个个去赋值，写起来和看起来都比较累。最后再assign一下赋值给原先的Object就可以了。

## 26. 调试完去掉无关的console

调试完就把`console.log`之类的打印信息去掉，别想着等一下做完了再删，等一下就忘了。另外，不要使用`alert`调试，`console`/`debugger`上线了都没事，一般用户也不会开一个控制台，但是`alert`上线了就完蛋了，特别是有些人喜欢用`alert(“fuck”)`之类的看下代码有没有运行到这里，这种调试技巧还是比较初级，要是真上线了可能得卷铺盖走人了。这也可以通过代码检查工具做静态检查。

## 27. 注意this的指向

如下代码：

```js
let searchHandler = {
    search() {
        console.log(this);
        this.ajax();
    },
    ajax() {

    }
};
$searchBtn.on("click", searchHandler.search);
```

当触发`searchBtn`的点击事件时，`search`函数里的`this`已经指向 `searchBtn`了，因为它是`click`的回调函数：

```js
searchHandler.search.call(btn, event);
```

所以函数运行环境就变成了`btn`了，因此这种单例的`Object`最好不要使用`this`，应直接使用当前命名空间的变量名：

```js
let searchHandler = {
    search() {
        console.log(this);
        searchHandler.ajax();
    },
    ajax() {

    }
};
$searchBtn.on("click", searchHandler.search);
```

这样就没问题了。

## 28. 使用正则表达式做字符串处理

正则表达式可以很方便地处理字符串，通常只要一行代码就搞定了。例如去掉全局的某一个字符，如去掉电话号码的-连接符：

```js
phoneNumer = phoneNumber.replace(/\-/g, “”);
```

或者反过来，把电话号码改成3-3-4的形式：

```js
phoneNumber = phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, “$1-$2-$3”);
```

熟练掌握正则表达式是每个前端的基本技能。

## 29. 保持复用模块的观念

当你一个函数要写得很长的时候，例如两、三百行，这个时候你考虑把这个大函数给拆了，拆成几个小函数，然后让主函数的逻辑变得清晰简洁，而每个小函数的功能单一独立，使用者只需要管输入输出，而不需要关心内部是怎么运行的。如下在地图里面处理用户点击的处理函数：

```js
handleMouseClick(latLng, ajax = true) {
    var path = this.path;
    // 这里调了一个closeToFirstPoint的函数判断点击位置是否接近第一个点
    if(path.length >= 2 && ajax && this.closeToFirstPoint(latLng)){
        // 如果是的话调closePath关闭路径
        this.closePath(ajax);
        return;
    }
    path.push({lat: latLng.lat(), lng: latLng.lng()});
    // 调画点的函数
    this.drawPoint(latLng);
    // 调画线的函数
    this.drawSolidLine();
    // 调画多边形背景的函数
    this.drawPolygonMask();
    this.lastMoveLine && this.lastMoveLine.setMap(null);
    this.$drawTip.hide();
}
```

上面拆成了很多个小函数，如画点的drawPoint函数，使用这个函数只需要关心给它一个当前点的经纬度就可以了，它就帮你画一个点。

在函数之上又可以继续抽象，如把这个画图功能的模块写成一个DrawTool的类，这个类负责整个画图的功能，使用者只需要实例化一个对象，然后调一下init，传一些参数就好了。

先抽成不同的函数，每个函数负责一小块，相似的函数聚集在一起形成一个模块，几个模块的相互调用又形成一个插件。

## 30. 注意label事件会触发两次

如果label里面有input，监听label的事件会触发两次，如下代码：

```html
<form id="choose-fruit">
    <label>
        <input type="radio" name="fruit" value="apple">
        <span>apple</span>
    </label>
    <label>
        <input type="radio" name="fruit" value="pear">
        <span>pear</span>
    </label> 
<form>
<script>
{
    let $form = $("#choose-fruit");
    $form.find("label").on("click", function(event){
        console.log(event.target);
    });
}
</script>
```

当点到`<span>`的时候，`click`事件会触发两次，如果`label`里面没有`<input>`的话，就只会触发一次。这是为什么呢？因为在`<label>`容器内，点到`<span>`文字的时候会下发一次`click`事件给`<input>`，input事件又会冒泡到`label`，因此`label`会触发两次。因此如果你直接监听`label`事件要注意注意触发两次的情况
