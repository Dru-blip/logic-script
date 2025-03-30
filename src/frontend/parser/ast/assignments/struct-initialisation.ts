import { type LogicNode, NodeType } from "../node.ts";
import { Identifier } from "../declarations";

export class StructInitialisation implements LogicNode {
  type: NodeType = NodeType.StructInitializer;

  constructor(
    public name: Identifier,
    public properties: Record<string, LogicNode>,
  ) {}
}
