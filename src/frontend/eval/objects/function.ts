import { LCallable } from "./callable.ts";
import type { Interpreter } from "../interpreter.ts";
import { BlockStatement, type LogicNode } from "../../parser/ast";
import type { FunctionParam } from "../../parser/ast/declarations/functions.ts";
import type { LogicObject } from "./logic-object.ts";

export class LFunction extends LCallable {
  constructor(
    public id: string,
    public params: FunctionParam[],
    public body: BlockStatement,
  ) {
    super();
  }

  call(interpreter: Interpreter, args: LogicObject[]) {
    interpreter.enterScope();
    if (args.length !== this.params.length) {
      throw new Error(
        `Expecting ${this.params.length} parameters got: ${args.length}`,
      );
    }
    for (let i = 0; i < args.length; i++) {
      interpreter.symbols.addSymbol(this.params[i]!.id.name, args[i]!);
    }
    interpreter.visitBlockStatement(this.body);
    interpreter.leaveScope();
  }
}
