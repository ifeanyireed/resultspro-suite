const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'app', '(app)', 'layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

if (!content.includes('ChatBubbleLeftEllipsisIcon')) {
  content = content.replace(
    /UserGroupIcon,/,
    'UserGroupIcon,\n  ChatBubbleLeftEllipsisIcon,\n  CalendarIcon,\n  DocumentDuplicateIcon,\n  GlobeAltIcon,\n  StarIcon,'
  );
}

const portfolioLink = `              <Link href="/portfolio" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/portfolio') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <GlobeAltIcon className="w-6 h-6" />
                Portfolio
              </Link>`;

const resourcesLink = `              <Link href="/resources" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/resources') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <DocumentDuplicateIcon className="w-6 h-6" />
                Resources
              </Link>`;

const messagesLink = `              <Link href="/messages" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/messages') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                Messages
              </Link>`;

const calendarLink = `              <Link href="/calendar" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/calendar') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <CalendarIcon className="w-6 h-6" />
                Calendar
              </Link>`;

const achievementsLink = `              <Link href="/achievements" className={\`flex items-center gap-3 text-lg px-4 py-2 rounded-xl font-normal relative transition-colors \${isActive('/achievements') ? 'text-[#146ef5] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-[#146ef5] before:rounded-full' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}\`}>
                <StarIcon className="w-6 h-6" />
                Achievements
              </Link>`;

if (!content.includes('/portfolio')) {
  content = content.replace(
    /Workspace\n\s*<\/Link>/,
    "Workspace\n              </Link>\n\n" + portfolioLink + "\n" + resourcesLink
  );
}

if (!content.includes('/messages')) {
  content = content.replace(
    /Peers\n\s*<\/Link>/,
    "Peers\n              </Link>\n\n" + messagesLink + "\n" + calendarLink
  );
}

if (!content.includes('/achievements')) {
  content = content.replace(
    /Leaderboard\n\s*<\/Link>/,
    "Leaderboard\n              </Link>\n\n" + achievementsLink
  );
}

fs.writeFileSync(layoutPath, content);
console.log("Sidebar updated.");
