import { LogicObject } from "./logic-object.ts";

export class LBool extends LogicObject {
  constructor(public value: true | false) {
    super();
  }

  toString() {
    return `${this.value}`;
  }
}


export const True=new LBool(true)
export const False=new LBool(false)