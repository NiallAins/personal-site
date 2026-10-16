#!/usr/bin/env bash

mkdir -p ./dist
node ./build-scripts/scss-to-ts.js
sass ./styles/index.scss > ./dist/style.css
sass ./styles/app.scss > ./dist/app-style.css
