import { SymbolTable } from "../symbols/symbol-table.ts";
import { AstAnalyzer } from "../ast-analyzer.ts";
import {
  BinaryExpression,
  BlockStatement,
  Identifier,
  type LogicLiteral,
  type LogicNode,
  NodeType,
  Program,
  VariableDeclaration,
} from "../../parser/ast";
import { type TypeDeclSymbol } from "../symbols/type-decl-symbol.ts";
import { type ExpressionStatement } from "../../parser/ast/statements/expression.ts";
import type { TypeCheckerResult } from "./types.ts";
import { LgSemanticError } from "../../errors/semantics.ts";
import { type RangeExpression } from "../../parser/ast/expressions/range.ts";
import { LgErrorCode } from "../../errors";
import { type AssignmentExpression } from "../../parser/ast/assignments/variable-assignment.ts";
import { type ArrayLiteral } from "../../parser/ast/literal.ts";
import { Int } from "../../type-system/int.ts";
import { LArrayType, LogicType } from "../../type-system";
import { Bool } from "../../type-system/bool.ts";
import { Str } from "../../type-system/str.ts";
import { Any } from "../../type-system/any-type.ts";
import { ArrayAccess } from "../../parser/ast/expressions/array-access.ts";
import { type IfStatement } from "../../parser/ast/control-flow/if.ts";
import { TypeKind } from "../../type-system/logic-type.ts";
import { ReturnStatement } from "../../parser/ast/statements/return.ts";
import { Void } from "../../type-system/void.ts";
import type { ForStatement } from "../../parser/ast/control-flow/for.ts";

export class TypeChecker extends AstAnalyzer<TypeCheckerResult> {
  symbols: SymbolTable<TypeDeclSymbol>;

  typeRules: Map<string, LogicType> = new Map([
    ["Int+Int", Int],
    ["Int-Int", Int],
    ["Int*Int", Int],
    ["Int/Int", Int],
    ["Int%Int", Int],
    ["Int<Int", Bool],
    ["Int>Int", Bool],
    ["Int<=Int", Bool],
    ["Int>=Int", Bool],
    ["Int!=Int", Bool],
    ["Int==Int", Bool],
    ["Str+Str", Str],
    ["Bool!=Bool", Bool],
    ["Bool==Bool", Bool],
    ["BoolandBool", Bool],
    ["BoolorBool", Bool],
  ]);

  constructor(public fileName: string) {
    super();
    this.symbols = new SymbolTable();
  }

  check(ast: LogicNode) {
    // console.log(this.symbols.getSymbols())
    return this.visit(ast);
  }

  enterScope(): void {
    const parent = this.symbols;
    this.symbols = new SymbolTable(parent);
  }

  leaveScope(): void {
    this.symbols = this.symbols.parent!;
  }

  visit(ast: LogicNode): TypeCheckerResult {
    switch (ast.type) {
      case NodeType.Program: {
        return this.visitProgram(<Program>ast);
      }
      case NodeType.ForStatement: {
        return this.visitForStatement(<ForStatement>ast);
      }
      case NodeType.IfStatement: {
        return this.visitIfStatement(<IfStatement>ast);
      }

      case NodeType.ReturnStatement: {
        return this.visit((<ReturnStatement>ast).value);
      }
      case NodeType.BlockStatement: {
        this.enterScope();
        const res = this.visitBlockStatement(<BlockStatement>ast);
        this.leaveScope();
        return res;
      }
      case NodeType.VariableDeclaration: {
        return this.visitVariableDeclaration(<VariableDeclaration>ast);
      }
      case NodeType.ExpressionStatement: {
        return this.visit((<ExpressionStatement>ast).expr);
      }
      case NodeType.AssignmentExpression: {
        return this.visitAssignmentExpression(<AssignmentExpression>ast);
      }
      case NodeType.RangeExpression: {
        return this.visitRangeExpression(<RangeExpression>ast);
      }
      case NodeType.BinaryExpression: {
        return this.visitBinaryExpression(<BinaryExpression>ast);
      }
      case NodeType.ArrayLiteral: {
        return this.visitArrayLiteral(<ArrayLiteral>ast);
      }
      case NodeType.ArrayAccess: {
        return this.visitArrayAccess(<ArrayAccess>ast);
      }
      case NodeType.Literal: {
        return this.visitLiteral(
          <LogicLiteral<number | string | boolean, LogicType>>ast,
        );
      }
      case NodeType.Identifier: {
        return this.visitIdentifier(<Identifier>ast);
      }
      default: {
        return {
          isOk: false,
          value: Any,
        };
      }
    }
  }

