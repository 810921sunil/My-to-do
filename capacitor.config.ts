import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zenithlife.app',
  appName: 'Life OS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
