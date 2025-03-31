import { LogicObject } from "./logic-object.ts";
import { False, True } from "./bool.ts";

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
    this.methods.set("eq", (other: LogicInt[]) => {
      return this.value === other[0]!.value ? True : False;
    });
    this.methods.set("neq", (other: LogicInt[]) => {
      return this.value !== other[0]!.value ? True : False;
    });

    this.methods.set("gt", (other: LogicInt[]) => {
      return this.value > other[0]!.value ? True : False;
    });
    this.methods.set("lt", (other: LogicInt[]) => {
      return this.value < other[0]!.value ? True : False;
    });
    this.methods.set("gte", (other: LogicInt[]) => {
      return this.value >= other[0]!.value ? True : False;
    });
    this.methods.set("lte", (other: LogicInt[]) => {
      return this.value <= other[0]!.value ? True : False;
    });
  }

  toString() {
    return `${this.value}`;
  }
}
