const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('src');

const replacements = {
  'IconTrash2': 'IconTrash',
  'IconXCircle': 'IconCircleX',
  'IconAlertCircle': 'IconExclamationCircle', 
  'IconCheckCircle': 'IconCircleCheck',
  'IconZap': 'IconBolt',
  'IconMenu2': 'IconMenu',
  'IconMessageSquare': 'IconMessage',
  'IconEdit2': 'IconEdit',
  'IconFileText': 'IconFileText',
  'IconHelpCircle': 'IconHelpCircle',
  'IconDollarSign': 'IconCurrencyDollar',
  'IconRefreshCw': 'IconRefresh',
  'IconKanban': 'IconLayoutKanban',
  'IconUsers2': 'IconUsersGroup',
  'IconPlayCircle': 'IconPlayerPlay',
  'IconGithub': 'IconBrandGithub',
  'IconLink2': 'IconLink'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const [oldIcon, newIcon] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldIcon}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newIcon);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
