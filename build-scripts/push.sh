#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    read -p "Complete push? " complete;
    if [ "$complete" = "y" ]; then
        git push origin main &&
        echo "Push successful";
    else
        echo $complete;
        echo "Push failed: Canceled";
    fi
else
    echo "Push failed: Missing commit message";
fi