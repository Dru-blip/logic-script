import { LogicObject } from "./logic-object.ts";

export class LArray extends LogicObject {
  constructor(public elements: LogicObject[]) {
    super();

    this.properties.set("size", this.elements.length);
    this.methods.set("get", (args) => {
      return this.elements.at(args[0]);
    });
  }

  toString() {
    return `[${this.elements}]`;
  }
}
