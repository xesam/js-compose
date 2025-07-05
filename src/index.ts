import {decorate, NAME_SYM} from './decorate';
import type {FunctionDecoration, SrcFunction, ThisArg, ThisType} from './decorate';
import {around} from './around';
import type {AroundDecoration} from './around';
import {wrap} from "./wrap";
import type {WrapDecoration} from "./wrap";
import default_hook, {create as create_hook} from "./hook";
import type {AttrDecoration, LeafNode, NamedDecoration, AttrName, DecorationBuilder, TreeNode} from "./hook";

export {
    NAME_SYM,
    decorate,
    around,
    wrap,
    default_hook,
    create_hook,
}

export type {
    SrcFunction,
    FunctionDecoration,
    AroundDecoration,
    WrapDecoration,
    DecorationBuilder,
    ThisArg,
    ThisType,
    AttrName,
    LeafNode,
    TreeNode,
    AttrDecoration,
    NamedDecoration
}