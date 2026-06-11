#!/bin/bash

git add *;
git commit -m "$1";
git push origin main;

if [ $1 == "--deploy" ]; then
    git checkout prod;
    git reset --hard origin/main;
    npm run build-script-prod;
    git add *;
    git commit -m "Pull from main and deploy";
    git push origin prod;
    git checkout main;
fi