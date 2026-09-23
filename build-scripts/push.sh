#!/bin/bash

if [ "$1" ]; then
    # Push to main
    git add * &&
    git commit -m "$1" &&
    git push origin main &&

    echo "Push successful";
else
    echo "Push failed: Missing commit message";
fi;