#!/bin/bash

git checkout prod;
git merge -X theirs main -m "Auto-deploy from main";
npm run build-script-prod;
git commit -am "Auto-deploy from main";
git push origin prod;
git checkout main;