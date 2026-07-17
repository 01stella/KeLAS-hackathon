import { Tabs, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import Navbar from '@/components/navbar';

// 1. IMPORT YOUR NEW BIOMETRIC PROVIDER
import { BiometricProvider } from '@/context/BiometricContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    // 2. WRAP THE ENTIRE APP IN THE PROVIDER SO ALL TABS CAN READ THE BPM
    <BiometricProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        
        {/* This binds your custom Navbar to the actual Expo Router */}
        <Tabs tabBar={(props) => <Navbar {...props} />}>
          <Tabs.Screen name="index" options={{ title: 'Homepage', headerShown: false }} />
          <Tabs.Screen name="track" options={{ title: 'Track', headerShown: false }} />
          <Tabs.Screen name="history" options={{ title: 'History', headerShown: false }} />
          <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
        </Tabs>
        
      </ThemeProvider>
    </BiometricProvider>
  );
}