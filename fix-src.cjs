const { Project, SyntaxKind } = require('ts-morph');

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

for (const sourceFile of project.getSourceFiles()) {
    if (!sourceFile.getFilePath().includes('/src/')) continue;
    let changed = false;

    // Remove `: unknown` from parameters
    for (const param of sourceFile.getDescendantsOfKind(SyntaxKind.Parameter)) {
        if (param.getTypeNode() && param.getTypeNode().getText() === 'unknown') {
            param.removeType();
            changed = true;
        }
    }

    // Remove `: unknown` from variable declarations
    for (const varDecl of sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration)) {
        if (varDecl.getTypeNode() && varDecl.getTypeNode().getText() === 'unknown') {
            varDecl.removeType();
            changed = true;
        }
    }

    if (changed) sourceFile.saveSync();
}
console.log("Restored src/");
