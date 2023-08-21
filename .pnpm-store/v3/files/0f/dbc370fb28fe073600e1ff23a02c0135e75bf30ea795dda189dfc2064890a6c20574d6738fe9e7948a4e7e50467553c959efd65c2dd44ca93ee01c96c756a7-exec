let tsNode;
try {
  tsNode = require('ts-node');
} catch {
  throw new Error(
    `Cannot resolve ts-node. Make sure ts-node is installed before using typescript-transform-paths/register`
  );
}

tsNode.register();
require('./').register();
