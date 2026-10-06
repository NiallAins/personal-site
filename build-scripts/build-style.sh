#!/usr/bin/env bash

node ./build-scripts/scss-to-ts
sass ./styles/index.scss > ./dist/style.css
sass ./styles/app.scss > ./dist/app-style.css
