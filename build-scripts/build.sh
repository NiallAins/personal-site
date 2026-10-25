#!/usr/bin/env bash

node ./build-scripts/log.js "Generating /dist from /public"
rm -rf ./dist
cp -r ./public ./dist

node ./build-scripts/build-thumbnails.js

if [ "$1" == "prod" ]; then
    bash ./build-scripts/build-style.sh vars
    bash ./build-scripts/build-script.sh prod
    node ./build-scripts/build-template.js prod
else
    bash ./build-scripts/build-style.sh vars
    bash ./build-scripts/build-script.sh
    node ./build-scripts/build-template.js
fi

node ./build-scripts/log.js "Build complete~" g