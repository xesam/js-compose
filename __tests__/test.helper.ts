export function createTestApp() {
    const onLoadMock = jest.fn();
    const onShowMock = jest.fn();
    const onLifetimeCreateMock = jest.fn();
    const onLifetimeReadyMock = jest.fn();
    const config = {
        name: 'config.raw_value',
        data: {
            name: 'config.data.raw_value'
        },
        onLoad(a: any, b: any) {
            onLoadMock(this.name, this.data, a, b);
            return {
                from: 'config.onLoad.raw_value',
            }
        },
        onShow() {
            onShowMock(this.name, this.data);
        },
        lifetimes: {
            name: 'lifetimes.raw_value',
            data: {
                name: 'lifetimes.data.raw_value'
            },
            created(a: any, b: any) {
                onLifetimeCreateMock(this.name, this.data, a, b);
            },
            ready() {
                onLifetimeReadyMock(this.name, this.data);
            }
        }
    };
    return {
        config,
        onLoadMock,
        onShowMock,
        onLifetimeReadyMock,
        onLifetimeCreateMock
    };
}