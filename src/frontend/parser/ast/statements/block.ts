import { type LogicNode, NodeType } from "../node";

export class BlockStatement implements LogicNode {
  readonly type = NodeType.BlockStatement;
  constructor(public statements: LogicNode[]) {}
}
