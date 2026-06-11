#!/bin/bash

git add *;
git commit -m "$2";
git push origin main;

if [ $1 == "deploy" ]; then
    git checkout prod;
    git reset --hard origin/main;
<<<<<<< HEAD
    git pull origin prod;
=======
    git pull origin main;
>>>>>>> 7ea34e8ec58814cdcbb0de6a8fb52cd0ed03f682
    npm run build-script-prod;
    git add *;
    git commit -m "Pull from main and deploy, $2";
    git push origin prod;
    git checkout main;
fi

read -p "Press any key to continue" x