  visitProgram(node: Program): TypeCheckerResult {
    let result: TypeCheckerResult;
    for (const statement of node.statements) {
      const res = this.visit(statement);
      if (!res.isOk) {
        return res;
      }
      result = res;
    }
    return result!;
  }

  visitForStatement(node: ForStatement): TypeCheckerResult {
    this.enterScope();

    console.log(node.target);
    console.log(node.iterable);
    this.leaveScope();

    return {
      isOk: true,
      value: Void,
    };
  }

  visitIfStatement(node: IfStatement): TypeCheckerResult {
    const conditionType = this.visit(node.condition);
    if (!conditionType.isOk) {
      return conditionType;
    }

    // console.log(conditionType);
    if (conditionType.value?.kind !== TypeKind.Bool) {
      return LgSemanticError.typeMismatch(
        this.fileName,
        node,
        node.location,
        "condition requires a Bool",
        `${conditionType.value!.toString()}`,
      );
    }

    this.enterScope();
    const thenBlockType = this.visitBlockStatement(node.then);
    this.leaveScope();

    if (!thenBlockType.isOk) {
      return thenBlockType;
    }

    if (!node.or) {
      return thenBlockType;
    }

    this.enterScope();
    const elseBlockType = this.visitBlockStatement(node.or);
    this.leaveScope();

    if (!elseBlockType.isOk) {
      return thenBlockType;
    }

    if (!thenBlockType.value?.equals(elseBlockType.value!)) {
      return LgSemanticError.typeMismatch(
        this.fileName,
        node,
        node.location,
        `required return type : ${thenBlockType.value?.toString()}`,
        `${elseBlockType.value?.toString()}`,
      );
    }

    return thenBlockType;
  }

  visitBlockStatement(node: BlockStatement): TypeCheckerResult {
    let result: TypeCheckerResult = {
      isOk: true,
      value: Void,
    };
    for (const statement of node.statements) {
      const res = this.visit(statement);
      if (!res.isOk) {
        return res;
      }
      if (statement instanceof ReturnStatement) {
        return res;
      }
      result = res;
    }
    return result!;
  }

  visitVariableDeclaration(node: VariableDeclaration): TypeCheckerResult {
    const id = node.name.name;
    const declType = node.declType;
    const initType = this.visit(node.initializer!);

    if (!initType.isOk) {
      return initType;
    }

    if (!declType.equals(initType.value!)) {
      return LgSemanticError.typeMismatch(
        this.fileName,
        node,
        node.name.location,
        declType.toString(),
        initType.value!.toString(),
      );
    }

    this.symbols.addSymbol(id, { name: id, declType: declType });

    return {
      isOk: true,
      value: declType,
    };
  }

