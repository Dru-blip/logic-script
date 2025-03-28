export enum NodeType {
  Program = "Program",
  ImportStatement = "ImportStatement",
  ClassDeclaration = "ClassDeclaration",
  FunctionDeclaration = "FunctionDeclaration",
  BlockStatement = "BlockStatement",
  VariableDeclaration = "VariableDeclaration",
  ReturnStatement = "ReturnStatement",
  IfStatement = "IfStatement",
  ForStatement = "ForStatement",
  RangeStatement = "RangeStatement",
  BinaryExpression = "BinaryExpression",
  UnaryExpression = "UnaryExpression",
  LogicalExpression = "LogicalExpression",
  CallExpression = "CallExpression",
  MemberExpression = "MemberExpression",
  AssignmentExpression = "AssignmentExpression",
  GroupingExpression = "GroupingExpression",
  Identifier = "Identifier",
  Literal = "Literal",
  NumberLiteral = "NumberLiteral",
  StringLiteral = "StringLiteral",
  BooleanLiteral = "BooleanLiteral",
  ArrayLiteral = "ArrayLiteral",
  ObjectLiteral = "ObjectLiteral",
  RangeExpression = "RangeExpression",
  ExpressionStatement = "ExpressionStatement",
  BreakStatement="BreakStatement",
  ContinueStatement="ContinueStatement",
  StructDeclaration="StructDeclaration",
  StructMember="StructMember",
  StructProperty="StructProperty",
  MemberAssignment="MemberAssignment",
}

export interface LogicNode {
  readonly type: NodeType;
}

export interface LogicExpression extends LogicNode {}
