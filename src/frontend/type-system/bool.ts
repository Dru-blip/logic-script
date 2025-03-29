import { LogicType, TypeKind } from "./logic-type.ts";

export class LBool extends LogicType {
    kind: TypeKind = TypeKind.Bool;

    equals(other: LogicType): boolean {
        return other instanceof LBool;
    }

    toString(): string {
        return "Bool";
    }
}

export const Bool=new LBool;