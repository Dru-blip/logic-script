import { LogicObject } from "./logic-object.ts";
import type { Interpreter } from "../interpreter.ts";

export abstract class LCallable extends LogicObject {
  abstract id: string;

  protected constructor() {
    super();
  }

  // abstract call(): any;
}
