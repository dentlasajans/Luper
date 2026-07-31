const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project({
    tsConfigFilePath: 'tsconfig.json'
});

const sourceFiles = project.getSourceFiles();

for (const sourceFile of sourceFiles) {
    if (sourceFile.getFilePath().includes('node_modules')) continue;
    let changed = false;

    // Remove Record<string, unknown> and revert to unknown on parameters and variables
    const params = sourceFile.getDescendantsOfKind(SyntaxKind.Parameter);
    for (const param of params) {
        if (param.getTypeNode() && param.getTypeNode().getText() === 'Record<string, unknown>') {
            param.setType('unknown');
            changed = true;
        }
    }

    const varDecls = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
    for (const varDecl of varDecls) {
        if (varDecl.getTypeNode() && varDecl.getTypeNode().getText() === 'Record<string, unknown>') {
            varDecl.setType('unknown');
            changed = true;
        }
    }

    // Revert class properties
    const classes = sourceFile.getClasses();
    for (const cls of classes) {
        const props = cls.getProperties();
        for (const prop of props) {
            if (prop.getTypeNode() && prop.getTypeNode().getText() === 'Record<string, unknown>') {
                prop.setType('unknown');
                changed = true;
            }
        }
    }

    // Instead of messing with AST for (x as Record<string, unknown>), let's just do a string replace on the file text for as Record<string, unknown> -> as any? No, any is prohibited. Let's do `as { [key: string]: unknown }` or just leave it.

    if (changed) {
        sourceFile.saveSync();
    }
}
console.log("Done reverting.");
