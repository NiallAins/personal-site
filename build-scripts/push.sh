#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add . &&
    git commit -m "$1";

    # Confirm push after commit outputs
    read -p $'\nComplete push? (y) ' complete;
    if [ "$complete" = "y" ]; then
        git push origin main &&
        echo $'\nPush successful' &&
        exit 1;
    else
        echo $'\nPush failed: Cancelled' &&
        exit 1;
    fi

    echo $'\nPush failed: Command failed';
else
    echo $'Push failed: Missing commit message';
fi