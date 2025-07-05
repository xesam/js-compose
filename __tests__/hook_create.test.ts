import _default, {create} from "../src/hook";
import {createTestApp} from "./test.helper";

describe('hook create', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });
    it('when hook with customHook then customHook is applied', () => {
        const beforeFunc = jest.fn();
        const customHook = create('#');
        let newNode = customHook(
            testApp.config,
            {
                onLoad: {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                },
                'lifetimes#created'() {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(this.data, a, b);
                        }
                    };
                }
            });
        newNode = _default(
            newNode,
            {
                onShow: {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                },
                'lifetimes.ready'() {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(this.data, a, b);
                        }
                    };
                }
            });

        // @ts-ignore
        newNode.onLoad('onLoad_arg1', 'onLoad_arg2');
        // @ts-ignore
        newNode.onShow('onShow_arg1', 'onShow_arg2');
        // @ts-ignore
        newNode.lifetimes.created('created_arg1', 'created_arg2');
        // @ts-ignore
        newNode.lifetimes.ready('ready_arg1', 'ready_arg2');

        expect(beforeFunc).toHaveBeenCalledTimes(4);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'config.data.raw_value'}, 'onLoad_arg1', 'onLoad_arg2');
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'config.data.raw_value'}, 'onShow_arg1', 'onShow_arg2');
        expect(beforeFunc).toHaveBeenNthCalledWith(3, {name: 'lifetimes.data.raw_value'}, 'created_arg1', 'created_arg2');
        expect(beforeFunc).toHaveBeenNthCalledWith(4, {name: 'lifetimes.data.raw_value'}, 'ready_arg1', 'ready_arg2');
    });
});
