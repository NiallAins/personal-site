#!/bin/bash

git commit -am "$2";
git push origin main;

if [ $1 == "deploy" ]; then
    git checkout prod;
    git merge -X theirs main "Auto-deploy from main";
    npm run build-script-prod;
    git commit -ma "Auto-deploy from main";
    git push origin prod;
    git checkout main;
fi