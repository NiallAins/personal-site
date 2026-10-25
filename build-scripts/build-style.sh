#!/usr/bin/env bash

node ./build-scripts/log.js "Building styles"

sass ./styles/index.scss > ./dist/style.css
sass ./styles/app.scss > ./dist/app-style.css

if [ "$1" == "vars" ]; then
    node ./build-scripts/scss-to-ts.js
fi