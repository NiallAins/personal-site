#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    read -p $'\nComplete push? (y) ' complete;
    if [ "$complete" = "y" ]; then
        git pushsdf origin main &&
        echo "Push successful" &&
        exit 1;
    else
        echo "Push failed: Canceled";
        exit 1;
    fi

    echo "Push failed: Command failed";
else
    echo "Push failed: Missing commit message";
fi