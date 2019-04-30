const paths = require('../config/paths');
const fs = require('fs-extra');
const { exec } = require('child_process');
copyAssetsFolder();
exec('PRE_PUBLISH=true NODE_ENV=production node_modules/babel-cli/bin/babel.js src --out-dir lib', (err, stdout, stderr) => {
  if (err) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

function copyAssetsFolder() {
    fs.copySync(paths.appAssets, paths.appLibAssets, {
      dereference: true
    });
}