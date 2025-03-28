import {type LogicNode, NodeType} from "../node.ts";


export class ReturnStatement implements LogicNode{
    type:NodeType=NodeType.ReturnStatement;
    constructor(public value:LogicNode) {}
}