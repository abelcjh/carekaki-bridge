# ReliefKaki mobile judging preview

This Expo Go preview wraps the live ReliefKaki deployment in a native mobile shell.

## Judge instructions

1. Install **Expo Go** on the phone.
2. Scan `reliefkaki-judging-qr.png`:
   - **iPhone/iPad:** use the Camera app.
   - **Android:** use **Scan QR code** inside Expo Go.
3. Allow Expo Go to open the ReliefKaki project.

The project uses **Expo SDK 54**, the Expo Go-compatible runtime used for this judging release. If Android reports a version mismatch, install the SDK 54-compatible Expo Go build from <https://expo.dev/go>.

## Permanent judging channel

- Expo project: <https://expo.dev/accounts/abelchinjh/projects/reliefkaki-judging>
- Update channel: `judging`
- Runtime: `exposdk:54.0.0`
- Project ID: `640b1e39-9017-489b-9397-15d9f1296931`
- Deep link: `exp://u.expo.dev/640b1e39-9017-489b-9397-15d9f1296931?runtime-version=exposdk%3A54.0.0&channel-name=judging`
- Live web content: <https://abelcjh.github.io/reliefkaki/>

The QR is channel-based, so it does not change when another compatible update is published to `judging`. The native shell also loads the live web deployment, so ordinary web releases appear without republishing the Expo update.

## Publish a compatible shell update

From `mobile/`:

```bash
npx eas-cli@latest update \
  --channel judging \
  --message "Describe the judging update" \
  --platform all
```

Keep `runtimeVersion` unchanged for JavaScript-only changes that use the same native dependencies. A native dependency or Expo SDK change requires a new runtime and therefore a new QR.

## Verification

Before sharing the QR:

```bash
npm run typecheck
npx expo-doctor
npm run export:android
npm run export:ios
```

The checked-in PNG was decoded after generation and matched the deep link above. Android and iOS manifest requests to the `judging` channel both returned HTTP 200 and the published platform update IDs.
