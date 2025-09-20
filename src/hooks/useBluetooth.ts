import { useState, useEffect } from 'react';
import { bluetoothService } from '@/services/bluetoothService';

export const useBluetooth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Always supported since we provide fallback for all platforms
    setIsSupported(true);
    
    // Check connection status periodically
    const interval = setInterval(() => {
      const connected = bluetoothService.isBluetoothConnected();
      setIsConnected(connected);
      if (connected) {
        setDeviceName(bluetoothService.getConnectedDeviceName());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const connectBluetooth = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const success = await bluetoothService.requestAudioDevice();
      if (success) {
        await bluetoothService.routeAudioToBluetooth();
        setIsConnected(true);
        setDeviceName(bluetoothService.getConnectedDeviceName());
      }
      return success;
    } catch (error) {
      console.error('Audio optimization failed:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectBluetooth = () => {
    bluetoothService.disconnect();
    setIsConnected(false);
    setDeviceName('');
  };

  return {
    isSupported,
    isConnected,
    isConnecting,
    deviceName,
    connectBluetooth,
    disconnectBluetooth
  };
};
