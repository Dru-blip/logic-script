import { type LogicNode, NodeType } from "../node.ts";
import { Token } from "../../../lexer";
import type {TokenLocation} from "../../../../types";

export class RangeExpression implements LogicNode {
  type: NodeType = NodeType.RangeExpression;

  constructor(
    public start: LogicNode,
    public end: LogicNode,
    public op: Token,
    public inclusive: boolean = false,
  ) {}
}
