import { Tabs, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import Navbar from '@/components/navbar';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
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
  );
}