# HotSpot Manager

A React Native application that helps manage your device's hotspot functionality and displays network information. The app allows users to toggle their hotspot on/off and view hotspot-related network details.

## Features

- Toggle hotspot on/off
- Display device's hotspot IP address
- For Android devices below API level 33 (Android 13):
  - View list of connected devices' IP addresses
  - Monitor real-time connections

## Technical Notes

### Android 13+ Limitations

Due to privacy changes introduced in Android 13 (API level 33), apps can no longer access information about connected devices. This is a system-level restriction that affects all third-party applications. As a result, the connected devices list feature is only available on devices running Android 12 or below.

## Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio
- Android SDK Platform 33 (for development)
- Physical Android device for testing (virtual devices don't support hotspot features)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/abdulrehmansk97/assignment-hotspot-scanner.git
cd assignment-hotspot-scanner
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the app:

```bash
npx react-native run-android
```

## Required Permissions

The app requires the following Android permissions:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
```

## Known Issues

1. Connected devices list functionality is not available on Android 13 and above due to system restrictions
2. Some devices might require specific manufacturer permissions for hotspot management
3. Code for fetching connected devices (Android 12 and below) needs testing with actual devices

## Testing Notes

The application has been tested for basic hotspot functionality, but the connected devices list feature (for Android 12 and below) requires additional testing with physical devices.
