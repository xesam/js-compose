import _default from "../src/hook";
import {createTestApp} from "./test.helper";

describe('hook attr', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });
    it('when hook onLoad with named-decoration then onLoad.before and onLoad.afterReturn are called', () => {
        const onMockLoadHook = jest.fn();
        const newConfig = _default(
            testApp.config,
            'onLoad',
            {
                before(this: any, a, b) {
                    onMockLoadHook(this.data, a, b);
                },
                afterReturn(theOriginReturn, a, b) {
                    return {a, b};
                }
            });

        // @ts-ignore
        const res = newConfig.onLoad?.('param_1', 'param_2');

        expect(testApp.onLoadMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 'param_1', 'param_2');
        expect(onMockLoadHook).toHaveBeenNthCalledWith(1, {name: 'config.data.raw_value'}, 'param_1', 'param_2');
        expect(res).toStrictEqual({a: 'param_1', b: 'param_2'});
    });


    it('when hook with named-decoration then onLoad.before and onLoad.afterReturn are called', () => {
        const onMockLoadHook = jest.fn();
        const newConfig = _default(
            testApp.config,
            {
                onLoad: {
                    before(this: any, a, b) {
                        onMockLoadHook(this.data, a, b);
                    },
                    afterReturn(theOriginReturn, a, b) {
                        return {a, b};
                    }
                }
            });

        // @ts-ignore
        const res = newConfig.onLoad?.('param_1', 'param_2');

        expect(testApp.onLoadMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 'param_1', 'param_2');
        expect(onMockLoadHook).toHaveBeenNthCalledWith(1, {name: 'config.data.raw_value'}, 'param_1', 'param_2');
        expect(res).toStrictEqual({a: 'param_1', b: 'param_2'});
    });

    it('when hook with named-functional-decoration then onLoad.before and onLoad.afterReturn are called', () => {
        const mockOnLoadWithFirstParameter = jest.fn();
        const mockOnLoadWithOriginReturn = jest.fn();
        const newConfig = _default(
            testApp.config,
            {
                onLoad(app) {
                    return {
                        before(this: any, a, b) {
                            mockOnLoadWithFirstParameter(app.name);
                        },
                        afterReturn(theOriginReturn, a, b) {
                            mockOnLoadWithOriginReturn(theOriginReturn);
                            return {a, b};
                        }
                    };
                }
            });

        // @ts-ignore
        newConfig.onLoad?.('param_1', 'param_2');

        expect(mockOnLoadWithFirstParameter).toHaveBeenNthCalledWith(1, 'config.raw_value');
        expect(mockOnLoadWithOriginReturn).toHaveBeenNthCalledWith(1, {
            from: 'config.onLoad.raw_value',
        });
    });
});

describe('hook nonexistent method', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });
    it('when hook nonexistent method with void-returned-builder then change nothing', () => {
        const newConfig = _default(testApp.config, 'nonexistent', function () {
            return false;
        });

        expect(newConfig.nonexistent).toBeUndefined();
    });

    it('when hook nonexistent method with truly-return-builder then create the method', () => {
        const newConfig = _default(testApp.config, 'nonexistent', function () {
            return {};
        });

        expect(newConfig.nonexistent).not.toBeUndefined();
    });

    it('when hook nonexistent method with empty-named-decoration then create the method for origin obj', () => {
        const newConfig = _default(testApp.config, 'nonexistent', {});

        // @ts-ignore
        newConfig.nonexistent('param_1', 'param_2');

        expect(typeof newConfig.nonexistent).toBe('function');
    });

    it('when hook nonexistent method with named-decoration then create the method', () => {
        const beforeFunc = jest.fn();
        const newConfig = _default(testApp.config, 'nonexistent', {
            before(this: any, a, b) {
                beforeFunc(this.name, this.data, a, b);
            }
        });

        // @ts-ignore
        newConfig.nonexistent('param_1', 'param_2');

        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 'param_1', 'param_2');
    });
});