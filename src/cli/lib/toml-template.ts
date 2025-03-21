export const logicTomlTemplate = (projectName: string) => {
  return `
[project]
name = "${projectName}"
version = "1.0.0"
description = "A logic project"

[build]
entry="main.lgs"
output = "target"

[target]
byte_order = "little"

[paths]
src_dir="./src"
`;
};
