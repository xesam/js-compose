import decorate, {FunctionDecoration, SrcFunction, ThisArg, ThisType} from "./decorate";

export type AroundDecoration = {
    before?: (...args: any[]) => void;
    afterReturn?: (result: any, ...args: any[]) => any;
    afterThrow?: (error: Error, ...args: any[]) => void;
    after?: (result: any, error: Error | null, ...args: any[]) => void;
}

function _toAdviceDecoration(decoration: AroundDecoration): FunctionDecoration {
    return function $adviceDecoration(this: ThisType, srcFunc: SrcFunction, ...args: any[]) {
        if (decoration.before) {
            decoration.before.apply(this, args);
        }
        let finalReturnValue: any;
        let srcFuncErr: Error | null = null;
        try {
            if (srcFunc) {
                finalReturnValue = srcFunc.apply(this, args);
            }
        } catch (e) {
            srcFuncErr = e as Error;
            if (decoration.afterThrow) {
                decoration.afterThrow.apply(this, [srcFuncErr, ...args]); // no need to try-catch
            } else {
                throw srcFuncErr;
            }
        }
        if (!srcFuncErr && decoration.afterReturn) {
            finalReturnValue = decoration.afterReturn.apply(this, [finalReturnValue, ...args]);
        }

        if (decoration.after) {
            decoration.after.apply(this, [finalReturnValue, srcFuncErr, ...args]);
        }
        return finalReturnValue;
    };
}

export default function around(srcFunc: SrcFunction, decoration: AroundDecoration, argThis?: ThisArg) {
    const aroundDecoration = _toAdviceDecoration(decoration);
    return decorate(srcFunc, aroundDecoration, argThis);
}

export {around}