#!/usr/bin/env bash

# Output colors
CR='\033[0;31m';
CG='\033[0;32m';
CB='\033[0;36m';
CW='\033[0m';

# Push and deploy
if [ "$1" == "--prod"]; then
    if [ "$2" ]; then
        # Deploy to main
        git add .;
        git commit -m "$2";

        # Confirm Deploy after commit outputs
        echo -e -n "\n${CB}Complete deploy? (y)${CW} " &&
        read resp;
        echo '';
        if [ "$resp" = "y" ]; then
            git push origin main &&

            # # Copy to prod
            # git checkout prod &&
            # git reset origin/main --hard &&

            # # Build in prod mode
            # npm run build-prod

            # # Push to prod
            # git add *;
            # git commit -m "Auto-deploy";
            # git push origin prod -f &&

            # # Return to main
            # git checkout main &&
            echo -e "\n${CG}Deploy successful${CW}\n" &&
            exit 1;
        else
            echo -e "\n${CR}Deploy failed: Cancelled${CW}\n" &&
            exit 1;
        fi

        echo -e "\n${CR}Deploy failed: Command failed${CW}\n";
    else
        echo -e "\n${CR}Deploy failed: Missing commit message${CW}\n";
    fi

# Push only
elif [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    # Confirm push after commit outputs
    echo -e -n "\n${CB}Complete push? (y)${CW} " &&
    read resp;
    echo '';
    if [ "$resp" = "y" ]; then
        git push origin main &&
        echo -e "\n${CG}Push successful${CW}\n" &&
        exit 1;
    else
        echo -e "\n${CR}Push failed: Cancelled${CW}\n" &&
        exit 1;
    fi

    echo -e "\n${CR}Push failed: Command failed${CW}\n";
else
    echo -e "\n${CR}Push failed: Missing commit message${CW}\n";
fi