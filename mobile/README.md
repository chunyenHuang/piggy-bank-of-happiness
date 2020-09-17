# Mobile App

## Deployment

| Expo Release Channel | Amplify Env | Github Branch |
| ------------- |:-------------:| -----:|
| default | prd | master |
| develop | develop | develop |

https://docs.expo.io/distribution/release-channels/#publish-with-channels

### Development

Build binary

```bash
npm run build:ios:dev
npm run build:android:dev
```

Upload binary
- App Sore (TestFlight)
- Google Play Store (Beta)

Future publish (w/o upload and store review)

```bash
amplify env checkout develop
npm run publish:dev
```

### Production

Build binary

```bash
npm run build:ios
npm run build:android
```

Upload binary
- App Sore (TestFlight)
- Google Play Store (Beta)

Promote to Production with Store review

Future publish (w/o upload and store review)

```bash
amplify env checkout prd
npm run publish
```

### Rollback

https://docs.expo.io/distribution/advanced-release-channels/#rollback-a-channel-entry