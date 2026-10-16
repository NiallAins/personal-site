#!/usr/bin/env bash

rm -r ./dist
cp -r ./public ./dist
node ./build-scripts/build-thumbnails.js

if [ "$1" == "prod" ]; then
    bash ./build-scripts/build-style.sh
    bash ./build-scripts/build-script.sh prod
    node ./build-scripts/build-template.js prod
else
    bash ./build-scripts/build-style.sh
    bash ./build-scripts/build-script.sh
    node ./build-scripts/build-template.js
fi