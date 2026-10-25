#!/usr/bin/env bash

CB='\033[0;36m';
CW='\033[0m';

if [ "$1" == "prod" ]; then
    echo -e "${CB}> Building production scripts...${CW}"
    sed -i -e 's/PROD = false/PROD = true/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode production
elif [ "$1" == "watch" ]; then
    echo -e "${CB}> Building scripts...${CW}"
    webpack --config ./build-scripts/webpack.config.js --mode development
else 
    echo -e "${CB}> Building scripts...${CW}"
    sed -i -e 's/PROD = true/PROD = false/' ./scripts/_debug.ts
    webpack --config ./build-scripts/webpack.config.js --mode development
fi

echo -e "${CB}> Build scripts complete${CW}"