#!/usr/bin/env bash

if [ "$1" == "prod" ]; then
    sed -i -e 's/PROD = false/PROD = true/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode production
elif [ "$1" == "watch" ]; then
    webpack --config ./build-scripts/webpack.config.js --mode development
else 
    sed -i -e 's/PROD = true/PROD = false/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode development
fi