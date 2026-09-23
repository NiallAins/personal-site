#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    echo "";
    read -p "Complete push? (y) " complete;
    if [ "$complete" = "y" ]; then
        git push origin main &&
        echo "Push successful";
        exit 1;
    else
        echo $complete;
        echo "Push failed: Canceled";
    fi

    echo "Push failed: Command failed";
else
    echo "Push failed: Missing commit message";
fi