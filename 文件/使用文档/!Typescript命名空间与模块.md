# Typescript命名空间与模块

## 命名空间

我们需要一种手段来组织代码，以便于在记录它们类型的同时不必担心与其他对象命名冲突

命名空间使用关键字`namespace`

### 单文件命名空间

把所有与验证器相关的类型都放在一个名为`Validation`的命名空间内叫单文件命名空间
我们希望这些接口和类在命名空间之外也是可访问的，所以需要`export`
而其中的实现细节不需要导出，命名空间外也无法访问

```ts
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    //正则表达式
    const letterRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LetterOnly implements StringValidator {
        isAcceptable(s: string) {
            return letterRegexp.test(s);
        }
    }

    export class ZipCodeOnly implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```

使用实例

```ts
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeOnly();
validators["Letter only"] = new Validation.LetterOnly();
```

### 多文件命名空间

当应用比较大，我们需要把代码分割到不同文件中以便维护
现在我们把