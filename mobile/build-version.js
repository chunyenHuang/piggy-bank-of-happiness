const path = require('path');
const fs = require('fs');
const appJsonFilePath = path.join(__dirname, 'app.json');
const appJson = require(appJsonFilePath);

const target = process.argv[2];

const bumpAppVersion = () => {
  const [major, minor, patch] = appJson.expo.version.split('.');
  appJson.expo.version = `${major}.${minor}.${parseInt(patch) + 1}`;
};

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
  bumpAppVersion();
}

fs.writeFileSync(appJsonFilePath, JSON.stringify(appJson, null, 2));
