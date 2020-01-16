# TypeScript类型与函数

TypeScript = **Typed** JavaScript

TypeScript 的核心是 **Type**（类型）

TypeScript 可以**在编译时帮你做类型检查，但无法确保运行时不翻车**

## 基本类型

### JavaScript中的类型

| 类型      | 说明                         |
| --------- | ---------------------------- |
| boolean   | 布尔值，包括`true`和`false`  |
| null      | 表示null值                   |
| undefined | 变量未定义                   |
| number    | 数字                         |
| string    | 字符串                       |
| symbol    | 一种数据类型(ES6)            |
| object    | 对象，可视为存放值的命名容器 |

### TypeScript中的类型

#### 基本类型的定义

```js
//布尔
let bool: boolean = true;
//数字
let n: number = 233;
//字符串
let str: string = "I'm a string";
//模版字符串
let age: number = 20;
let mstr: string = `I'm ${age} years old`;
```

#### 数组的定义

```js
//在元素类型后加[]
let list1: number[] = [1, 2, 3];
//使用数组泛型
let list2: Array<number> = [1, 2, 3];
```

> **注意**
> 如果在初始化阶段已声明了变量类型，中途更改，会触发TypeScript编译报错。
> <u> 即TypeScript有严格的类型检查 </u>

#### 类型断言

手动指定一个值的类型。这是一种修正方案，前提是你知道自己在干什么。在其他语言中，使用类型转换解决类似的情形。

```js
//方式一 使用尖括号
let str1: any = "I'm a string.";
let strLen1: number = (<string>str).length;
//方式二 使用关键字as
let str2: any = "I'm a string.";
let strLen2: number = (str2 as string).length;
```

### 泛型

我们希望无论是模块或是组件，不仅能支持当前设计的数据类型，也能支持将来的数据类型。
一种方式是使用any代替，~~TypeScript因此得名AnyScript~~

```js
function foo(fo: any) {
    return fo;
}
```

另一种方式是使用泛型（**推荐**）

```js
//泛型函数的声明
function foo<T>(fo: T): T {
    return fo;
}
//泛型函数的使用 方式一
let output1 = foo<string>("I'm a string");
//泛型函数的使用 方式二
let output2 = foo("I'm a string");
```

> **注意**
> 其中泛型变量T代表即将传入的类型，最后我们还使用T作为返回值的类型，从而保证返回值和参数类型相同。

### 枚举

#### 数字枚举

```js
enum Status {
    prop1 = 1,
    prop2,
    prop3,
    prop4,
}
```

此后就可以使用`Status.prop1`代替数字`1`

> **注意**
> 若枚举的变量均未赋值，则其值为0，后续变量的值依次递增
> 若第一个枚举的变量已赋值，而后续变量未赋值，则后续变量的值依次递增

#### 字符串枚举

在字符串枚举中，所以成员必须均为字符串字面量，且需手动初始化。

```js
enum Status {
    prop1 = "PropContent1",
    prop2 = "PropContent2",
    prop3 = "PropContent3",
    prop4 = "PropContent4",
}
```

#### 反向映射

基于数字枚举时的代码编译原理，**字符串枚举没有反向映射！！！**

如以下代码，编译为JavaScript后为

```js
//编译前
enum Foo {
    A
}
//编译后
(function (Foo) {
    Foo[Foo["A"] = 0] = "A";
})(Foo || (Foo = {}));
```

因此既可以从属性名获取值，也可以从值获取属性名

```js
val = Foo.A;//0
nameOfVal = Foo[a];//"A"
```

### symbol

Symbol是由ES6规范引入的一项新特性，它的功能类似于一种标识唯一性的ID。在TypeScript中，symbol也是通过Symbol构造函数创建的。

```js
const symbol1 = Symbol("I'm a description");
```

### 迭代器 iterator

当一个对象实现了`Symbol.iterator`，我们称它是可迭代的。
对象的`Symbol.iterator`函数返回供迭代的值。

`for..in`和`for..of`都可以迭代一个数组，但返回值不同。

- `for..in`迭代对象的**键**
- `for..of`迭代对象的**值**

```js
const arr = [3, 4, 5];
//使用for..in
for (let i in arr) {
    console.log(i);//0,1,2
}
//使用for..of
for (let i of arr) {
    console.log(i);//4,5,6
}
```

### 生成器 generator

`function *`是创建`generator`函数的语法。`generator`对象遵循迭代器接口，即`next`，`return`和`throw`函数。

- `generator`对象只在调用`next`时开始执行
- 函数在执行`yield`语句时暂停并返回`yield`的值
- 函数在`next`被调用时继续恢复执行
- 外部系统可以传递一个值到`generator`函数体中
- 外部系统可以抛入一个异常到`generator`函数体中

## 高级类型

前述的基本类型除泛型外，在JavaScript中均有类似的定义和使用。
此处所述的高级类型为TypeScript特有。

### interface

- 对字典进行类型约束
- 作为接口的能力(**略**)

```js
interface A {
    a: number,
    b: string,
    c: number[]
}
let a: A;
a.a = 1;
a.b = "I'm a string";
a.c = [1, 2, 3];
a.d //此处报错：Property 'd' does not exist on type 'A'.
```

### 交叉类型与联合类型

交叉类型：将多个字典类型合并为一个新的字典类型

```js
type newType = number & string;
let a: newType;
interface A {
    s: number,
}
interface B {
    s: string,
}
type C = A & B;
let c: C;

