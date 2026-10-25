#!/usr/bin/env bash

CB='\033[0;36m';
CW='\033[0m';

echo -e "${CB}> Building styles${CW}"

sass ./styles/index.scss > ./dist/style.css
sass ./styles/app.scss > ./dist/app-style.css

if [ "$1" == "vars" ]; then
    node ./build-scripts/scss-to-ts.js
fi