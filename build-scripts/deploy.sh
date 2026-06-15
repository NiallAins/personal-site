#!/bin/bash

git checkout prod &
git reset origin/main --hard &&
git pull origin main &&
npm run build-script-prod &&
git add * &&
git commit -m "Auto-deploy" &&
git push origin prod &&
git checkout main
