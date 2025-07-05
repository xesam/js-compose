import { WrapDecoration } from "./wrap";
import { ThisArg } from "./decorate";
import { AroundDecoration } from "./around";
export type AttrName = string | symbol;
export type LeafNode = {
    [key: AttrName]: Function;
};
export type TreeNode = {
    [key: AttrName]: undefined | Function | LeafNode | TreeNode;
};
export type DecorationBuilder = (...args: any[]) => WrapDecoration | false;
export type AttrDecoration = AroundDecoration | DecorationBuilder;
export type NamedDecoration = {
    [name: AttrName]: AttrDecoration;
};
type InputArgs = [root: TreeNode, name: AttrName | AttrName[], decoration: AttrDecoration, argThis?: ThisArg] | [root: TreeNode, name: NamedDecoration, argThis?: ThisArg];
declare function create(sep?: string): (...args: InputArgs) => TreeNode;
declare const _default: (...args: InputArgs) => TreeNode;
export default _default;
export { create };
