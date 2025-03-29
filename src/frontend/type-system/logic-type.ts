

export enum TypeKind{
    Int,
    Str,
    Bool,
    Any,
    ArrayType,
    ObjectType,

    Identifier,
}

export abstract class LogicType{
    abstract kind:TypeKind
    abstract toString():string
    abstract equals(other:LogicType): boolean
}

