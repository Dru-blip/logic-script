import {type LogicNode, NodeType} from "../node.ts";
import {Identifier} from "../declarations";


export class MemberExpression implements  LogicNode{
    type:NodeType=NodeType.MemberExpression
    constructor(public object:LogicNode,public member:Identifier) {}
}