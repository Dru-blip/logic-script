import { type LogicNode, NodeType } from "../node.ts";
import { BlockStatement } from "../statements";
import {Identifier} from "../declarations";

export class ForStatement implements LogicNode {
  type: NodeType = NodeType.ForStatement;

  constructor(
    public target: Identifier,
    public iterable: LogicNode,
    public body: BlockStatement,
  ) {}
}
