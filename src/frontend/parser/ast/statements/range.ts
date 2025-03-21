import { type LogicNode, NodeType } from "../node";

export class RangeStatement implements LogicNode {
  readonly type = NodeType.RangeStatement;
  constructor(
    public start: LogicNode,
    public end: LogicNode,
    public body: LogicNode,
  ) {}
}
