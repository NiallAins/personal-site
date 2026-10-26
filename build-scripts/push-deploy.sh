#!/usr/bin/env bash

# Push and deploy
if [ "$1" == "prod" ]; then
    if [ "$2" ]; then
        # Deploy to main
        git add .;
        git commit -m "$2";

        # Confirm Deploy after commit outputs
        node ./build-scripts/log.js "Complete deploy? (y) " 10  &&
        read resp;
        if [ "$resp" = "y" ]; then
            node ./build-scripts/log.js "Pushing to main..." 11
            git push origin main &&

            # Copy to prod
            node ./build-scripts/log.js "Resetting prod to main..." 21
            git checkout prod &&
            git reset origin/main --hard &&

            # Build in prod mode
            npm run build-prod;

            # Push to prod
            node ./build-scripts/log.js "Pushing to prod..." 11
            git add *;
            git add -f ./dist/*;
            git commit -m "Auto-deploy";
            git push origin prod -f &&

            # Return to main
            git checkout main &&
            node ./build-scripts/log.js "Deploy successful" 11 g &&
            exit 1;
        else
            node ./build-scripts/log.js "Deploy failed: Cancelled" 11 r &&
            exit 1;
        fi

         node ./build-scripts/log.js "Deploy failed: Command failed" 11 r;
    else
         node ./build-scripts/log.js "Deploy failed: Missing commit message" 11 r;
    fi

# Push only
elif [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    # Confirm push after commit outputs
    node ./build-scripts/log.js "~Complete push? (y) " 10 &&
    read resp;
    if [ "$resp" = "y" ]; then
        node ./build-scripts/log.js "Pushing to main..." 11
        git push origin main &&
        node ./build-scripts/log.js "Push successful" 11 g &&
        exit 1;
    else
        node ./build-scripts/log.js "Push failed: Cancelled" 11 r &&
        exit 1;
    fi

     node ./build-scripts/log.js "Push failed: Command failed" 11 r;
else
     node ./build-scripts/log.js "Push failed: Missing commit message" 11 r;
fi