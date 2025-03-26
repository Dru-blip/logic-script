import { NodeType, type LogicNode } from "../node";



export class ExpressionStatement implements LogicNode{
    type: NodeType=NodeType.ExpressionStatement
    constructor(public expr:LogicNode){}
}