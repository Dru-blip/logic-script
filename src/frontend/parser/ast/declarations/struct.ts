import {type LogicNode, NodeType} from "../node.ts";
import type {Identifier} from "./variable.ts";
import type {LogicType} from "../../../../types";


export class StructMember implements LogicNode {
    type: NodeType = NodeType.StructMember
}

export class StructProperty implements LogicNode{
    type: NodeType = NodeType.StructProperty
    constructor(public name:Identifier,public declType:LogicType) {}
}

export class StructDeclaration implements LogicNode {
    type: NodeType = NodeType.StructDeclaration

    constructor(public name: Identifier, public properties: StructProperty[]) {
    }
}