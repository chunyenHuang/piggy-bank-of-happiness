const path = require('path');
const fs = require('fs');
const appJsonFilePath = path.join(__dirname, 'app.json');
const appJson = require(appJsonFilePath);

appJson.expo.ios.buildNumber = `${parseInt(appJson.expo.ios.buildNumber) + 1}`;

fs.writeFileSync(appJsonFilePath, JSON.stringify(appJson, null, 4));

