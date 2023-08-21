#!/bin/sh

set -e

CHOKIDAR_VERSION=2.1.8

rm -rf dist chokidar node_modules

mkdir chokidar

npm pack "chokidar@$CHOKIDAR_VERSION"
tar zxvfC chokidar-$CHOKIDAR_VERSION.tgz chokidar --strip 1 package

rm chokidar-$CHOKIDAR_VERSION.tgz

node -e "
    const pkg = require('./package.json');
    pkg.devDependencies = {
        ...require('./chokidar/package.json').dependencies,
        'glob-parent': '^5.1.2',
        'webpack': '^5.53.0',
        'webpack-cli': '^4.8.0'
    };
    pkg.dependencies = {};
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

yarn && yarn bundle

cp chokidar/types/index.d.ts ./types.d.ts