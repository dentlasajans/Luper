const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project({
    tsConfigFilePath: 'tsconfig.json'
});

const sourceFiles = project.getSourceFiles();

for (const sourceFile of sourceFiles) {
    if (sourceFile.getFilePath().includes('node_modules')) continue;
    let changed = false;

    // Replace all ': unknown' or 'unknown' types on parameters that are used as objects
    const params = sourceFile.getDescendantsOfKind(SyntaxKind.Parameter);
    for (const param of params) {
        if (param.getTypeNode() && param.getTypeNode().getText() === 'unknown') {
            param.setType('Record<string, unknown>');
            changed = true;
        }
    }

    const varDecls = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
    for (const varDecl of varDecls) {
        if (varDecl.getTypeNode() && varDecl.getTypeNode().getText() === 'unknown') {
            varDecl.setType('Record<string, unknown>');
            changed = true;
        }
    }

    // Fix missing properties again
    const classes = sourceFile.getClasses();
    for (const cls of classes) {
        const methods = cls.getMethods();
        for (const method of methods) {
            const propAccesses = method.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression);
            for (const access of propAccesses) {
                if (access.getExpression().getText() === 'this') {
                    const propName = access.getName();
                    if (!cls.getProperty(propName) && !cls.getMethod(propName) && !cls.getGetAccessor(propName) && !cls.getSetAccessor(propName)) {
                        cls.addProperty({
                            name: propName,
                            type: 'Record<string, unknown>',
                            hasExclamationToken: true,
                        });
                        changed = true;
                    }
                }
            }
        }
    }

    // Fix catch clause 'e' being unknown and accessed
    const propAccesses = sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression);
    for (const access of propAccesses) {
        const expr = access.getExpression();
        // If expr is an identifier and its type is unknown
        if (expr.getKind() === SyntaxKind.Identifier) {
            const type = expr.getType();
            if (type.isUnknown()) {
                expr.replaceWithText(`(${expr.getText()} as Record<string, unknown>)`);
                changed = true;
            }
        }
    }

    if (changed) {
        sourceFile.saveSync();
    }
}
console.log("Done fixing phase 2.");
