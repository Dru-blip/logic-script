import {type LogicNode, NodeType} from "../node.ts";


export class CallExpression implements LogicNode{
    type:NodeType=NodeType.CallExpression;

    constructor(public callee:LogicNode,public args:LogicNode[]) {}
}