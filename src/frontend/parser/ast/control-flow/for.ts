import { type LogicNode, NodeType } from "../node.ts";
import { BlockStatement } from "../statements";

export class ForStatement implements LogicNode {
  type: NodeType = NodeType.ForStatement;

  constructor(
    public target: LogicNode,
    public iterable: LogicNode,
    public body: BlockStatement,
  ) {}
}
