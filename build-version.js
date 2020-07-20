const path = require('path');
const fs = require('fs');
const appJsonFilePath = path.join(__dirname, 'app.json');
const appJson = require(appJsonFilePath);

const target = process.argv[2];

if (target === 'ios') {
  appJson.expo.ios.buildNumber = `${parseInt(appJson.expo.ios.buildNumber) + 1}`;
}
if (target === 'android') {
  appJson.expo.android.versionCode = parseInt(appJson.expo.android.versionCode) + 1;
}

fs.writeFileSync(appJsonFilePath, JSON.stringify(appJson, null, 4));
