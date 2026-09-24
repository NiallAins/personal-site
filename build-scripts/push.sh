#!/bin/bash

# Output colors
CR='\033[0;31m';
CG='\033[0;32m';
CB='\033[0;36m';
CW='\033[0m';

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    # Confirm push after commit outputs
    echo -e -n "\n${CB}Complete push? (y)${CW} " &&
    read complete;
    if [ "$complete" = "y" ]; then
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