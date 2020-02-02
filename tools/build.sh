#!/bin/bash
set -e

npm install --only=dev
npm run build
npm prune --production
