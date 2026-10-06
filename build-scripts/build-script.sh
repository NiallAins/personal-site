#!/usr/bin/env bash

if [ "$1" == '--prod' ]; then
    bash ./build-scripts/set-base-url.sh "https:\/\/niallains.github.io\/personal-site\/dist\/"
    sed -i -e 's/PROD = false/PROD = true/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode production
else
    webpack --config ./build-scripts/webpack.config.js --mode development
fi