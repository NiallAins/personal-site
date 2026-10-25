#!/usr/bin/env bash

node ./build-scripts/log.js "Watching for file changes..."

concurrently --prefix none \
    "onchange \"./templates/**/*.html\"                              -- node ./build-scripts/build-template.js"\
    "onchange \"./scripts/**/*.ts\" \"./data/**/*.ts\"               -- bash ./build-scripts/build-script.sh watch"\
    "onchange \"./styles/**/*.scss\" -e \"./styles/_vars.scss\"      -- bash ./build-scripts/build-style.sh"\
    "onchange \"./styles/_vars.scss\"                                -- bash ./build-scripts/build-style.sh vars"