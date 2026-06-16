#!/bin/bash

if [ "$1" ]; then
    git add *;
    git commit -m "$1";
    git push origin main;
fi;

git checkout prod;
git reset origin/main --hard;
npm run build-script-prod;
git add *;
git commit -m "Auto-deploy";
git push origin prod -f;
git checkout main;
