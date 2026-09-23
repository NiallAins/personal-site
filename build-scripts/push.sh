#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    read -p "Complete push? " complete;
    if [ "$complete" == "y" ]; then
        echo $complete;
        echo "Push failed: Canceled";
    else
        git push origin main &&
        echo "Push successful";
    fi
else
    echo "Push failed: Missing commit message";
fi