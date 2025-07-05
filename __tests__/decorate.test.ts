import decorate from "../src/decorate";
import wrap from "../src/wrap";

describe('decorate', () => {
    test.each([decorate, wrap])('srcFunc can be null', (fn) => {
        const testFn = jest.fn();
        const decoratedFn = fn(null, testFn);

        decoratedFn();

        expect(testFn).toHaveBeenCalled();
    });
    test.each([decorate, wrap])('srcFunc can be undefined', (fn) => {
        const testFn = jest.fn();
        const decoratedFn = fn(undefined, testFn);

        decoratedFn();

        expect(testFn).toHaveBeenCalled();
    });
    test.each([decorate, wrap])('decoration is required to be a function', (fn) => {
        // @ts-ignore
        expect(() => fn(null, null)).toThrow('decoration must be function');
    });

    test.each([decorate, wrap])('when decoration do not call src-function then src-function is ignore', (fn) => {
        const srcFunc = jest.fn();
        const testFn = jest.fn();
        const decoratedFn = fn(srcFunc, testFn);

        decoratedFn();

        expect(srcFunc).toHaveBeenCalledTimes(0);
        expect(testFn).toHaveBeenCalledTimes(1);
    });

    test.each([decorate, wrap])('when decoration call src-function then src-function is called with argument', (fn) => {
        const srcFunc = jest.fn();
        const beforeCallback = jest.fn();
        const afterCallback = jest.fn();
        const decoratedFn = fn(srcFunc, function (src, ...args) {
            beforeCallback(1, ...args);
            src?.(2, ...args);
            afterCallback(3, ...args);
        });

        decoratedFn(100, 200);

        expect(beforeCallback).toHaveBeenCalledTimes(1);
        expect(beforeCallback).toHaveBeenCalledWith(1, 100, 200);
        expect(srcFunc).toHaveBeenCalledTimes(1);
        expect(srcFunc).toHaveBeenCalledWith(2, 100, 200);
        expect(afterCallback).toHaveBeenCalledTimes(1);
        expect(afterCallback).toHaveBeenCalledWith(3, 100, 200);
    });

    test.each([decorate, wrap])('when decorate with extra argThis then use the extra argThis', (fn) => {
        const testFn = jest.fn();
        const otherFn = jest.fn();

        function srcFunc(this: any, inputExtra: string) {
            testFn(this.extra, inputExtra);
        }

        const context = {
            extra: 'context.extra'
        };
        const decoratedFn = fn(
            srcFunc,
            function (this: any, src) {
                src?.call(context, this.extra);
                otherFn(this.extra);
            },
            context
        );

        decoratedFn();

        expect(testFn).toHaveBeenCalledWith('context.extra', 'context.extra');
        expect(otherFn).toHaveBeenCalledWith('context.extra');
    });
});
