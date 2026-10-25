#!/usr/bin/env bash

CG='\033[0;32m';
CB='\033[0;36m';
CW='\033[0m';

echo -e "${CB}> Generating /dist from /public${CW}"
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

echo -e "${CG}> Build complete${CW}"