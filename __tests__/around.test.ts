import around from "../src/around";
import {wrap} from "../src/wrap";

describe('around#sequence', () => {
    test.each([around, wrap])('when before, afterThrow, afterReturn, after are all provided then the call seq is before->srcFunc->afterReturn->after', (fn) => {
        const srcFunc = jest.fn();
        const beforeCallback = jest.fn();
        const afterThrowCallback = jest.fn();
        const afterReturnCallback = jest.fn();
        const afterCallback = jest.fn();
        let seq = 1;
        const wrappedFunc = fn(
            function () {
                srcFunc(seq);
                seq++;
            },
            {
                before() {
                    beforeCallback(seq);
                    seq++;
                },
                afterReturn() {
                    afterReturnCallback(seq);
                    seq++;
                },
                after() {
                    afterCallback(seq);
                    seq++;
                }
            });

        wrappedFunc(100, 200);

        expect(beforeCallback).toHaveBeenCalledWith(1);
        expect(srcFunc).toHaveBeenCalledWith(2);
        expect(afterThrowCallback).not.toHaveBeenCalled();
        expect(afterReturnCallback).toHaveBeenCalledWith(3);
        expect(afterCallback).toHaveBeenCalledWith(4);
    });

    test.each([around, wrap])('when afterReturn is not provided then the final return is srcFunc-return-value', fn => {
        const srcFunc = jest.fn().mockReturnValue({srcName: 'srcFunc.name'});
        const wrappedFunc = fn(srcFunc, {});

        const finalReturn = wrappedFunc(100, 200);

        expect(finalReturn).toStrictEqual({
            srcName: 'srcFunc.name'
        });
    });

    test.each([around, wrap])('when afterReturn is provided then the final return afterReturn-return-value', fn => {
        const srcFunc = jest.fn().mockReturnValue({srcName: 'srcFunc.name'});
        const wrappedFunc = fn(srcFunc, {
            afterReturn(rawReturn) {
                return {
                    ...rawReturn,
                    afterReturnName: 'afterReturn.name'
                };
            }
        });

        const finalReturn = wrappedFunc(100, 200);

        expect(finalReturn).toStrictEqual({srcName: 'srcFunc.name', afterReturnName: 'afterReturn.name'});
    });

    test.each([around, wrap])('when afterReturn and after are both provided then the final return afterReturn-return-value', fn => {
        const srcFunc = jest.fn().mockReturnValue({srcName: 'srcFunc.name'});
        const wrappedFunc = fn(srcFunc, {
            afterReturn(rawReturn) {
                return {
                    ...rawReturn,
                    afterReturnName: 'afterReturn.name'
                };
            },
            after(rawReturn, err) {
                return {
                    ...rawReturn,
                    afterName: 'after.name'
                };
            }
        });

        const finalReturn = wrappedFunc(100, 200);

        expect(finalReturn).toStrictEqual({
            srcName: 'srcFunc.name',
            afterReturnName: 'afterReturn.name'
        });
    });

    test.each([around, wrap])('when srcFunc throw error and afterThrow intercepted the error then afterReturn is skipped but after is called', fn => {
        const afterThrowCallback = jest.fn().mockReturnValue(true);
        const afterReturnCallback = jest.fn();
        const afterCallback = jest.fn();

        function srcFunc() {
            throw 'srcFunc.error';
        }

        const wrappedFunc = fn(srcFunc, {
            afterThrow: afterThrowCallback,
            afterReturn: afterReturnCallback,
            after: afterCallback
        });

        wrappedFunc(100, 200);

        expect(afterThrowCallback).toHaveBeenCalledWith('srcFunc.error', 100, 200);
        expect(afterReturnCallback).not.toHaveBeenCalled();
        expect(afterCallback).toHaveBeenCalled();
    });

    test.each([around, wrap])('when srcFunc throw error but afterThrow rethrow(does not intercepted) the error then after/afterReturn are both skipped', fn => {
        const afterThrowCallback = jest.fn().mockImplementation(err => {
            throw err;
        });
        const afterReturnCallback = jest.fn();
        const afterCallback = jest.fn();

        function srcFunc() {
            throw 'srcFunc.error';
        }

        const wrappedFunc = fn(srcFunc, {
            afterThrow: afterThrowCallback,
            afterReturn: afterReturnCallback,
            after: afterCallback
        });

        expect(() => {
            wrappedFunc(100, 200);
        }).toThrow('srcFunc.error');
        expect(afterThrowCallback).toHaveBeenCalledWith('srcFunc.error', 100, 200);
        expect(afterReturnCallback).not.toHaveBeenCalled();
        expect(afterCallback).not.toHaveBeenCalled();
    });

    test.each([around, wrap])('when before throw error then afterThrow/afterReturn/after are all skipped', fn => {
        const srcFunc = jest.fn();
        const afterThrowCallback = jest.fn();
        const afterReturnCallback = jest.fn();
        const afterCallback = jest.fn();

        function beforeCallback() {
            throw 'beforeCallback.error';
        }

        const wrappedFunc = fn(srcFunc, {
            before: beforeCallback,
            afterThrow: afterThrowCallback,
            afterReturn: afterReturnCallback,
            after: afterCallback
        });

        expect(() => {
            wrappedFunc(100, 200);
        }).toThrow('beforeCallback.error');
        expect(srcFunc).not.toHaveBeenCalled();
        expect(afterThrowCallback).not.toHaveBeenCalled();
        expect(afterReturnCallback).not.toHaveBeenCalled();
        expect(afterCallback).not.toHaveBeenCalled();
    });

    test.each([around, wrap])('when afterReturn throw error then afterThrow/after are both skipped', fn => {
        const srcFunc = jest.fn();
        const afterThrowCallback = jest.fn();
        const afterCallback = jest.fn();

        function afterReturnCallback() {
            throw 'afterReturnCallback.error';
        }

        const wrappedFunc = fn(srcFunc, {
            afterReturn: afterReturnCallback,
            afterThrow: afterThrowCallback,
            after: afterCallback
        });

        expect(() => {
            wrappedFunc(100, 200);
        }).toThrow('afterReturnCallback.error');
        expect(srcFunc).toHaveBeenCalledWith(100, 200);
        expect(afterThrowCallback).not.toHaveBeenCalled();
        expect(afterCallback).not.toHaveBeenCalled();
    });

    test.each([around, wrap])('when after throw error then afterThrow is ignored', fn => {
        const srcFunc = jest.fn();
        const afterThrowCallback = jest.fn();

        function afterCallback() {
            throw 'afterCallback.error';
        }

        const wrappedFunc = fn(srcFunc, {
            afterThrow: afterThrowCallback,
            after: afterCallback
        });

        expect(() => {
            wrappedFunc(100, 200);
        }).toThrow('afterCallback.error');

        expect(srcFunc).toHaveBeenCalled();
        expect(afterThrowCallback).not.toHaveBeenCalled();
    });
});

