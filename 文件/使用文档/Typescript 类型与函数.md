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

