import {type LogicNode, NodeType} from "../node.ts";


export class ArrayAccess implements LogicNode{
    type:NodeType=NodeType.ArrayAccess
    constructor(public array:LogicNode,public index:LogicNode) {}
}