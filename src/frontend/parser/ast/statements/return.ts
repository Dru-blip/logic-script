import {type LogicNode, NodeType} from "../node.ts";
import type {TokenLocation} from "../../../../types";


export class ReturnStatement implements LogicNode{
    type:NodeType=NodeType.ReturnStatement;
    constructor(public value:LogicNode,public location:TokenLocation) {}
}