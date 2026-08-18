//Always preview @skills.md and @required-auth_service_fields.md when troubleshooting auth related services.

//Prisma 
npm install prisma@5 --save-dev
npx prisma init

//launch prisma studio
cd /var/www/auth_resultspro
npx prisma studio --port 5555
//keep ssh terminal open and run these commands in another terminal
ssh -L 5555:localhost:5555 root@167.99.15.196
//then visit this site in another browser http://localhost:5555/

//kill port 5555
fuser -k 5555/tcp

// Build the application
cd /var/www/auth_resultspro
go build -o auth-binary main.go

//seed the database
sqlite3 /var/lib/auth_resultspro/data/auth.db < seed_central_auth.sql

//update the schema
cd /var/www/auth_resultspro
npx prisma generate

//sync the schema with the database
npx prisma db push
nano /var/www/auth_resultspro/prisma/schema.prisma

//make sure the url is this
datasource db {
  provider = "sqlite"
  url      = "file:///var/lib/auth_resultspro/data/auth.db"
}

//copy file to the droplet
scp .env root@167.99.15.196:/var/dev/ClassroomPRO/backend/
scp -r root@167.99.15.196:/var/www/classnotes ~/Downloads/

//users
┌────────────┬─────────────────────────────┬────────────┐
│ Role       │ Email                       │ Password   │
├────────────┼─────────────────────────────┼────────────┤
│ Superadmin │ superadmin@resultspro.ng    │ admin123   │
│ Teacher    │ teacher@example.edu         │ teacher123 │
│ Student    │ student@example.com         │ student123 │
│ Parent     │ parent@example.com          │ parent123  │
│ School Admin│ school-admin@example.edu    │ admin123 │
│ Support Staff│ support-staff@resultspro.ng │ admin123 │
│ Platform Admin│ platform-admin@resultspro.ng│ admin123  │
└────────────┴─────────────────────────────┴────────────┘

//DELETE a user from the database
sqlite3 /var/lib/auth_resultspro/data/auth.db << 'EOF'
DELETE FROM verification_tokens WHERE user_id IN (SELECT id FROM users WHERE email IN ('ifeanyireed@gmail.com', '10myttofficial@gmail.com'));
DELETE FROM refresh_tokens WHERE user_id IN (SELECT id FROM users WHERE email IN ('ifeanyireed@gmail.com', '10myttofficial@gmail.com'));
DELETE FROM users WHERE email IN ('ifeanyireed@gmail.com', '10myttofficial@gmail.com');
SELECT 'Cleanup complete: Users and associated tokens removed.' as status;
EOF

//Migrating to droplet
mkdir -p /var/dev
cd /var/dev
git clone git@github.com:ifeanyireed/ClassroomPRO.git

cd /var/dev/ClassroomPRO
cd frontend
npm install
npm run dev

cd /var/dev/ClassroomPRO/frontend
pm2 start npm --name classroom-frontend -- run dev -- --hostname 0.0.0.0

cd /var/dev/ClassroomPRO/backend
pm2 start air --name classroom-backend
pm2 save

npm install -g @google/gemini-cli
gemini

npx @google/gemini-cli

//Allow port in firewall:
sudo ufw allow 3000

//Make Next.js listen on all interfaces:
pm2 stop classroom-frontend
rm -rf .next/dev/lock
npm run dev -- --hostname 0.0.0.0