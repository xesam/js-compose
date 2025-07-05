import { SrcFunction, ThisArg, ThisType } from "./decorate";
export type AroundDecoration = {
    before?: (...args: any[]) => void;
    afterReturn?: (result: any, ...args: any[]) => any;
    afterThrow?: (error: Error, ...args: any[]) => void;
    after?: (result: any, error: Error | null, ...args: any[]) => void;
};
export default function around(srcFunc: SrcFunction, decoration: AroundDecoration, argThis?: ThisArg): {
    (this: ThisType, ...args: any[]): any;
    [NAME_SYM]: string | undefined;
};
export { around };
