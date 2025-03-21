import { type LogicNode, NodeType } from "./node";

export class Program implements LogicNode {
  readonly type = NodeType.Program;
  constructor(public statements: LogicNode[]) {}
}
