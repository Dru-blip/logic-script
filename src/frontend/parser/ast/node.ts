export enum NodeType {
  Program = "Program",
  ImportStatement = "ImportStatement",
  FunctionDeclaration = "FunctionDeclaration",
  BlockStatement = "BlockStatement",
  VariableDeclaration = "VariableDeclaration",
  ReturnStatement = "ReturnStatement",
  IfStatement = "IfStatement",
  ForStatement = "ForStatement",
  RangeStatement = "RangeStatement",
  BinaryExpression = "BinaryExpression",
  UnaryExpression = "UnaryExpression",
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
  RangeExpression = "RangeExpression",
  ExpressionStatement = "ExpressionStatement",
  BreakStatement="BreakStatement",
  ContinueStatement="ContinueStatement",
  StructDeclaration="StructDeclaration",
  StructMember="StructMember",
  StructProperty="StructProperty",
  MemberAssignment="MemberAssignment",
  ArrayAccess="ArrayAccess",
  StructInitializer="StructInitializer",
}

export interface LogicNode {
  readonly type: NodeType;
}

export interface LogicExpression extends LogicNode {}
