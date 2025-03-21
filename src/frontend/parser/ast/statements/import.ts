import { type LogicNode, NodeType } from "../node";

export class ImportStatement implements LogicNode {
  readonly type = NodeType.ImportStatement;
  constructor(public path: string) {}
}
