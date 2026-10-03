#!/usr/bin/env bash

sed -i -e "s/<base href=\"[^\"]*/<base href=\"$1/" ./dist/index.html;
sed -i -e "s/<base href=\"[^\"]*/<base href=\"$1/" ./dist/app.html;