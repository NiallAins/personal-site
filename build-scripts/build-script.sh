#!/usr/bin/env bash

if [ "$1" == "prod" ]; then
    node ./build-scripts/log.js "Building production scripts.."
    sed -i -e 's/PROD = false/PROD = true/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode production
elif [ "$1" == "watch" ]; then
    node ./build-scripts/log.js "Building scripts..."
    webpack --config ./build-scripts/webpack.config.js --mode development
else
    node ./build-scripts/log.js "Building scripts..."
    sed -i -e 's/PROD = true/PROD = false/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode development
fi

node ./build-scripts/log.js "Build scripts complete"