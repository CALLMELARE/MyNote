# Symbol-ES6引入的新特性

## 概述

Symbol是一种**基本数据类型**(primitive data type)

- 它的功能类似于一种标识唯一性的ID。
- 每个从Symbol()返回的symbol值都是唯一的。
- 一个symbol值能作为对象属性的标识符；这是该数据类型仅有的目的。

## 语法

```js
Symbol([description])
```

## 使用方法

通过调用`Symbol()`函数可以创建一个Symbol实例。同时可以传入一个字符串作为描述信息。

```js
//无描述
let symbol1 = Symbol();
//有描述
let symbol2 = Symbol("I'm a description");
```

## 相关属性

### 检查类型,返回`symbol`

```js
const symbol1 = Symbol();
console.log(typeof symbol1); //"symbol"
```

### 每个Symbol实例都是唯一的

```js
console.log(Symbol('foo') === Symbol('foo')); //false
```

### 长度

```js
Symbol.length //0
```

### 原型

```js
Symbol.prototype
```

## 使用场景

### 场景1：使用Symbol来作为对象属性名(key)

我们通常定义或访问对象的属性时使用字符串

```js
let obj = {
    "keyName": "keyValue"
}

obj["keyName"] // 'keyValue'
```

Symbol可同样用于对象属性的定义和访问

```js
const PROP_NAME = Symbol();
const PROP_VALUE = Symbol();

let obj = {
    [PROP_NAME]: "NAME"
}
obj[PROP_VALUE] = 233

obj[PROP_NAME] // 'NAME'
obj[PROP_VALUE] // 233
```

我们经常会需要使用`Object.keys()`或者`for...in`来枚举对象的属性名

```js
let obj = {
    [Symbol('name')]: 'NAME',
    value: 233,
}

Object.keys(obj)   // ['value']

for (let p in obj) {
    console.log(p)   // 分别会输出：'value'
}

Object.getOwnPropertyNames(obj)   // ['value']
```

Symbol类型的key不能通过`Object.keys()`或者`for...in`来枚举
不过我们可以把一些**不需要对外操作和访问的属性**使用Symbol来定义
当使用`JSON.stringify()`将对象转换成JSON字符串的时

```js
JSON.stringify(obj)  // {"value":233}
```

获取以Symbol方式定义的对象属性

```js
// 使用Object的API
Object.getOwnPropertySymbols(obj) // [Symbol(name)]

// 使用新增的反射API
Reflect.ownKeys(obj) // [Symbol(name), 'value']
```

### 场景2：使用Symbol来替代常量

```js
const TYPE_AUDIO = 'AUDIO'
const TYPE_VIDEO = 'VIDEO'
const TYPE_IMAGE = 'IMAGE'

function handleFileResource(resource) {
    switch (resource.type) {
        case TYPE_AUDIO:
            playAudio(resource)
            break
        case TYPE_VIDEO:
            playVideo(resource)
            break
        case TYPE_IMAGE:
            previewImage(resource)
            break
        default:
            throw new Error('Unknown type of resource')
    }
}
```

我们经常定义一组常量来代表一种业务逻辑下的几个不同类型，且这几个常量之间是唯一的关系
我们可以使用Symbol来实现

```js
const TYPE_AUDIO = Symbol();
const TYPE_VIDEO = Symbol();
const TYPE_IMAGE = Symbol();
```

### 场景3：使用Symbol定义类的私有属性/方法

借助Symbol以及模块化机制，可以实现类的私有属性和方法

```js
// fileA.js
const PASSWORD = Symbol();

class Login {
    constructor(username, password) {
        this.username = username;
        this[PASSWORD] = password;
    }

    checkPassword(pwd) {
        return this[PASSWORD] === pwd;
    }
}

export default Login;
```

```js
// fileB.js
import Login from './a'

const login = new Login('admin', '123456')

login.checkPassword('123456')  // true

login.PASSWORD  // No!!!
login[PASSWORD] // No!!!
login["PASSWORD"] // No!!!
```

PASSWORD定义在a.js所在的模块中，外面的模块获取不到这个Symbol，又因为Symbol是唯一的，因此PASSWORD的Symbol被限制在a.js内部使用。以此达到了私有化目的。

## 注册和获取全局Symbol

在不同window中创建的Symbol实例总是唯一的，如果我们希望在所有window环境下保持一个共享的Symbol，就需要一个API来创建或获取Symbol

`Symbol.for()`可以注册或获取一个window间**全局**的Symbol实例

```js
let gs1 = Symbol.for('globalSymbol1')  //注册一个全局Symbol
let gs2 = Symbol.for('globalSymbol1')  //获取全局Symbol

gs1 === gs2  // true
```
