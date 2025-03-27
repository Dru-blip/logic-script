import {ObjectType, PrimitiveType, SpecialType} from "../../types";
import {Token, TokenType} from "../lexer";
import {Identifier} from "./ast";

export const tokenToType = (tokenType: TokenType, token?: Token) => {
    if (tokenType === TokenType.INT) {
        return PrimitiveType.INT;
    } else if (tokenType === TokenType.STR) {
        return PrimitiveType.STR;
    } else if (tokenType === TokenType.BOOL) {
        return PrimitiveType.BOOLEAN;
    } else if (tokenType === TokenType.ANY) {
        return SpecialType.ANY;
    } else if (tokenType === TokenType.TYRANGE) {
        return ObjectType.Range
    } else if (tokenType === TokenType.IDENTIFIER) {
        return new Identifier(token?.literal!, token?.location!)
    } else {
        return null;
    }
};
