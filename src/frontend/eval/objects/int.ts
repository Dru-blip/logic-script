import { LogicObject } from "./logic-object.ts";

export class LogicInt extends LogicObject {
  constructor(public value: number) {
    super();
    this.methods.set("add", (other: LogicInt[]) => {
      return new LogicInt(this.value + other[0]!.value);
    });
    this.methods.set("sub", (other: LogicInt[]) => {
      return new LogicInt(this.value - other[0]!.value);
    });
    this.methods.set("mul", (other: LogicInt[]) => {
      return new LogicInt(this.value * other[0]!.value);
    });
    this.methods.set("div", (other: LogicInt[]) => {
      return new LogicInt(this.value / other[0]!.value);
    });
  }
}
