import {wrap, WrapDecoration} from "./wrap";
import {NAME_SYM, ThisArg} from "./decorate";
import {AroundDecoration} from "./around";

export type AttrName = string | symbol;

export type LeafNode = {
    [key: AttrName]: Function
}

export type TreeNode = {
    [key: AttrName]: undefined | Function | LeafNode | TreeNode
}

export type DecorationBuilder = (...args: any[]) => WrapDecoration | false;

export type AttrDecoration = AroundDecoration | DecorationBuilder;

export type NamedDecoration = {
    [name: AttrName]: AttrDecoration;
}

/**
 * hook_node_attr({}, 'fn', decoration, context)
 * */
function hook_node_attr(node: LeafNode, attr_name: AttrName, decoration: AttrDecoration, argThis?: ThisArg) {
    if (typeof decoration === 'function') { //a builder
        const final_decoration = decoration.call(argThis || node, node);
        if (!final_decoration) {
            return node;
        }
        decoration = final_decoration;
    }
    if (decoration) {
        node[attr_name] = wrap(node[attr_name], decoration, argThis);
    }
    return node;
}

/**
 * hook_node_path('.', root, 'a', decoration, context)
 * hook_node_path('.', root, 'a.b.c.d.e', decoration, context)
 * */
function hook_node_path(sep: string, node: TreeNode, name: AttrName, decoration: AttrDecoration, argThis?: ThisArg) {
    const str_name = String(name);
    const sep_index = str_name.indexOf(sep);
    if (sep_index === -1) {
        hook_node_attr(node as LeafNode, name, decoration, argThis);
    } else {
        const child_attr_name = str_name.substring(0, sep_index);
        const child_node = node[child_attr_name] || {};
        node[child_attr_name] = hook_node_path(sep, child_node as TreeNode, str_name.substring(sep_index + 1), decoration, argThis);
    }
    return node;
}

/**
 * hook_node_paths('.', root, ['a','b','c.d','methods.a.b.c.d.e'], decoration, context)
 * */
function hook_node_paths(sep: string, root: TreeNode, names: AttrName[], decoration: AttrDecoration, argThis?: ThisArg) {
    for (const name of names) {
        hook_node_path(sep, root, name, decoration, argThis);
    }
    return root;
}

/**
 * hook_named_path('.', root, {
 *  'a':{ before:function(){}, after:function(){}}
 *  'b.c':{ before:function(){}, after:function(){}}
 * }, context)
 * */
function hook_named_path(sep: string, root: TreeNode, named_decoration: NamedDecoration, argThis?: ThisArg) {
    Object.entries(named_decoration)
        .forEach(([name, decoration]) => {
            hook_node_path(sep, root, name, decoration, argThis);
        });
    return root;
}

type InputArgs =
    | [root: TreeNode, name: AttrName | AttrName[], decoration: AttrDecoration, argThis?: ThisArg]
    | [root: TreeNode, name: NamedDecoration, argThis?: ThisArg];

function create(sep = '.') {
    const $ = function (...args: InputArgs) {
        if (Array.isArray(args[1])) {
            return hook_node_paths(sep, args[0], args[1], args[2], args[3]);
        } else if (typeof args[1] === 'string' || typeof args[1] === 'symbol') {
            return hook_node_path(sep, args[0], args[1], args[2], args[3]);
        } else {
            return hook_named_path(sep, args[0], args[1] as NamedDecoration, args[2]);
        }
    }
    Object.defineProperty($, NAME_SYM, {
        value: `sep-[${sep}]`,
        enumerable: true,
        writable: false,
        configurable: false
    })
    return $;
}

const _default = create();

export default _default;

export {
    create
}