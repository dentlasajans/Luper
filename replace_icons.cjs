const fs = require('fs');
const path = require('path');

const iconMap = {
"AlertCircle": "WarningCircle",
"AlertTriangle": "Warning",
"ArrowLeft": "ArrowLeft",
"ArrowUpRight": "ArrowUpRight",
"Activity": "Pulse",
"BarChart": "ChartBar",
"Battery": "BatteryFull",
"Bell": "Bell",
"BookOpen": "BookOpen",
"Box": "Package",
"Bug": "Bug",
"Calendar": "Calendar",
"Camera": "Camera",
"Check": "Check",
"CheckCircle2": "CheckCircle",
"ChevronRight": "CaretRight",
"ChevronDown": "CaretDown",
"Cloud": "Cloud",
"CloudOff": "CloudSlash",
"Code": "Code",
"Command": "Command",
"Copy": "Copy",
"Cpu": "Cpu",
"Database": "Database",
"Download": "DownloadSimple",
"Edit": "PencilSimple",
"ExternalLink": "ArrowSquareOut",
"EyeOff": "EyeSlash",
"FileText": "FileText",
"Filter": "Funnel",
"Folder": "Folder",
"Gamepad2": "GameController",
"Gauge": "Gauge",
"Gift": "Gift",
"GitBranch": "GitBranch",
"Globe": "Globe",
"Grid": "GridFour",
"HardDrive": "HardDrives",
"Hash": "Hash",
"Heart": "Heart",
"Image": "Image",
"Info": "Info",
"Keyboard": "Keyboard",
"Layers": "Stack",
"Layout": "Layout",
"Link": "Link",
"List": "List",
"Loader2": "SpinnerGap",
"Lock": "Lock",
"Maximize2": "ArrowsOut",
"MessageSquare": "ChatSquare",
"Minus": "Minus",
"Monitor": "Monitor",
"Mouse": "Mouse",
"Move": "ArrowsOutCardinal",
"Network": "WifiHigh",
"Package": "Package",
"PackageOpen": "Package",
"Palette": "Palette",
"PieChart": "ChartPie",
"Play": "Play",
"Plus": "Plus",
"Power": "Power",
"Puzzle": "PuzzlePiece",
"Radio": "Radio",
"Recycle": "Recycle",
"RefreshCw": "ArrowsClockwise",
"RotateCcw": "ArrowCounterClockwise",
"Save": "FloppyDisk",
"Search": "MagnifyingGlass",
"Send": "PaperPlaneTilt",
"Server": "Desktop",
"Settings": "GearSix",
"Share2": "ShareNetwork",
"ShieldCheck": "ShieldCheck",
"Shuffle": "Shuffle",
"Sliders": "Sliders",
"Sparkles": "Sparkle",
"Square": "Square",
"Star": "Star",
"Sun": "Sun",
"Tag": "Tag",
"Target": "Target",
"TerminalSquare": "Terminal",
"ThumbsUp": "ThumbsUp",
"ToggleLeft": "ToggleLeft",
"Tool": "Wrench",
"Trash2": "Trash",
"TrendingUp": "TrendUp",
"Unlock": "LockOpen",
"Upload": "UploadSimple",
"User": "User",
"Volume2": "SpeakerHigh",
"Wand2": "MagicWand",
"Wifi": "WifiHigh",
"Wrench": "Wrench",
"X": "X",
"Zap": "Lightning"
};

const filesToProcess = [
"src/components/tools/DebloatTools.tsx",
"src/components/tools/GamesTools.tsx",
"src/components/tools/StartupTools.tsx",
"src/components/info/AdvancedSettingsCenterTools.tsx",
"src/components/info/AdvancedUpdateCenterTools.tsx",
"src/components/info/CloudBackupSyncTools.tsx",
"src/components/info/DeveloperModeTools.tsx",
"src/components/info/DiagnosticsRecoveryCenterTools.tsx",
"src/components/info/ExtensionManagerTools.tsx",
"src/components/info/ExtensionSdkTools.tsx",
"src/components/info/FinalUiUxPolishTools.tsx",
"src/components/info/HardwareExplorerTools.tsx",
"src/components/info/HealthRecommendationsTools.tsx",
"src/components/info/MaintenanceCenterTools.tsx",
"src/components/info/MarketplaceTools.tsx",
"src/components/info/OptimizationLibraryTools.tsx",
"src/components/info/OptimizationPacksTools.tsx",
"src/components/info/OptimizationSimulatorTools.tsx",
"src/components/info/RepairExecutionEngineTools.tsx",
"src/components/info/RepairExecutionPreviewTools.tsx",
"src/components/info/SnapshotCenterTools.tsx",
"src/components/info/SystemInsightsActionCenterTools.tsx",
"src/components/info/VisualWorkflowDesignerTools.tsx",
"src/components/info/StableReleaseTools.tsx"
];

const basePath = `c:\\Users\\Dell\\Drive'ım\\DENTLAS AJANS\\FORMLAR\\LUPER`;

filesToProcess.forEach(file => {
    const fullPath = path.join(basePath, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');

        // Extract lucide-react imports
        const importRegex = /import\s*{([^}]+)}\s*from\s*['"]lucide-react['"];?/g;
        let match = importRegex.exec(content);
        if (match) {
            let importedIcons = match[1].split(',').map(i => i.trim()).filter(i => i);
            let importedPhosphorIcons = new Set();
            let changed = false;
            
            // Map icons and replace JSX elements
            importedIcons.forEach(iconName => {
                const mappedIcon = iconMap[iconName] || iconName;
                importedPhosphorIcons.add(mappedIcon);
                
                // Replace opening tags: <IconName -> <MappedIconName weight="duotone"
                // It could be <IconName /> or <IconName className="..." />
                // Regex for opening tag of the icon:
                const tagRegex = new RegExp(`<${iconName}(\\s|>)`, 'g');
                content = content.replace(tagRegex, `<${mappedIcon} weight="duotone"$1`);
            });

            // Replace the import statement
            const newImport = `import { ${Array.from(importedPhosphorIcons).join(', ')} } from '@phosphor-icons/react';`;
            content = content.replace(importRegex, newImport);
            
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Processed: ${file}`);
        } else {
            console.log(`No lucide-react import found in: ${file}`);
        }
    } else {
        console.error(`File not found: ${file}`);
    }
});
