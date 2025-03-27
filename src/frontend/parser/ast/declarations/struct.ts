import {type LogicNode, NodeType} from "../node.ts";
import type {Identifier} from "./variable.ts";


export class StructDeclaration implements LogicNode{
    type:NodeType=NodeType.StructDeclaration
    constructor(public name:Identifier,public body:LogicNode) {}
}