describe('around#thisArg', () => {
    test.each([around, wrap])('when around with extra thisArg then use extra thisArg', fn => {
        const testFn = jest.fn();
        const beforeCallback = jest.fn();
        const afterReturnCallback = jest.fn();
        const afterCallback = jest.fn();

        function srcFunc(this: any, a: number, b: number) {
            testFn(this.extra, a, b);
        }

        srcFunc.extra = 'fn.extra';

        const thisArg = {
            extra: 'thisArg.extra'
        };
        const wrappedFunc = fn(srcFunc, {
            before(this: any, a, b) {
                beforeCallback(this.extra, a, b);
            },
            afterReturn(this: any, res, a, b) {
                afterReturnCallback(this.extra, a, b);
            },
            after(this: any, res, rawError, a, b) {
                afterCallback(this.extra, a, b);
            }
        }, thisArg);

        wrappedFunc(100, 200);

        expect(beforeCallback).toHaveBeenCalledWith('thisArg.extra', 100, 200);
        expect(testFn).toHaveBeenCalledWith('thisArg.extra', 100, 200);
        expect(afterReturnCallback).toHaveBeenCalledWith('thisArg.extra', 100, 200);
        expect(afterCallback).toHaveBeenCalledWith('thisArg.extra', 100, 200);
    });
});