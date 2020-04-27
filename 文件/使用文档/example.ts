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

let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeOnly();
validators["Letter only"] = new Validation.LetterOnly();