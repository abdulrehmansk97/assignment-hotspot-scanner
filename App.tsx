import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ToastAndroid,
  Button,
  FlatList,
  Platform,
} from 'react-native';
import HotspotManager, {
  Device,
  TetheringError,
} from '@react-native-tethering/hotspot';
import {useEffect, useState} from 'react';

export default function App() {
  const [isHotspotOn, setIsHotspotOn] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [ipAddr, setIpAddr] = useState<string | null>('');

  const populateDetails = async () => {
    try {
      const state = await HotspotManager.isHotspotEnabled();
      setIsHotspotOn(state);
    } catch (error: any) {
      if (error instanceof TetheringError) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      console.log(error);
    }
  };

  const getConnectedDevices = async () => {
    try {
      const devices = await HotspotManager.getConnectedDevices();
      setConnectedDevices(devices);
    } catch (error: any) {
      if (error instanceof TetheringError) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      console.log(error);
    }
  };

  const getIpAddr = async () => {
    try {
      const ip = await HotspotManager.getMyDeviceIp();
      setIpAddr(ip);
    } catch (e) {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  const refresh = useCallback(() => {
    getConnectedDevices();
    getIpAddr();
  }, []);

  useEffect(() => {
    populateDetails();

    const refreshInterval = setInterval(() => {
      refresh();
    }, 10000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [refresh]);

  return (
    <View style={styles.container}>
      <Text style={styles.stateLabel}>
        Hotspot state:{' '}
        <Text style={isHotspotOn ? styles.on : styles.off}>
          {isHotspotOn ? 'ON' : 'OFF'}
        </Text>
      </Text>
      <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
        Please press the button below and grant permission if toggles aren't
        working.
      </Text>
      <Pressable
        style={styles.button}
        android_ripple={{color: '#fff'}}
        onPress={async () => {
          try {
            await HotspotManager.openWriteSettings();
          } catch (error: any) {
            if (error instanceof TetheringError) {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
            }
            console.log(error);
          }
        }}>
        <Text style={styles.buttonText}>Grant permissions</Text>
      </Pressable>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          android_ripple={{color: '#fff'}}
          onPress={async () => {
            try {
              await HotspotManager.setHotspotEnabled(true);
              setIsHotspotOn(true);
              ToastAndroid.show('Hotspot Enabled', ToastAndroid.SHORT);
            } catch (error: any) {
              console.log(error);
            }
          }}>
          <Text style={styles.buttonText}>Turn on hotspot</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          android_ripple={{color: '#fff'}}
          onPress={async () => {
            try {
              await HotspotManager.setHotspotEnabled(false);
              setIsHotspotOn(false);
              ToastAndroid.show('Hotspot Disabled', ToastAndroid.SHORT);
            } catch (error: any) {
              console.log(error);
            }
          }}>
          <Text style={styles.buttonText}>Turn off hotspot</Text>
        </Pressable>
      </View>

      <View style={styles.divider} />
      <Text style={styles.connectedDevicesTitle}>Device IP: {ipAddr}</Text>
      <View style={styles.connectedDevicesContainere}>
        <Text style={styles.connectedDevicesTitle}>Connected devices</Text>
        <Button title="Refresh" onPress={refresh} />
      </View>
      {Platform.Version.toString() >= '33' ? (
        <Text
          style={{
            fontSize: 36,
            color: 'red',
            textAlign: 'center',
            marginVertical: 'auto',
          }}>
          Connected devices feature doesn't work on Android 13 and above due to
          security reasons.
        </Text>
      ) : (
        <FlatList
          data={connectedDevices}
          renderItem={item => {
            return (
              <View key={item.item.ipAddress} style={{marginVertical: 8}}>
                <Text style={styles.itemText}>IP: {item.item.ipAddress}</Text>
                <Text style={styles.itemText}>MAC: {item.item.macAddress}</Text>
              </View>
            );
          }}
          style={{width: '100%'}}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    rowGap: 16,
  },
  buttonsContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    columnGap: 16,
  },
  button: {
    width: '50%',
    padding: 14,
    backgroundColor: '#359962',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    width: '100%',
    backgroundColor: '#359962',
    height: 2,
  },
  stateLabel: {fontSize: 36},
  on: {color: 'green'},
  off: {color: 'red'},
  connectedDevicesTitle: {textAlign: 'left', fontSize: 24},
  connectedDevicesContainere: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemText: {
    fontSize: 18,
    color: 'green',
  },
});
