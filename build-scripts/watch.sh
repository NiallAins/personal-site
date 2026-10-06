#!/usr/bin/env bash

concurrently \
    "onchange \"./scripts/**/*.ts\"  -e \"./scripts/consts.scss.ts\" -- bash ./build-scripts/build-script.sh"\
    "onchange \"./styles/**/*.scss\" -e \"./styles/_vars.scss\"      -- bash ./build-scripts/build-style.sh"\
    "onchange \"./templates/**/*.html\"                              -- node ./build-scripts/build-template.js"\
    "onchange \"./styles/_vars.scss\"                                -- bash ./build-scripts/build-style.sh && bash run ./build-scripts/build-script.sh";