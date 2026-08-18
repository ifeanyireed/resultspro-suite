# Kill process on port 8080
kill -9 $(lsof -t -i:8080) || echo "Nothing on 8080"

# Install Node/npm
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24

# Verify the Node.js version:
node -v # Should print "v24.14.1".

# Verify npm version:
npm -v # Should print "11.11.0".


  ┌────┬────────────────┬───────┬────────────────────────────┬───────────────────────────────────────────┬──────────┐
  │ #  │ Interaction    │ Value │ Frontend URL (Route)       │ API Endpoint                              │ Verified │
  ├────┼────────────────┼───────┼────────────────────────────┼───────────────────────────────────────────┼──────────┤
  │ 1  │ Topic Unlock   │ -5    │ /practice/study/[topicId]  │ GET /api/study-assistant/topic/:topicId   │ YES      │
  │ 2  │ AI Tutor Chat  │ -2    │ /study-assistant           │ POST /api/study-assistant/chat            │ YES      │
  │ 3  │ AI Topic Ask   │ -2    │ /practice/study/[topicId]  │ POST                                      │ YES      │
  │    │                │       │                            │ /api/study-assistant/topic/:topicId/ask   │          │
  │ 4  │ AI Deep Dive   │ -3    │ /quiz?topicId=...          │ POST /api/quiz/hint                       │ YES      │
  │ 5  │ Battle Stake   │ Var   │ /battle-mode               │ POST /api/battles/create                  │ YES      │
  │ 6  │ Tournament Fee │ Var   │ /battle-mode               │ POST /api/battles/tournament/register/:id │ YES      │
  │ 7  │ Live Game      │ Var   │ /live/[roomId]             │ POST /api/live/join/:roomId               │ YES      │
  │    │ Entry          │       │                            │                                           │          │
  │ 8  │ Shop Purchase  │ +Var  │ /shop/verify?reference=... │ GET /api/payment/verify                   │ YES      │
  │ 9  │ Referral Bonus │ +25   │ /signup                    │ POST /api/auth/signup                     │ YES      │
  │ 10 │ MCQ Reward     │ +1    │ /quiz?topicId=...          │ POST /api/quiz/submit                     │ YES      │
  │ 11 │ Theory Reward  │ +3    │ /quiz?topicId=...          │ POST /api/quiz/submit                     │ YES      │
  │ 12 │ 7-Day Streak   │ +15   │ /quiz?topicId=...          │ POST /api/quiz/submit                     │ YES      │
  └────┴────────────────┴───────┴────────────────────────────┴───────────────────────────────────────────┴──────────┘

https://exams.resultspro.ng/api/test-connectivity

# Start the backend with live reload (using Air)
cd backend && air

# Alternatively, using the full path if air is not in your PATH:
cd backend && $(go env GOPATH)/bin/air

# 1. Stop any old version if it was running manually
pkill air
pkill main
pkill api_server 