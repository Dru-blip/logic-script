import {type LogicNode, NodeType} from "../node.ts";


export class MemberAssignment implements LogicNode{
    type:NodeType=NodeType.MemberAssignment
    constructor(public property:LogicNode,public value:LogicNode ) {
    }
}