#!/usr/bin/env bash

if [ "$1" == "prod" ]; then
    node ./build-scripts/log.js "Disabling debug logging"
    sed -i -e 's/PROD = false/PROD = true/' ./scripts/_debug.ts

    node ./build-scripts/log.js "Building production scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode production
elif [ "$1" == "watch" ]; then
    node ./build-scripts/log.js "Building scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode development
else
    node ./build-scripts/log.js "Enabling debug logging"
    sed -i -e 's/PROD = true/PROD = false/' ./scripts/_debug.ts
    
    node ./build-scripts/log.js "Building scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode development
fi

node ./build-scripts/log.js "Build scripts complete"