# Promise 对象详解

## Promise概述

> **Promise对象用于表示一个异步操作的最终完成 (或失败), 及其结果值**

* Promise是异步编程的一种解决方法
* Promise是一个容器，用于保存一个尚未结束的事件的结果
* Promise可以获取异步操作的消息
* Promise提供统一的API，如此一来各种异步操作都可以用同样的方法进行处理

## Promise特点

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

## Promise语法

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

### 参数

`executor`

* `executor` 是带有 `resolve` 和 `reject` 两个参数的函数
* `resolve` 和 `reject` 函数被调用时，分别将 `promise` 的状态改为 `fulfilled` （完成）或 `rejected` （失败）
* `executor` 内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用 `resolve` 函数来将 `promise` 状态改成 `fulfilled` ，要么调用 `reject` 函数将 `promise` 的状态改为 `rejected`
* 如果在 `executor` 函数中抛出一个错误，那么该 `promise` 状态为 `rejected`，而 `executor` 函数的返回值被忽略。

## 属性

* `Promise.length` // length 属性，其值总是为 1
* [`Promise.prototype`](#附录1：Promise.prototype详解) // 表示 Promise 构造器的原型.









## 附录1：Promise.prototype详解


## 参考

* [MDN Javascript 标准内置对象 Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

* [ES6中的Promise对象的理解](https://www.cnblogs.com/moveup/p/9746748.html)

* [Promise对象方法](https://www.jianshu.com/p/521f58516dcf)
