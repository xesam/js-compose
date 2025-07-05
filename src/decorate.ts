export type SrcFunction = Function | null | undefined;
export type FunctionDecoration = (srcFunc: SrcFunction, ...args: any[]) => any;
export type ThisType = any;
export type ThisArg = any;

export const NAME_SYM = Symbol("name");

export default function decorate(srcFunc: SrcFunction, decoration: FunctionDecoration, argThis?: ThisArg) {
    if (typeof decoration !== "function") {
        throw new Error("decoration must be function");
    }
    const $ = function (this: ThisType, ...args: any[]) {
        return decoration.call(argThis || this, srcFunc, ...args);
    };
    $[NAME_SYM] = srcFunc?.name;
    return $;
}

export {decorate}