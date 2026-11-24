#!/usr/bin/env bash

node ./build-scripts/util.js "Building styles"

sass ./styles/index.scss > ./dist/style.css
sass ./styles/appbar.scss > ./dist/appbar-style.css

if [ "$1" == "vars" ]; then
    node ./build-scripts/scss-to-ts.js
fi