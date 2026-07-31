import fs from 'fs';
import path from 'path';

const dirs = ['core', 'ipc', 'native', 'services'];
const baseDir = 'C:/Luper/electron';

// Map of filename (without .ts) to its new directory
const fileMap = {};

for (const dir of dirs) {
    const dirPath = path.join(baseDir, dir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            if (file.endsWith('.ts')) {
                fileMap[file.replace('.ts', '')] = dir;
            }
        }
    }
}

for (const dir of dirs) {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        if (!file.endsWith('.ts')) continue;
        
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Regex to find all relative imports: from './something.js' or import('./something.js')
        const importRegex = /(from\s+['"]|import\(['"])(\.\/[^'"]+)(\.js['"])/g;
        
        let modified = false;
        const newContent = content.replace(importRegex, (match, prefix, importPath, suffix) => {
            const importedName = importPath.replace('./', '');
            const targetDir = fileMap[importedName];
            if (targetDir) {
                // If it's in the same directory, it's still './something'
                // If it's in a different directory, it's '../targetDir/something'
                if (targetDir === dir) {
                    return `${prefix}./${importedName}${suffix}`;
                } else {
                    modified = true;
                    return `${prefix}../${targetDir}/${importedName}${suffix}`;
                }
            }
            return match;
        });
        
        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf-8');
            console.log(`Updated ${dir}/${file}`);
        }
    }
}
