#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1" &&
    git push origin main &&

    # Copy to prod
    git checkout prod &&
    git reset origin/main --hard &&

    # Build in prod mode
    npm run build-script-prod &&
    npm run set-base-url "niallains.github.io\/dist\/" &&

    # Push to prod
    git add * &&
    git commit -m "Auto-deploy" &&
    git push origin prod -f &&

    # # Return to main
    git checkout main &&
    echo "Deploy successful";
else
    echo "Deploy failed: Missing commit message";
fi;
