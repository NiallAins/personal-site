#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add .;
    git commit -m "$1";

    # Confirm push after commit outputs
    read -p $'\nComplete deploy? (y) ' resp;
    if [ "$resp" = "y" ]; then
        git push origin main &&

        # Copy to prod
        git checkout prod &&
        git reset origin/main --hard &&

        # Build in prod mode
        npm run build-script-prod &&
        npm run set-base-url "https:\/\/niallains.github.io\/personal-site\/dist\/" &&

        # Push to prod
        git add *;
        git commit -m "Auto-deploy";
        git push origin prod -f &&

        # # Return to main
        git checkout main &&
        echo $'\nDeploy successful' &&
        exit 1;
    else
        echo $'\nDeploy failed: Canceled' &&
        exit 1;
    fi

    echo $'\nDeploy failed: Command failed';
else
    echo $'Deploy failed: Missing commit message';
fi;
