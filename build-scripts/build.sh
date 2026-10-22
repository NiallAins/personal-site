#!/usr/bin/env bash

CG='\033[0;32m';
CW='\033[0m';

rm -rf ./dist
cp -r ./public ./dist
echo -e "${CG}> Generated /dist from /public${CW}"

node ./build-scripts/build-thumbnails.js
echo -e "${CG}> Generated thumbnails${CW}"

if [ "$1" == "prod" ]; then
    bash ./build-scripts/build-style.sh
    echo -e "${CG}> Built styles${CW}\n"

    bash ./build-scripts/build-script.sh prod
    echo -e "\n${CG}> Built prod scripts${CW}"

    node ./build-scripts/build-template.js prod
    echo -e "${CG}> Built prod templates${CW}"
else
    bash ./build-scripts/build-style.sh
    echo -e "${CG}> Built styles${CW}\n"

    bash ./build-scripts/build-script.sh
    echo -e "\n${CG}> Built scripts${CW}"

    node ./build-scripts/build-template.js
    echo -e "${CG}> Built templates${CW}"
fi

echo -e "\n${CG}> Build complete${CW}"