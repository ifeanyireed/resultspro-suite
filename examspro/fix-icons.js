const fs = require('fs');
const path = require('path');

const replacements = {
  'IconCheckCircle': 'IconCircleCheck',
  'IconSave': 'IconDeviceFloppy',
  'IconEdit2': 'IconEdit',
  'IconBarChart2': 'IconChartBar',
  'IconSmartphone': 'IconDeviceMobile',
  'IconLayers': 'IconStack',
  'IconMoreVertical': 'IconDotsVertical',
  'IconMousePointer2': 'IconPointer',
  'IconType': 'IconTypography',
  'IconFileUp': 'IconFileUpload',
  'IconRefreshCcw': 'IconRefresh',
  'IconSmile': 'IconMoodSmile',
  'IconArrowRightLeft': 'IconArrowsRightLeft',
  'IconBanknote': 'IconCash',
  'IconBuilding2': 'IconBuilding',
  'IconMaximize2': 'IconMaximize',
  'IconMinimize2': 'IconMinimize',
  'IconBrainCircuit': 'IconBrain'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = content;
    
    for (const [oldIcon, newIcon] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${oldIcon}\\b`, 'g');
      modified = modified.replace(regex, newIcon);
    }
    
    if (modified !== content) {
      fs.writeFileSync(filePath, modified, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
