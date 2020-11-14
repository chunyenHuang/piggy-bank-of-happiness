const path = require('path');
const fs = require('fs');
const appJsonFilePath = path.join(__dirname, 'app.json');
const appJson = require(appJsonFilePath);

const target = process.argv[2];

const bumpIos = () => {
  appJson.expo.ios.buildNumber = `${parseInt(appJson.expo.ios.buildNumber) + 1}`;
};

const bumpAndroid = () => {
  appJson.expo.android.versionCode = parseInt(appJson.expo.android.versionCode) + 1;
};

if (target === 'ios') {
  bumpIos();
} else
if (target === 'android') {
  bumpAndroid();
} else {
  bumpIos();
  bumpAndroid();
}

fs.writeFileSync(appJsonFilePath, JSON.stringify(appJson, null, 2));
