#!/usr/bin/env bash

if [ "$1" == "prod" ]; then
    node ./build-scripts/util.js "Disabling debug logging"
    sed -i -e 's/PROD = false/PROD = true/' ./scripts/_debug.ts

    node ./build-scripts/util.js "Building production scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode production
    rm ./dist/script.js.LICENSE.txt;
elif [ "$1" == "watch" ]; then
    node ./build-scripts/util.js "Building scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode development
else
    node ./build-scripts/util.js "Enabling debug logging"
    sed -i -e 's/PROD = true/PROD = false/' ./scripts/_debug.ts
    
    node ./build-scripts/util.js "Building scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode development
fi

node ./build-scripts/util.js "complete" 00