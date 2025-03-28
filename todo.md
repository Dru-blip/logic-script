# Todo

---
- ## Parser

- [x] Add `StructDeclaration` AST node
- [x] Update parser to recognize `struct Name { }` syntax
- [x] Support empty struct declarations (`struct Empty {};`)
- [x] Parse struct member variables (`field: Type;`)
- [x] Parse struct methods (`fn method(self) { ... };`)
- [x] Ensure struct members are properly scoped
- [ ] printing better error information
- [x] Implement property access (`instance.field`)
- [x] Support method calls on struct instances (`instance.method();`)
- [x] Ensure nested property access works (`a.b.c`)
- [ ] Handle errors for undefined properties (`instance.unknown_field`)
- [ ] Implement Array index expression
---

## Type checker and Semantic Analysis

- [ ] Define a `SemanticAnalyzer` class
- [ ] Implement a symbol table for scope management
- [ ] Error reporting with meaningful messages


### Variable Declarations & Assignments
- [ ] Ensure declared variables have valid types
- [ ] Prevent redeclaration of variables in the same scope
- [ ] Ensure variables are initialized before use
- [ ] Verify type correctness in assignments (`x: Int = "str";` ❌)
- [ ] Enforce immutable variables if applicable (`const` or similar)


## Function Checking
- [ ] Ensure function declarations have valid parameter and return types
- [ ] Verify function calls match declared parameter types
- [ ] Check for correct return type usage (`fn foo() -> Int { return "str"; }` ❌)
- [ ] Ensure functions return values if required (`fn foo() -> Int { }` ❌)


## Struct Checking
- [ ] Validate struct definitions and field types
- [ ] Ensure struct instances are initialized correctly (`Point { x: 1, y: "str" };` ❌)
- [ ] Verify property access (`instance.field` must exist)
- [ ] Ensure method calls on struct instances are valid (`instance.method();`)
- [ ] Handle nested struct properties (`outer.inner.value`)


## Expression Checking
- [ ] Ensure arithmetic operations are performed on numeric types
- [ ] Type check boolean expressions (`if "string" {}` ❌)
- [ ] Validate function call arguments (`fn add(x: Int, y: Int) {}` → `add(1, "str");` ❌)
- [ ] Ensure comparisons are between compatible types (`1 == "str";` ❌)
- [ ] Validate array indexing (`arr: [Int] = [1, 2]; arr["index"];` ❌)


##  Control Flow & Scope Analysis
- [ ] Ensure variables declared in a block are not accessible outside
- [ ] Validate `if` and `while` conditions are boolean
- [ ] Ensure `return` statements match function return type
- [ ] Prevent usage of undefined variables

---