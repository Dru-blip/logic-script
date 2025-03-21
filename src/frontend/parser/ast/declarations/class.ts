import { FunctionDeclaration } from "./functions";
import { type LogicNode, NodeType } from "../node";
import { VariableDeclaration } from "./variable";

export class ClassDeclaration implements LogicNode {
  readonly type = NodeType.ClassDeclaration;
  constructor(
    public name: string,
    public methods: FunctionDeclaration[],
    public properties: VariableDeclaration[],
  ) {}
}