c.s = 123;//此处报错
c.s = "123";//此处报错
```

`s`无论如何赋值都无法通过类型检查

如果我们使用`any`，却传入一个既非`number`也非`string`的参数则**编译阶段通过，运行时报错**。通常在传统编程语言中，使用**函数重载**解决此类问题。

替代`any`，使用联合类型。

```js
function Foo(value1: string, value2: string | number | boolean){
    //...
}
```

此时value2既可以是`string`，`number`或`boolean`。

> **注意**
> 如果一个值是联合类型，我们只能访问它们共有的属性

> **注意**
> 在interface中，**联合类型取的是交集，交叉类型取的是并集**（没有写错）

### 类型保护与区分类型

当我们想确切获得某值的类型，首先想到使用类型断言强制类型推测

```js
interface Teacher{
    teach():void;
}
interface Student{
    learn():void;
}
function getPerson():Teacher|Student{
    return {} as Teacher;
}
const person=getPerson();

(<Student>person).learn();
(<Teacher>person).teach();
```

而在TypeScript中存在类型保护机制，可以规避繁琐的类型断言

```js
function isTeacher(person: Teacher | Student): person is Teacher {
    return (<Teacher>perosn).teach !== undefined;
}
```

> **注意**
> `person is Teacher`就是类型保护语句
> <u>每当变量调用`isTeacher()`时，TypeScript会把变量指定为类型保护中的类型</u>

### typeof和instanceof

观察以下代码

```js
function isNumber(val: number | string): val is number {
    return typeof val === "number";
}
```

TypeScript会将`typeof……`视为一种类型保护。

`typeof`**只有在匹配到基本类型时，才会启用类型保护**

除`typeof`外，`instanceof`也有类似的作用，其类型保护更加精细，可以将类作为比较对象

### 类型别名

给类型起一个新名字，~~从而降低文档编写复杂度~~

使用`type`关键字描述类型变量

```js
type Name = string;
```

### ！！！索引类型与映射类型

待补充

### ！！！类型推导

待补充 

## 函数

### 定义函数

TypeScript能够根据返回值自动推断出类型，英雌我们常常省略返回值类型。

```js
function fn1(x: number, y: number): number {
    return x + y;
}
```

### 参数

#### 可选参数

如果我们希望后续的参数是可选的，应当使用问号`?`

```js
function fn1(value1: string, value2?: string) {
    return value1 + " " + value2;
}
```

> **注意**
> 可选参数必须放在必要参数之后

#### 默认参数

如果无值传入，可以设定一个默认初始化的参数

```js
function fn1(value1: string, value2 = "default") {
    return value1 + " " + value2;
}
```

在这个例子中，`value2`同样是可以省略的，缺省值为`"default"`。

> **注意**
> 与可选参数不同，带默认值的参数无需放在最后，它可以在任何位置

#### 剩余参数

在JavaScript中，当传入参数数量未知，可以使用`arguments`来访问所有传入参数

在TypeScript中，你可以吧参数集中到一个变量中，加省略号`...`即可

```js
function fn1(value1: string, ...values: string[]) {
    return value1 + " " + values.join(" ");
}
```

### 回调函数和promise

在使用基于回调方式的异步函数时需要注意以下准则

- 一定不要调用两次回调
- 一定不要抛出错误

#### 创建promise

`promise`是有状态的：`pending`，`resolved`，`rejected`

`promise`由Promise构造器创建，**resolve对应处理成功，reject对应处理失败**

```js
const promise = new Promise((resolve, reject) => {
    resolve("It works");
    reject("It doesn't works");
})
```

#### 订阅promise

`promise`使用`then`或`catch`来订阅

```js
promise.then((res) => {
    console.log(res);// It works
})
promise.catch((err)=>{
    console.log(errr);// It doesn't works
})
```

#### promise的链式性

链式性是promise的**核心优点**

你可以将之前任何`promise`点上的异常都在最后的`promise.catch()`中处理

#### 并行控制流

如果打算执行一系列异步任务，并在所有任务完成后执行操作（如拉取多个API的数据）

promise提供了`Promise.all()`函数

```js
//拉取第一个信息
function fetchApi1(UID: string): Promise<{}> {
    //...
}
function fetchApi2(UID: string): Promise<{}> {
    //...
}
function fetchApi3(UID: string): Promise<{}> {
    //...
}
Promise.all([fetchApi1("233"), fetchApi2("233"), fetchApi3("233")])
    .then(
        res => {
            console.log(res);
        }
    )
```

#### async/await

`async/await`基于迭代器实现，它会暂停函数的执行能力，等待结果返回。

## 参考

- 《TypeScript实战指南》 机械工业出版社
- MDN
