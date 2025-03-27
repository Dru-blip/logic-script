import {type LogicNode, NodeType} from "../node.ts";


export class RangeExpression implements LogicNode {
    type: NodeType = NodeType.RangeExpression

    constructor(public start: LogicNode, public end: LogicNode, public inclusive: boolean = false) {
    }
}