#!/usr/bin/env bash

# Copy over common util functions
tsc ./scripts/util-common.ts --outDir ./build-scripts --ignoreConfig  
mv --force ./build-scripts/util-common.js ./build-scripts/util.js

# Delete and recreate dist folder with static files
node ./build-scripts/util.js "Generating /dist from /public"
rm -rf ./dist
cp -r ./public ./dist

# Update thumbnails
node ./build-scripts/build-thumbnails.js

# Build site
if [ "$1" == "prod" ]; then
    bash ./build-scripts/build-style.sh vars
    bash ./build-scripts/build-script.sh prod
    node ./build-scripts/build-template.js prod
else
    bash ./build-scripts/build-style.sh vars
    bash ./build-scripts/build-script.sh
    node ./build-scripts/build-template.js
fi

node ./build-scripts/util.js "Build complete" 12 g