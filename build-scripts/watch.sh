#!/usr/bin/env bash

CB='\033[0;36m';
CW='\033[0m';
echo -e "\n${CB}> Watching for file changes...${CW}"

concurrently \
    "onchange \"./scripts/**/*.ts\"  -e \"./scripts/consts.scss.ts\" -- bash ./build-scripts/build-script.sh watch"\
    "onchange \"./data/**/*.ts\"                                     -- bash ./build-scripts/build-script.sh watch"\
    "onchange \"./styles/**/*.scss\" -e \"./styles/_vars.scss\"      -- bash ./build-scripts/build-style.sh"\
    "onchange \"./templates/**/*.html\"                              -- node ./build-scripts/build-template.js"\
    "onchange \"./styles/_vars.scss\"                                -- bash ./build-scripts/build-style.sh && bash run ./build-scripts/build-script.sh watch";