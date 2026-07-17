import React, { useState } from 'react';
import AppMap from '../components/AppMap';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
// Import the Context Hook
import { useBiometrics } from '../context/BiometricContext';

export default function HomeScreen() {
  const [destination, setDestination] = useState('');
  
  // Pull live BPM and color state from Context
  const { bpm, statusColor } = useBiometrics();

  // Boolean check
  const hasValidDestination = destination.trim().length > 0 && destination !== 'Set Destination';

  const handleStartJourney = () => {
    // Navigate to the Track tab when they start the journey
    router.navigate('/track' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapBackground}>
        <AppMap />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        
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
            />
            {destination.length > 0 && (
              <TouchableOpacity onPress={() => setDestination('')}>
                <Ionicons name="close-circle" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FLOATING RIGHT-SIDE BLE BADGE (Now Dynamic!) */}
        <TouchableOpacity 
          activeOpacity={0.8}
          style={{
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
          }}
        >
          {/* Dynamic Glowing Dot */}
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor, marginRight: 6 }} />
          
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>
            ⌚ <Text style={{ color: statusColor }}>♥</Text> {Math.round(bpm)}
          </Text>
        </TouchableOpacity>

        {/* Bottom Card */}
        <View style={styles.bottomPanel}>
          <View style={styles.locationRow}>
            <View style={styles.dotCurrent} />
            <Text style={styles.locationText}>Current: Universitas Multimedia Nusantara</Text>
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
            <View style={{ 
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
            }}>
              <Text style={{ color: '#10B981', fontWeight: 'bold', fontSize: 14 }}>🛡️ 92/100 Safe Path</Text>
              <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 13 }}>15 mins • 1.2 km</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.startButton, !destination && styles.startButtonDisabled]} 
            onPress={handleStartJourney}
            disabled={!destination}
          >
            <Text style={styles.startButtonText}>Start Biometric Tracking</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mapBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholderText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 100, // Space for Navbar
  },
  searchContainer: {
    marginTop: 10,
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
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  bottomPanel: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginLeft: 12,
  },
  dotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6', // Blue
    borderWidth: 3,
    borderColor: '#DBEAFE',
  },
  dotDestination: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444', // Red
    borderWidth: 3,
    borderColor: '#FEE2E2',
  },
  locationConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginLeft: 5,
    marginVertical: 4,
  },
  startButton: {
    backgroundColor: '#22C55E', // Safe Green
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 24,
  },
  startButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});