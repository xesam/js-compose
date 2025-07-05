import {decorate, FunctionDecoration, SrcFunction, ThisArg} from './decorate';
import {around, AroundDecoration} from './around';

export type WrapDecoration = FunctionDecoration | AroundDecoration;

export default function _wrap(srcFunc: SrcFunction, decoration: WrapDecoration, argThis?: ThisArg) {
    if (!decoration || typeof decoration === 'function') {
        return decorate(srcFunc, decoration, argThis);
    } else {
        return around(srcFunc, decoration, argThis);
    }
}

export {_wrap as wrap}