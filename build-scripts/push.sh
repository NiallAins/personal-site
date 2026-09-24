#!/bin/bash

# Output colors
CR='\033[0;31m';
CG='\033[0;32m';
CB='\033[0;36m';
CW='\033[0m';

output() {
    local C=${2:CW};
    echo -e -n "\n${C}$1${CW} ";

    if [ "$3" != "n" ]; then
        echo '';
    fi
}

output test CR


if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    # Confirm push after commit outputs
    output "Complete push? (y)" CB n &&
    read resp;
    output "";
    exit 1;
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