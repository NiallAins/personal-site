#!/usr/bin/env bash

CB='\033[0;36m';
CW='\033[0m';
echo -e "\n${CB}> Watching for file changes...${CW}\n"

concurrently --prefix none \
    "onchange \"./templates/**/*.html\"                              -- node ./build-scripts/build-template.js"\
    "onchange \"./scripts/**/*.ts\" \"./data/**/*.ts\"               -- bash ./build-scripts/build-script.sh watch"\
    "onchange \"./styles/**/*.scss\" -e \"./styles/_vars.scss\"      -- bash ./build-scripts/build-style.sh"\
    "onchange \"./styles/_vars.scss\"                                -- bash ./build-scripts/build-style.sh vars"