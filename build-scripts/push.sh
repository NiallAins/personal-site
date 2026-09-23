#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    echo "Complete push?";
    read resp;
    if [ "$resp" == "y" ]; then
        echo $complete;
        echo "Push failed: Canceled";
    else
        git push origin main &&
        echo "Push successful";
    fi
else
    echo "Push failed: Missing commit message";
fi