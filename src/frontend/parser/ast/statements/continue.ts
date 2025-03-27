import {type LogicNode, NodeType} from "../node.ts";


export class ContinueStatement implements  LogicNode{
    type:NodeType=NodeType.ContinueStatement;
    constructor() {}
}