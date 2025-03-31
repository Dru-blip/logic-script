import { LCallable } from "./callable.ts";
import type { Interpreter } from "../interpreter.ts";

export class BuiltinFunction extends LCallable {
  constructor(
    public id: string,
    public method: (args: any[]) => any,
  ) {
    super();
  }

  call(args: any[]): any {
    return this.method(args);
  }
}
