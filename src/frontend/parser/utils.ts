import { PrimitiveType, SpecialType } from "../../types";
import { TokenType } from "../lexer";

export const tokenToType = (token: TokenType) => {
  if (token === TokenType.INT) {
    return PrimitiveType.INT;
  } else if (token === TokenType.STR) {
    return PrimitiveType.STR;
  } else if (token === TokenType.BOOL) {
    return PrimitiveType.BOOLEAN;
  } else if (token === TokenType.ANY) {
    return SpecialType.ANY;
  } else {
    return null;
  }
};
