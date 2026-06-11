#!/bin/bash

git add *;
git commit -m "$2";
git push origin main;

if [ $1 == "deploy" ]; then
    git merge -s ours prod;
    git checkout prod;
    git merge --ff-only main;
    npm run build-script-prod;
    git add *;
    git commit -m "$2 - Pull from main and deploy";
    git push origin prod;
    git checkout main;
fi