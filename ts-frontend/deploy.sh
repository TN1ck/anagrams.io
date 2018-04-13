#!/bin/bash
set -e

rm -rf dist
npm run build
tar -zcvf dist.tar.gz dist
scp ./dist.tar.gz tom@anagramania.io:/tmp/dist.tar.gz
ssh tom@anagramania.io 'cd /tmp && tar -zxvf dist.tar.gz && rm -rf /opt/apps/anagramania/ts-frontend/dist && mv ./dist /opt/apps/anagramania/ts-frontend/'
