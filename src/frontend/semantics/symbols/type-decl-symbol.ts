import { LogicType } from "../../type-system";

export class TypeDeclSymbol {
  constructor(
    public name: string,
    public declType: LogicType,
  ) {}
}
