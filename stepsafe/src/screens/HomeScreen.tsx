import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppMap from '../components/AppMap.web';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Platform, StatusBar, KeyboardAvoidingView, PanResponder, Animated, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
// Import the Context Hook
import { useBiometrics } from '../context/BiometricContext';
// Import new Journey Context
import { useJourney } from '../context/JourneyContext';
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

  // New state to track journey metadata
  const [journeyStartData, setJourneyStartData] = useState<any>(null);

  // Pull live BPM and color state from Context
  const { bpm, setBpm, statusColor } = useBiometrics();
  // Access global journey history functions
  const { addJourney } = useJourney();

  const [emergencyAlert, setEmergencyAlert] = useState<'idle' | 'warning' | 'sosSent'>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isEmergencyScenarioActive, setIsEmergencyScenarioActive] = useState(false);
  const [contactStatus, setContactStatus] = useState<'normal' | 'alerted'>('normal');

  // Boolean check
  const hasValidDestination = destination.trim().length > 0 && destination !== 'Set Destination';
  const isHighHeartRate = bpm > 160;

  // Reusable function to save the journey with dynamic status
  const saveJourney = useCallback((status: 'Safe' | 'Anomaly detected', isAlert: boolean) => {
    const endTime = Date.now();
    const durationSeconds = Math.max(1, Math.floor((endTime - (journeyStartData?.startTime || endTime)) / 1000));
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    addJourney({
      id: endTime.toString(),
      date: `Today, ${timeString}`,
      origin: journeyStartData?.origin || 'Current Location',
      destination: destination || 'Selected Destination',
      duration: `${durationSeconds} secs`,
      status: status,
      isAlert: isAlert
      // pathImage removed to delete hardcoded dummy data
    });

    setDestination('');
  }, [addJourney, journeyStartData, destination]);

  // Show the check-in as soon as the shared biometric reading enters the high-risk range.
  useEffect(() => {
    if (isHighHeartRate && emergencyAlert === 'idle') {
      setSecondsRemaining(5);
      setEmergencyAlert('warning');
      setIsJourneyStarted(false);
    }

    if (!isHighHeartRate) {
      setSecondsRemaining(5);
      setEmergencyAlert('idle');
    }
  }, [emergencyAlert, isHighHeartRate, setIsJourneyStarted]);

  useEffect(() => {
    if (emergencyAlert !== 'warning') return;

    if (secondsRemaining === 0) {
      setEmergencyAlert('sosSent');
      setContactStatus('alerted');
      setIsJourneyStarted(false);
      // Record anomaly journey immediately when user fails to respond
      if (isEmergencyScenarioActive) {
        saveJourney('Anomaly detected', true);
        setIsEmergencyScenarioActive(false);
      }
      return;
    }

    const countdown = setTimeout(() => {
      setSecondsRemaining((seconds) => seconds - 1);
    }, 1000);

    return () => clearTimeout(countdown);
  }, [emergencyAlert, secondsRemaining, isEmergencyScenarioActive, saveJourney]);

  // Demo scenario: a journey gradually raises the simulated BPM until it reaches
  // the existing high-heart-rate threshold and opens the safety check-in.
  useEffect(() => {
    if (!isEmergencyScenarioActive || emergencyAlert !== 'idle') return;

    const heartRateIncrease = setInterval(() => {
      setBpm(Math.min(bpm + 12, 172));
    }, 500);

    return () => clearInterval(heartRateIncrease);
  }, [bpm, emergencyAlert, isEmergencyScenarioActive, setBpm]);


  const confirmSafety = () => {
    // In the current demo, acknowledging the alert returns the simulated reading to normal.
    setBpm(76);
    setSecondsRemaining(5);
    setEmergencyAlert('idle');
    setContactStatus('normal');
    setIsJourneyStarted(false);
    if (isEmergencyScenarioActive) {
      saveJourney('Safe', false);
      setIsEmergencyScenarioActive(false);
    }
  };

  const dismissSosAlert = () => {
    setBpm(76);
    setEmergencyAlert('idle');
    setIsJourneyStarted(false);
    setIsEmergencyScenarioActive(false);
    // We don't save the journey here anymore since it is now saved exactly when the SOS is triggered
  };

  // --- VIRTUAL JOYSTICK LOGIC START ---
  const pan = useRef(new Animated.ValueXY()).current;
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  
  // Refs to hold joystick direction and loop timer
  const joystickOffset = useRef({ x: 0, y: 0 });
  const moveInterval = useRef<number | null>(null);

  // Cleanup alerted when component unmounts
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
    // Record data when journey starts
    setJourneyStartData({
      origin: currentLocationName !== 'Finding location...' ? currentLocationName : 'Current Location',
      startTime: Date.now()
    });
    setBpm(76);
    setContactStatus('normal');
    setIsEmergencyScenarioActive(true);
    // Update state to start the journey animation in the map
    setIsJourneyStarted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapBackground}>
        {/* Pass the callback function and journey status to the map */}
        <AppMap 
          userLocation={userCoords} 
          onDestinationSelect={(address: string) => setDestination(address)} 
          isJourneyStarted={isJourneyStarted}
          onJourneyEnd={(finalLat: number, finalLng: number) => {
            setIsJourneyStarted(false);
            
            setUserCoords({ latitude: finalLat, longitude: finalLng });
          }}
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

          <View style={styles.contactRow}>
            <View style={styles.contactProfile}>
              <Ionicons name="person" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.contactMeta}>
              <Text style={styles.contactName}>Mom</Text>
              <Text style={styles.contactRelation}>Emergency Contact</Text>
            </View>
            <View style={[styles.contactDot, contactStatus === 'alerted' ? styles.contactDotAlert : styles.contactDotNormal]} />
            <View style={styles.biometricBadgeInline}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor, marginRight: 6 }} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>
                ⌚ <Text style={{ color: statusColor }}>♥</Text> {Math.round(bpm)}
              </Text>
            </View>
          </View>
        </View>

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

      <Modal
        visible={emergencyAlert !== 'idle'}
        transparent
        animationType="fade"
        onRequestClose={emergencyAlert === 'sosSent' ? dismissSosAlert : undefined}
      >
        <View style={styles.alertBackdrop}>
          <View style={styles.alertDialog}>
            <View style={[
              styles.alertIcon,
              emergencyAlert === 'warning' ? styles.alertIconWarning : styles.alertIconSent,
            ]}>
              <Ionicons
                name={emergencyAlert === 'warning' ? 'heart' : 'checkmark'}
                size={28}
                color="#FFFFFF"
              />
            </View>

            {emergencyAlert === 'warning' ? (
              <>
                <Text style={styles.alertTitle}>Are you okay?</Text>
                <Text style={styles.alertMessage}>
                  Your heartbeat is racing at {Math.round(bpm)} BPM. We will contact your emergency number if you do not respond.
                </Text>
                <Text style={styles.countdownText}>Sending SOS in {secondsRemaining}s</Text>
                <TouchableOpacity style={styles.safeButton} onPress={confirmSafety}>
                  <Text style={styles.safeButtonText}>I'm Okay</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.alertTitle}>SOS Message Sent</Text>
                <Text style={styles.alertMessage}>
                  No response was received. An SOS message has been sent to your emergency number.
                </Text>
                <TouchableOpacity style={styles.closeAlertButton} onPress={dismissSosAlert}>
                  <Text style={styles.closeAlertButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  contactRow: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  contactProfile: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactMeta: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },
  contactRelation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  contactDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    marginLeft: 4,
  },
  contactDotNormal: {
    backgroundColor: '#9CA3AF'
  },
  contactDotAlert: {
    backgroundColor: '#DC2626'
  },
  biometricBadgeInline: {
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
    borderWidth: 1,
    borderColor: '#E2E8F0'
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
  alertBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.55)'
  },
  alertDialog: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24
  },
  alertIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  alertIconWarning: {
    backgroundColor: '#EF4444'
  },
  alertIconSent: {
    backgroundColor: '#16A34A'
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center'
  },
  alertMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
    marginTop: 10
  },
  countdownText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 20
  },
  safeButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20
  },
  safeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  closeAlertButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20
  },
  closeAlertButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },
});