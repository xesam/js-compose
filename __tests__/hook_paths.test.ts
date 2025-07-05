import _default from "../src/hook";
import {createTestApp} from "./test.helper";

describe('hook root object', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });

    it("when hook ['onLoad', 'onShow'] with named-decoration then hook onLoad and onShow", () => {
        const beforeFunc = jest.fn();
        const newNode = _default(testApp.config,
            ['onLoad', 'onShow'],
            {
                before(this: any, a, b) {
                    beforeFunc(this.data, a, b);
                }
            });

        // @ts-ignore
        newNode.onLoad?.(100, 200);
        // @ts-ignore
        newNode.onShow?.(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);

        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'config.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'config.data.raw_value'}, 300, 400);
        expect(testApp.onLoadMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 100, 200);
        expect(testApp.onShowMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'});
    });

    it('when hook rootObj with named-named-decoration then hook onLoad and onShow', () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config,
            {
                onLoad: {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                },
                onShow: {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                }
            });
        // @ts-ignore
        newNode.onLoad(100, 200);
        // @ts-ignore
        newNode.onShow(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'config.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'config.data.raw_value'}, 300, 400);
        expect(testApp.onLoadMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 100, 200);
        expect(testApp.onShowMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'});
    });

    it('when hook rootObj with named-function-object then pass host-argument to onLoad and onShow', () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config,
            {
                onLoad(host) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(host.name, this.data, a, b);
                        }
                    };
                },
                onShow(host) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(host.name, this.data, a, b);
                        }
                    };
                }
            });

        // @ts-ignore
        newNode.onLoad(100, 200);
        // @ts-ignore
        newNode.onShow(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, 'config.raw_value', {name: 'config.data.raw_value'}, 300, 400);
        expect(testApp.onLoadMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'}, 100, 200);
        expect(testApp.onShowMock).toHaveBeenNthCalledWith(1, 'config.raw_value', {name: 'config.data.raw_value'});
    });
});

describe('hook child paths', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });

    it("when hook rawObj.lifetimes with ['created', 'ready'] then hook created and ready", () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config.lifetimes,
            ['created', 'ready'],
            {
                before(this: any, a, b) {
                    beforeFunc(this.data, a, b);
                }
            });

        // @ts-ignore
        newNode.created(100, 200);
        // @ts-ignore
        newNode.ready(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'lifetimes.data.raw_value'}, 300, 400);
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(testApp.onLifetimeReadyMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'});
    });

    it('when hook rawObj.lifetimes with named-named-decoration then hook created and ready', () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config.lifetimes,
            {
                created: {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                },
                ready: {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                }
            });
        // @ts-ignore
        newNode.created(100, 200);
        // @ts-ignore
        newNode.ready(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'lifetimes.data.raw_value'}, 300, 400);
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(testApp.onLifetimeReadyMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'});
    });

    it('when hook rawObj.lifetimes with named-function-object then pass host-argument to created and ready', () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config.lifetimes,
            {
                created(host) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(host.name, this.data, a, b);
                        }
                    };
                },
                ready(host) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(host.name, this.data, a, b);
                        }
                    };
                }
            });
        // @ts-ignore
        newNode.created(100, 200);
        // @ts-ignore
        newNode.ready(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 300, 400);
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(testApp.onLifetimeReadyMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'});
    });
});

describe('hook compound paths', () => {
    let testApp: any;
    beforeEach(() => {
        testApp = createTestApp();
    });

    it("when hook rawObj with ['lifetimes.created', 'lifetimes.ready'] then hook created and ready", () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config,
            ['lifetimes.created', 'lifetimes.ready'],
            {
                before(this: any, a, b) {
                    beforeFunc(this.data, a, b);
                }
            });
        // @ts-ignore
        newNode.lifetimes.created(100, 200);
        // @ts-ignore
        newNode.lifetimes.ready(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'lifetimes.data.raw_value'}, 300, 400);
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(testApp.onLifetimeReadyMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'});
    });

    it('when hook rawObj with named-named-decoration then hook created and ready', () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config,
            {
                'lifetimes.created': {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                },
                'lifetimes.ready': {
                    before(this: any, a, b) {
                        beforeFunc(this.data, a, b);
                    }
                }
            });
        // @ts-ignore
        newNode.lifetimes.created(100, 200);
        // @ts-ignore
        newNode.lifetimes.ready(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, {name: 'lifetimes.data.raw_value'}, 300, 400);
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(testApp.onLifetimeReadyMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'});
    });

    it('when hook rawObj with named-function-object then pass host-argument to created and ready', () => {
        const beforeFunc = jest.fn();
        const newNode = _default(
            testApp.config,
            {
                'lifetimes.created'(host) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(host.name, this.data, a, b);
                        }
                    };
                },
                'lifetimes.ready'(host) {
                    return {
                        before(this: any, a, b) {
                            beforeFunc(host.name, this.data, a, b);
                        }
                    };
                }
            });
        // @ts-ignore
        newNode.lifetimes.created(100, 200);
        // @ts-ignore
        newNode.lifetimes.ready(300, 400);

        expect(beforeFunc).toHaveBeenCalledTimes(2);
        expect(beforeFunc).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(beforeFunc).toHaveBeenNthCalledWith(2, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 300, 400);
        expect(testApp.onLifetimeCreateMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'}, 100, 200);
        expect(testApp.onLifetimeReadyMock).toHaveBeenNthCalledWith(1, 'lifetimes.raw_value', {name: 'lifetimes.data.raw_value'});
    });
});
