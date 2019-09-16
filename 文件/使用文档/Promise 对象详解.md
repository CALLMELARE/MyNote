# Promise 对象详解

## Promise 导语

一般情况下，当我们执行网络操作/浏览器事件时，通常使用回调函数实现异步执行

```js
function callback=()=>{
    //这是回调函数callback()
    console.log("It's done.");
}
setTimeout(callback,1000);//一秒钟后调用callback()
```

假设我们现在需要根据一个状态`request.status`做出判断，执行两种不同的操作，以AJAX为例

```js
request.onreadystatechange = function () {
    //根据状态做出判断
    if (request.readyState) {
        if (request.status === 200) {
            //若满足request.status === 200，执行success()
            return success(...);
        } else {
            //若不满足request.status === 200，执行fail()
            return fail(...);
        }
    }
```

后衍生出链式写法

```js
var ajax=ajaxGet(`...`);
ajax.success()
    .fail()
```

这样的“承诺将来会被执行”的对象称为`Promise`对象，其在ES6中被统一规范

## Promise 概述

> **Promise对象用于表示一个异步操作的最终完成 (或失败), 及其结果值**

* Promise是异步编程的一种解决方法
* Promise是一个容器，用于保存一个尚未结束的事件的结果
* Promise可以获取异步操作的消息
* Promise提供统一的API，如此一来各种异步操作都可以用同样的方法进行处理

## Promise 特点

* 对象的状态不受外界影响，`promise`对象代表一个异步操作，有三种状态:
  * `pending` （进行中）
  * `fulfilled` （已成功）
  * `rejected` （已失败）

* 只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态，这也是 `promise` 这个名字的由来“承诺”

* 一旦状态改变就不会再变，任何时候都可以得到这个结果， `promise` 对象的状态改变，只有两种可能：①从 `pending` 变为 `fulfilled` ，②从 `pending` 变为 `rejected` 。这时就称为 `resolved` （已定型）。如果改变已经发生了，你再对 `promise` 对象添加回调函数，也会立即得到这个结果，这与事件（ `event` ）完全不同，事件的特点是：**如果你错过了它，再去监听是得不到结果的。**

### 缺点

* 无法取消 `Promise` ，一旦新建它就会立即执行，无法中途取消
* 如果不设置回调函数， `Promise` 内部抛出的错误，不会反应到外部
* 当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

## Promise 语法

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

### 参数

`executor`

* `executor` 是带有 `resolve` 和 `reject` 两个参数的函数
* `resolve` 和 `reject` 函数被调用时，分别将 `promise` 的状态改为 `fulfilled` （完成）或 `rejected` （失败）
* `executor` 内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用 `resolve` 函数来将 `promise` 状态改成 `fulfilled` ，要么调用 `reject` 函数将 `promise` 的状态改为 `rejected`
* 如果在 `executor` 函数中抛出一个错误，那么该 `promise` 状态为 `rejected`，而 `executor` 函数的返回值被忽略。

## Promise 属性

* `Promise.length` // length 属性，其值总是为 1
* [`Promise.prototype`](#附录1：Promise.prototype详解) // 表示 Promise 构造器的原型.

## Promise 方法

* `Promise.all(iterable)`

这个方法返回一个新的 `promise` 对象，该`promise`对象在`iterable`参数对象里所有的`promise`对象都成功的时候才会触发成功，一旦有任何一个 `iterable` 里面的 `promise` 对象失败则立即触 发该 `promise` 对象的失败。这个新的 `promise` 对象在触发成功状态以后，会把一个包含`iterable`里所有 `promise` 返回值的数组作为成功回调的返回值，顺序跟 `iterable` 的顺序保持一致；如果这个新的 `promise` 对象触发了失败状态，它会把`iterable`里第一个触发失败的 `promise` 对象的错误信息作为它的失败错误信息。 `Promise.all` 方法常被用于处理多个 `promise` 对象的状态集合。

* `Promise.race(iterable)`

当 `iterable` 参数里的任意一个子 `promise` 被成功或失败后，父 `promise` 马上也会用子 `promise` 的成功返回值或失败详情作为参数调用父 `promise` 绑定的相应句柄，并返回该 `promise` 对象。

* `Promise.reject(reason)`

返回一个状态为失败的 `Promise` 对象，并将给定的失败信息传递给对应的处理方法

* `Promise.resolve(value)`

返回一个状态由给定 `value` 决定的 `Promise` 对象。如果该值是 `thenable` (即，带有`then`方法的对象)，返回的 `Promise` 对象的最终状态由 `then` 方法执行决定；否则的话(该 `value` 为空，基本类型或者不带 `then` 方法的对象),返回的 `Promise` 对象状态为 `fulfilled` ，并且将该 `value` 传递给对应的 `then` 方法。通常而言，如果你不知道一个值是否是 `Promise` 对象，使用`Promise.resolve(value)` 来返回一个 `Promise` 对象,这样就能将该 `value` 以 `Promise` 对象形式使用。

## Promise 使用实例

```js
'use strict';

var logging = document.getElementById('test-promise2-log');
while (logging.children.length > 1) {
    logging.removeChild(logging.children[logging.children.length - 1]);
}

function log(s) {
    var p = document.createElement('p');
    p.innerHTML = s;
    logging.appendChild(p);
}
// 0.5秒后返回input*input的计算结果:
function multiply(input) {
    return new Promise(function (resolve, reject) {
        log('calculating ' + input + ' x ' + input + '...');
        setTimeout(resolve, 500, input * input);
    });
}

// 0.5秒后返回input+input的计算结果:
function add(input) {
    return new Promise(function (resolve, reject) {
        log('calculating ' + input + ' + ' + input + '...');
        setTimeout(resolve, 500, input + input);
    });
}

var p = new Promise(function (resolve, reject) {
    log('start new Promise...');
    resolve(123);
});

p.then(multiply)
 .then(add)
 .then(multiply)
 .then(add)
 .then(function (result) {
    log('Got value: ' + result);
});
```

## 附录1：Promise.prototype详解

|     属性     |         |
| :----------: | :-----: |
|   writable   | `false` |
|  enumerable  | `false` |
| configurable | `false` |

### Promise.prototype 属性

* `Promise.prototype.constructor`
* 返回被创建的实例函数.  默认为 Promise 函数.

### Promise.prototype 方法

* `Promise.prototype.catch(onRejected)`

添加一个拒绝(`rejection`) 回调到当前 `promise`, 返回一个新的 `promise` 。当这个回调函数被调用，新 `promise` 将以它的返回值来 `resolve` ，否则如果当前 `promise` 进入 `fulfilled` 状态，则以当前 `promise` 的完成结果作为新 `promise` 的完成结果.

* `Promise.prototype.then(onFulfilled, onRejected)`

添加解决(`fulfillment`)和拒绝(`rejection`)回调到当前 `promise`, 返回一个新的 `promise`, 将以回调的返回值来 `resolve`.

* `Promise.prototype.finally(onFinally)`

添加一个事件处理回调于当前`promise`对象，并且在原`promise`对象解析完毕后，返回一个新的`promise`对象。回调会在当前`promise`运行完毕后被调用，无论当前`promise`的状态是完成(`fulfilled`)还是失败(`rejected`)

## 参考

* [廖雪峰的JavaScript教程](https://www.liaoxuefeng.com/wiki/1022910821149312/1023024413276544)

* [MDN Javascript 标准内置对象 Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

* [ES6中的Promise对象的理解](https://www.cnblogs.com/moveup/p/9746748.html)

* [Promise对象方法](https://www.jianshu.com/p/521f58516dcf)
