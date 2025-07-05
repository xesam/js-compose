import { FunctionDecoration, SrcFunction, ThisArg } from './decorate';
import { AroundDecoration } from './around';
export type WrapDecoration = FunctionDecoration | AroundDecoration;
export default function _wrap(srcFunc: SrcFunction, decoration: WrapDecoration, argThis?: ThisArg): {
    (this: import("./decorate").ThisType, ...args: any[]): any;
    [NAME_SYM]: string | undefined;
};
export { _wrap as wrap };
