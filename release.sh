#!/bin/bash

# Performs a relase of a new version of the library. This script will fail
# if the working directory is not clean (in git terms).

# Ensure version is specified in script
if [ -z "$1" ]; then
   echo "You must specify a new version level: [patch, minor, major]";
   exit 1;
fi

# install dependencies and run build
yarn install
yarn build

# bump the version
echo "npm version $1"

# npm version creates a version commit and tag
npm version $1
npm publish
git push
git push --tags

# cleanup
rm -rf docs/ out/
mkdir out

# make the docs
yarn make-docs
VERSION=`ls docs/starling-developer-sdk`
mv docs/starling-developer-sdk/* out/
rm -rf docs/

git checkout gh-pages
mv out/* docs/
echo $VERSION >> _data/versions.csv
git add .
git commit -m "Adding docs for version v$VERSION"
git push
