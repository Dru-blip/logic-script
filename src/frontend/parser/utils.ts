import { TokenType } from "../lexer";
import { PrimitiveType } from "./types";

export const tokenToType = (token: TokenType) => {
  if (token === TokenType.INT) {
    return PrimitiveType.INT;
  } else if (token === TokenType.STR) {
    return PrimitiveType.STR;
  } else {
    return PrimitiveType.BOOLEAN;
  }
};
