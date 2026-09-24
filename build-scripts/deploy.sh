#!/bin/bash

# Output colors
CR='\033[0;31m';
CG='\033[0;32m';
CW='\033[0m';
CB='\033[0;36m';

if [ "$1" ]; then
    # Push to main
    git add .;
    git commit -m "$1";

    # Confirm push after commit outputs
    echo -e -n "\n${CB}Complete deploy? (y)${CW} " &&
    read resp;
    echo '';
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
        echo -e "\n${CG}Push successful${CW}\n" &&
        exit 1;
    else
        echo -e "\n${CR}Push failed: Cancelled${CW}\n" &&
        exit 1;
    fi

    echo -e "\n${CR}Push failed: Command failed${CW}\n";
else
    echo -e "\n${CR}Push failed: Missing commit message${CW}\n";
fi;