  visitAssignmentExpression(node: AssignmentExpression): TypeCheckerResult {
    const ident = this.visit(node.target);
    if (!ident.isOk) {
      return ident;
    }

    const value = this.visit(node.value);
    if (!value.isOk) {
      return value;
    }

    if (node.target instanceof ArrayAccess) {
      const arrayType = <LArrayType>ident.value;
      const elementType = arrayType.of;

      if (!elementType.equals(value.value!)) {
        return LgSemanticError.typeMismatch(
          this.fileName,
          node,
          node.location,
          elementType.toString(),
          value.value!.toString(),
        );
      }
      return {
        isOk: true,
        value: elementType,
      };
    }

    if (!ident.value?.equals(value.value!)) {
      return LgSemanticError.typeMismatch(
        this.fileName,
        node,
        node.location,
        ident.value!.toString(),
        value.value!.toString(),
      );
    }

    return {
      isOk: true,
      value: value.value,
    };
  }

  visitRangeExpression(node: RangeExpression): TypeCheckerResult {
    const lht = this.visit(node.start);
    if (!lht.isOk) {
      return lht;
    }
    const rht = this.visit(node.end);
    if (!rht.isOk) {
      return rht;
    }

    if (lht.value === Int && !lht.value.equals(rht.value!)) {
      return {
        isOk: false,
        error: new LgSemanticError(
          this.fileName,
          node.op.location,
          "Range expression requires both operands to be Int",
          LgErrorCode.INVALID_OPERATION,
          lht.value?.toString(),
          rht.value?.toString(),
        ),
      };
    }

    return {
      isOk: true,
      value: lht.value,
    };
  }

  visitBinaryExpression(node: BinaryExpression): TypeCheckerResult {
    const lht = this.visit(node.left);
    if (!lht.isOk) {
      return lht;
    }
    const rht = this.visit(node.right);
    if (!rht.isOk) {
      return rht;
    }

    const op = node.operator.literal;
    if (!lht.value?.equals(rht.value!)) {
      return LgSemanticError.invalidBinOp(
        this.fileName,
        node,
        lht.value!,
        rht.value!,
      );
    }

    const key = lht.value?.toString() + op + rht.value?.toString();
    const typeRule = this.typeRules.get(key);
    if (!typeRule) {
      return LgSemanticError.invalidOperation(
        this.fileName,
        node.operator,
        lht.value!,
        rht.value!,
      );
    }

    return {
      isOk: true,
      value: this.typeRules.get(key),
    };
  }

  visitArrayAccess(node: ArrayAccess): TypeCheckerResult {
    const array = this.visit(node.array);
    if (!array.isOk) {
      return array;
    }
    const index = this.visit(node.index);
    if (!index.isOk) {
      return index;
    }

    if (index.value !== Int) {
      return {
        isOk: false,
        error: new LgSemanticError(
          this.fileName,
          node.location,
          `array index should be an Int,got ${index.value?.toString()}`,
          LgErrorCode.TYPE_MISMATCH,
        ),
      };
    }

    return {
      isOk: true,
      value: array.value!,
    };
  }

  visitIdentifier(node: Identifier): TypeCheckerResult {
    const variable = this.symbols.getSymbol(node.name);
    if (!variable) {
      return LgSemanticError.undefinedVariable(this.fileName, node);
    }

    return {
      isOk: true,
      value: variable.declType,
    };
  }

  visitArrayLiteral(node: ArrayLiteral): TypeCheckerResult {
    let ty: LogicType | undefined;
    for (const val of node.values) {
      const valType = this.visit(val);
      if (!valType.isOk) {
        return valType;
      }

      if (ty && !ty.equals(valType.value!)) {
        return {
          isOk: false,
          error: new LgSemanticError(
            this.fileName,
            node.location,
            "Inconsistent types inside array",
            LgErrorCode.TYPE_MISMATCH,
            `[${ty.toString()}]`,
            `[${ty.toString()}|${typeof valType.value}]`,
          ),
        };
      }

      if (!ty) {
        ty = valType.value;
      }
    }
    return {
      isOk: true,
      value: new LArrayType(ty!),
    };
  }

  visitLiteral(
    node: LogicLiteral<number | string | boolean, LogicType>,
  ): TypeCheckerResult {
    return {
      isOk: true,
      value: node.declType,
    };
  }
}
