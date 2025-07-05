import _default from "../src/hook";
import {createTestApp} from "./test.helper";

describe('hook path', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });

    it('when hook lifetimes with named-decoration then lifetimes.created.before and lifetimes.created.afterReturn are called', () => {
        const beforeFunc = jest.fn();
        const newConfig = _default(
            testApp.config.lifetimes,
            'created', {
                before(this: any, a, b) {
                    beforeFunc(this.name, this.data, a, b);
                },
                afterReturn(theOriginReturn, a, b) {
                    return {a, b};
                }
            });

        // @ts-ignore
        const res = newConfig.created?.('param_1', 'param_2');

        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(res).toStrictEqual({a: 'param_1', b: 'param_2'});
    });

    it('when hook lifetimes with named-decoration then lifetimes.created.before and lifetimes.created.afterReturn are called', () => {
        const beforeFunc = jest.fn();
        const newConfig = _default(
            testApp.config,
            'lifetimes.created',
            {
                before(this: any, a, b) {
                    beforeFunc(this.name, this.data, a, b);
                },
                afterReturn(theOriginReturn, a, b) {
                    return {a, b};
                }
            });

        // @ts-ignore
        const res = newConfig.lifetimes.created?.('param_1', 'param_2');

        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(res).toStrictEqual({a: 'param_1', b: 'param_2'});
    });

    it('when hook lifetimes with named-functional-decoration then lifetimes.created.before and lifetimes.created.afterReturn are called', () => {
        const beforeFunc = jest.fn();
        const newConfig = _default(
            testApp.config.lifetimes,
            {
                created(app) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(app.name, this.data, a, b);
                        },
                        afterReturn(theOriginReturn, a, b) {
                            return {a, b};
                        }
                    };
                }
            });

        // @ts-ignore
        const res = newConfig.created?.('param_1', 'param_2');

        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(res).toStrictEqual({a: 'param_1', b: 'param_2'});
    });
    it('when hook lifetimes with named-functional-decoration then lifetimes.created.before and lifetimes.created.afterReturn are called', () => {
        const beforeFunc = jest.fn();
        const newConfig = _default(
            testApp.config,
            {
                'lifetimes.created'(app) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(app.name, this.data, a, b);
                        },
                        afterReturn(theOriginReturn, a, b) {
                            return {a, b};
                        }
                    };
                }
            });

        // @ts-ignore
        const res = newConfig.lifetimes.created?.('param_1', 'param_2');

        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 'param_1', 'param_2');
        expect(res).toStrictEqual({a: 'param_1', b: 'param_2'});
    });

    it('when hook lifetimes with with named-decoration and custom context then use the custom context', () => {
        const onLifetimeCreateHook = jest.fn();
        const newConfig = _default(
            testApp.config.lifetimes,
            'created',
            {
                before(this: any, a, b) {
                    onLifetimeCreateHook(this.data, a, b);
                }
            },
            {data: {name: 'custom.value'}}
        );

        // @ts-ignore
        newConfig.created?.('param_1', 'param_2');

        expect(onLifetimeCreateHook).toHaveBeenNthCalledWith(1, {name: 'custom.value'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, undefined, {name: 'custom.value'}, 'param_1', 'param_2');
    });

    it('when hook lifetimes with named-functional-decoration and custom context then use the custom context', () => {
        const onLifetimeCreateHook = jest.fn();
        const newConfig = _default(
            testApp.config.lifetimes,
            {
                created(app) {
                    return {
                        before(this: any, a, b) {
                            onLifetimeCreateHook(app.name, this.data, a, b);
                        }
                    };
                }
            },
            {data: {name: 'custom.value'}}
        );

        // @ts-ignore
        newConfig.created?.('param_1', 'param_2');

        expect(onLifetimeCreateHook).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'custom.value'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, undefined, {name: 'custom.value'}, 'param_1', 'param_2');
    });
    it('when hook lifetimes with named-functional-decoration and custom context then use the custom context', () => {
        const theHook = jest.fn();
        const newConfig = _default(
            testApp.config,
            {
                'lifetimes.created'(app) {
                    return {
                        before(this: any, a, b) {
                            theHook(app.name, this.data, a, b);
                        }
                    };
                }
            },
            {data: {name: 'custom_name'}}
        );

        // @ts-ignore
        newConfig.lifetimes.created('param_1', 'param_2');

        expect(theHook).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'custom_name'}, 'param_1', 'param_2');
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, undefined, {name: 'custom_name'}, 'param_1', 'param_2');
    });
});
