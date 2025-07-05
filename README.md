# js-compose

一个用于JavaScript/TypeScript的函数装饰与钩子工具库，提供逻辑扩展能力。

## 安装

```bash

npm install js-compose

# 或者

npm install git@github.com:xesam/js-compose.git
```

## 核心功能

### 1. `decorate` - 基础装饰器

基础函数装饰器，允许自定义函数执行逻辑。

```typescript
import {decorate} from 'js-compose';

const srcFunc = (a: number, b: number) => a + b;
const decorated = decorate(srcFunc, (src, ...args) => {
    console.log('Before call');
    const result = src?.(...args);
    console.log('After call');
    return result;
});

decorated(1, 2); // 输出: Before call → After call → 3
```

### 2. `around` - 环绕钩子

提供`before`/`afterReturn`/`afterThrow`/`after`全生命周期钩子。

```typescript
import {around} from 'js-compose';

const srcFunc = () => {
    throw new Error('Oops');
};
const wrapped = around(srcFunc, {
    before: (...args) => console.log('Before'),
    afterThrow: (err) => console.log('Caught:', err.message),
    after: (res, err) => console.log('Finally')
});

wrapped(); // 输出: Before → Caught: Oops → Finally
```

### 3. `wrap` - 统一包装

自动判断装饰类型（函数装饰或环绕钩子）。

```typescript
import {wrap} from 'js-compose';

// 使用函数装饰
const wrapped1 = wrap(srcFunc, (src) => src?.() * 2);

// 使用环绕钩子
const wrapped2 = wrap(srcFunc, {
    afterReturn: (res) => res * 2
});
```

### 4. `hook` - 对象属性钩子

通过路径或命名规则钩住对象的多个方法/属性。

```typescript
import hook from 'js-compose';

const app = {
    config: {
        onLoad: () => {
        }
    }, lifetimes: {
        created: () => {
        }
    }
};
// 钩住config.onLoad和lifetimes.created
const newApp = hook(app, {
    'config.onLoad': {before: () => console.log('Config loading')},
    'lifetimes.created': {before: () => console.log('Component created')}
});

newApp.config.onLoad(); // 输出: Config loading
newApp.lifetimes.created(); // 输出: Component created
```

## API 文档

完整类型定义见[`src/index.ts`](src/index.ts)，核心类型包括：

- `FunctionDecoration`: 基础装饰器类型
- `AroundDecoration`: 环绕钩子类型
- `NamedDecoration`: 对象属性钩子配置类型

## 测试

```bash
npm test
```

测试覆盖了调用顺序、`this`上下文、错误处理等核心场景（见[`__tests__`](__tests__)目录）。

## ChangeLog

### 0.0.1

- 基础功能实现

## 许可

MIT