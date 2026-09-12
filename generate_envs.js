const fs = require('fs');
const path = require('path');

const nextEnvContent = `NEXT_PUBLIC_USERS_API=https://resultspro-service-users.onrender.com
NEXT_PUBLIC_RESULTS_API=https://resultspro-service-resultspro.onrender.com
NEXT_PUBLIC_EXAMS_API=https://resultspro-service-examspro.onrender.com
NEXT_PUBLIC_CLASSROOM_API=https://resultspro-service-classroompro.onrender.com
NEXT_PUBLIC_TUTORS_API=https://resultspro-service-tutorspro.onrender.com
NEXT_PUBLIC_COURSES_API=https://resultspro-service-coursespro.onrender.com
`;

const nextApps = ['examspro', 'admin', 'landing_page', 'classroompro', 'coursespro', 'tutorspro'];

for (const app of nextApps) {
  let content = nextEnvContent;
  if (app === 'examspro') content += "NEXT_PUBLIC_WS_URL=wss://resultspro-service-examspro.onrender.com/ws\n";
  if (app === 'tutorspro') content += "NEXT_PUBLIC_WS_URL=wss://resultspro-service-tutorspro.onrender.com/ws\n";
  
  fs.writeFileSync(path.join(app, '.env.example'), content);
}

const viteEnvContent = `VITE_API_URL=https://resultspro-service-users.onrender.com
`;
fs.writeFileSync(path.join('resultspro', '.env.example'), viteEnvContent);
console.log("Created .env.example files");
