import { parser } from "../parser";

export const compile = async (filePath: string) => {
  const file = Bun.file(filePath);
  if (!file.exists()) throw new Error(`File ${filePath} does not exist`);

  const source = await file.text();
  const par = parser(source, filePath);
  const ast = par.parse();
  console.log(ast.value);
};
