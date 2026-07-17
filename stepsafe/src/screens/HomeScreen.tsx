import React, { useState, useEffect, useRef } from 'react';
import AppMap from '../components/AppMap';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Platform, StatusBar, KeyboardAvoidingView, PanResponder, Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
// Import the Context Hook
import { useBiometrics } from '../context/BiometricContext';
// Import location library to fetch device coordinates
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [destination, setDestination] = useState('');
  
  // State to hold dynamic current location text
  const [currentLocationName, setCurrentLocationName] = useState('Finding location...');
  
  // State to store raw GPS coordinates for the map
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number} | null>(null);

  // New state to track if the journey has started
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  // Pull live BPM and color state from Context
  const { bpm, statusColor } = useBiometrics();

  // Boolean check
  const hasValidDestination = destination.trim().length > 0 && destination !== 'Set Destination';

  // --- VIRTUAL JOYSTICK LOGIC START ---
  const pan = useRef(new Animated.ValueXY()).current;
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  
  // Refs to hold joystick direction and loop timer
  const joystickOffset = useRef({ x: 0, y: 0 });
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval when component unmounts
  useEffect(() => {
    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsJoystickActive(true);
        // Start a continuous loop to move GPS while joystick is held
        moveInterval.current = setInterval(() => {
          const { x, y } = joystickOffset.current;
          if (x !== 0 || y !== 0) {
            const speed = 0.000015; // Adjust this for faster/slower movement
            setUserCoords(prev => {
              if(!prev) return prev;
              return {
                latitude: prev.latitude - (y * speed), 
                longitude: prev.longitude + (x * speed)
              }
            });
          }
        }, 30); // 30ms refresh rate for smooth map panning
      },
      onPanResponderMove: (evt, gestureState) => {
        const radius = 40;
        const distance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
        const scale = distance > radius ? radius / distance : 1;
        
        const boundedX = gestureState.dx * scale;
        const boundedY = gestureState.dy * scale;

        pan.setValue({ x: boundedX, y: boundedY });
        
        // Save current direction to ref for the loop to read
        joystickOffset.current = { x: boundedX, y: boundedY };
      },
      onPanResponderRelease: () => {
        setIsJoystickActive(false);
        // Stop the loop and reset joystick
        joystickOffset.current = { x: 0, y: 0 };
        if (moveInterval.current) {
          clearInterval(moveInterval.current);
        }
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    })
  ).current;
  // --- VIRTUAL JOYSTICK LOGIC END ---

  // Request permission and fetch user location on component mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentLocationName('Location permission denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        
        setUserCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        
        // Custom logic for Web using OpenStreetMap API
        if (Platform.OS === 'web') {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const street = data.address.road || data.address.pedestrian || '';
            const city = data.address.city || data.address.town || data.address.state || '';
            setCurrentLocationName(street && city ? `${street}, ${city}` : street || city || 'Location found');
          } else {
            setCurrentLocationName('Location found (Name unavailable)');
          }
        } else {
          // Default Expo logic for iOS/Android
          let address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });

          if (address && address.length > 0) {
            const place = address[0];
            const street = place.street || place.name || '';
            const city = place.city || place.subregion || '';
            setCurrentLocationName(street && city ? `${street}, ${city}` : street || city);
          } else {
            setCurrentLocationName('Location found (Name unavailable)');
          }
        }
      } catch (error) {
        setCurrentLocationName('Failed to fetch location');
      }
    })();
  }, []);

  const handleStartJourney = () => {
    // Update state to start the journey animation in the map
    setIsJourneyStarted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapBackground}>
        {/* Pass the callback function and journey status to the map */}
        <AppMap 
          userLocation={userCoords} 
          onDestinationSelect={(address) => setDestination(address)} 
          isJourneyStarted={isJourneyStarted}
        />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.overlay} 
        pointerEvents="box-none"
      >        
        
        {/* Top Floating Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Where are you heading?"
              placeholderTextColor="#9CA3AF"
              value={destination}
              onChangeText={setDestination}
              editable={!isJourneyStarted}
            />
            {destination.length > 0 && !isJourneyStarted && (
              <TouchableOpacity onPress={() => setDestination('')}>
                <Ionicons name="close-circle" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FLOATING RIGHT-SIDE BLE BADGE (Now Dynamic!) */}
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.biometricBadge}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor, marginRight: 6 }} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>
            ⌚ <Text style={{ color: statusColor }}>♥</Text> {Math.round(bpm)}
          </Text>
        </TouchableOpacity>

        {/* VIRTUAL JOYSTICK UI - Only render if journey has not started */}
        {userCoords && !isJourneyStarted && (
          <View style={styles.joystickContainer}>
            <View style={styles.joystickBase}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[
                  styles.joystickStick,
                  { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
                ]}
              >
                <Ionicons name="navigate" size={24} color="#FFF" style={{ opacity: isJoystickActive ? 1 : 0.8 }} />
              </Animated.View>
            </View>
            <Text style={styles.joystickLabel}>Move GPS</Text>
          </View>
        )}

        {/* Bottom Card */}
        <View style={styles.bottomPanel}>
          <View style={styles.locationRow}>
            <View style={styles.dotCurrent} />
            {/* Render the dynamically fetched location text */}
            <Text style={styles.locationText}>Current: {currentLocationName}</Text>
          </View>
          
          <View style={styles.locationConnector} />
          
          <View style={styles.locationRow}>
            <View style={styles.dotDestination} />
            <Text style={[styles.locationText, !destination && { color: '#9CA3AF' }]}>
              {destination ? destination : 'Set Destination'}
            </Text>
          </View>

          {/* CONDITIONAL ROUTE METRICS: Only renders when destination exists */}
          {!!destination && (
            <View style={styles.routeMetrics}>
              <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 14 }}>🛡️ 92/100 Safe Path</Text>
              <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 13 }}>15 mins • 1.2 km</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.startButton, (!destination || isJourneyStarted) && styles.startButtonDisabled]} 
            onPress={handleStartJourney}
            disabled={!destination || isJourneyStarted}
          >
            <Text style={styles.startButtonText}>
              {isJourneyStarted ? 'Tracking Active...' : 'Start Journey Tracking'}
            </Text>
            <Feather name="activity" size={20} color="#FFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  mapBackground: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: '#E5E7EB', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  overlay: { 
    flex: 1, 
    justifyContent: 'space-between', 
    padding: 20, 
    paddingBottom: 100 
  },
  searchContainer: { 
    marginTop: 10 
  },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 5 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16, 
    color: '#111', 
    fontWeight: '500' 
  },
  biometricBadge: { 
    position: 'absolute', 
    right: 16, 
    top: 100, 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 24, 
    flexDirection: 'row', 
    alignItems: 'center', 
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 4, 
    zIndex: 10, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  joystickContainer: { 
    position: 'absolute', 
    bottom: 270, 
    left: 20, 
    alignItems: 'center', 
    zIndex: 20 
  },
  joystickBase: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderWidth: 2, 
    borderColor: 'rgba(203, 213, 225, 0.8)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  joystickStick: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#3B82F6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 5 
  },
  joystickLabel: { 
    marginTop: 8, 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#334155', 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  bottomPanel: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12, 
    elevation: 10 
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  locationText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#111', 
    marginLeft: 12 
  },
  dotCurrent: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#3B82F6', 
    borderWidth: 3, 
    borderColor: '#DBEAFE' 
  },
  dotDestination: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#EF4444', 
    borderWidth: 3, 
    borderColor: '#FEE2E2' 
  },
  locationConnector: { 
    width: 2, 
    height: 20, 
    backgroundColor: '#E5E7EB', 
    marginLeft: 5, 
    marginVertical: 4 
  },
  routeMetrics: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', 
    marginBottom: 16, 
    marginTop: 8 
  },
  startButton: { 
    backgroundColor: '#22C55E', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 18, 
    borderRadius: 16, 
    marginTop: 24 
  },
  startButtonDisabled: { 
    backgroundColor: '#D1D5DB' 
  },
  startButtonText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
});