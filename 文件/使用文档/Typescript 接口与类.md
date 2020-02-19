# TypeScript 接口与类

我们希望在代码的实现或调用上能设置一定的限制和规范，我们称这种契约为接口。

## 接口

### 定义

```ts
interface LabelledValue {
    label: string;
}
function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
let obj = { size: 10, label: "Size 10" };
printLabel(obj);

```

> **注意**
> 类型检察器不会检查属性的顺序，只要相应属性存在且类型合法即可

#### 可选属性

当函数传入的参数对象中只有部分属性赋值时，可以考虑可选属性。其定义方式与普通接口类似，只需在属性名后加一个问号。

可选属性的好处之一是**可对可能存在的属性进行预定义**，好处之二是**可以捕获应用了不存在属性时的错误**

```ts
interface LabelledValue {
    label?: string;
}
```

#### 只读属性

只能在属性刚刚创建时修改值。通过在属性名前加`readonly`来指定

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

什么时候用`readonly`，什么时候用`const`？
当把它作为变量使用时，用const；当把它当做属性使用时，用readonly。

#### 额外的属性检查

对象字面量会被特殊对待，而且当它们赋值给变量或作为参数传递时会经历额外的属性检查。如果一个对象字面量存在“目标类型”不存在的属性时，会得到错误：not expected in type

其解决方案是添加一个字符串索引签名。

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

上述表示Square可以有除color及width外的任意数量属性，无所谓其类型

### 函数类型

通过给接口定义一个调用签名，可以使用接口表示函数类型。列表参数中的每个参数都需要名字和类型。

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

> **注意**
> 函数的参数名无需与接口内定义的名字相匹配
> 类型检察器会对函数的参数逐个检查，要求对应位置上的参数类型兼容

### 可索引类型

共有两种索引类型：字符串和数字。

> **注意**
> <u>数字索引的返回值必须是字符串索引返回值类型的子类型</u>
> 这是因为当使用数字索引时，JavaScript会转换为string去索引

可以将索引签名设置为只读，从而防止给索引赋值

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory" //error
```

### 继承接口

一个接口可以继承单个或多个接口

```ts
interface Shape {
    color: string;
}
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number;
}
let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5;
```

## 类

### 定义

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello," + this.greeting;
    }
}
let greeter = new Greeter("world");
```


### 实现接口

TypeScript能够用接口来明确地强制一个类去符合某种契约。

```ts
interface ClockInterface {
    currentTime: Date;
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(
        h: number,
        m: number) { }
}
```

可以在接口中描述一个方法，在类中将其实现

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(
        h: number,
        m: number) { }
}
```

接口描述了类的公共部分，而不是公共和私有两部分，它不会帮你检查类是否具有某些私有成员

### 继承

基于类的程序设计中一种罪基本的模式是允许使用继承来扩展现有的类

```ts
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof!Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

类从基类中继承了属性和方法。派生类通常称为“子类”，基类通常称为“超类”。

```ts
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tom the Palomino");

sam.move();
tom.move(34);
```

在上面这个例子中，派生类包含了一个构造函数，必须调用`super()`，并会执行基类的构造函数。而且，在构造函数中访问`this`的属性之前一定要调用`super()`。**这是TypeScript强制执行的一条重要规则**

### 存取器

TypeScript支持通过`getters/setters`来截取对对象成员的访问

下面将一个简单的类改写成使用`get`和`set`方法。

```ts
//修改前
class Employee {
    fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}


//修改后
let passcode = "secret passcode";
class Employee {
    private _fullname: string;
    get fullName(): string {
        return this._fullname;
    }
    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullname = newName;
        } else {
            console.log("Error:Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

> **注意**
> - 需要将编译器设置为输出ECMAScript 5或更高，不支持降级到ECMAScript 3
> - 只带有get不带有set的存取器自动被推断为readonly。这在生成.d.ts文件时是有益的，利用这一属性的用户会看到不允许改变它的值

### 只读属性

可使用关键字`readonly`将属性设置为只读的，只读属性必须在声明时或构造函数内进行初始化

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor(theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit";
//Cannot assign to 'name' because it is a read-only property
```

### 类函数和静态属性

使用static定义静态属性。每个实例试图访问该属性时都需要在前面加上类名。

```ts
class Grid {
    static origin = { x: 0, y: 0 };
    calculateDistanceFromOrigin(point: { x: number; y: number; }) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor(public scale: number) { }
}

let grid1 = new Grid(1.0);
```

### 抽象类

一般作为其他派生类的基类，不会直接被实例化
与接口不同，它可以包含成员的实现细节，使用`abstract`关键字

```ts
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earth...');
    }
}
```

