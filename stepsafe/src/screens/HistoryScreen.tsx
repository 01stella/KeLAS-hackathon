import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// Mock Data for the Hackathon Pitch
const HISTORY_DATA = [
  {
    id: '1',
    date: 'Today, 21:45',
    destination: 'Kos-kosan Melati',
    duration: '14 mins',
    status: 'Safe',
    isAlert: false,
  },
  {
    id: '2',
    date: 'Yesterday, 22:10',
    destination: 'Stasiun MRT Dukuh Atas',
    duration: '22 mins',
    status: 'Anomaly Detected',
    isAlert: true,
  },
  {
    id: '3',
    date: '12 Oct, 18:30',
    destination: 'Grand Indonesia Mall',
    duration: '45 mins',
    status: 'Safe',
    isAlert: false,
  }
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Journey History</Text>
        <Text style={styles.headerSubtitle}>Your biometric logs & past routes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {HISTORY_DATA.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.card, item.isAlert && styles.cardAlert]}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View style={[styles.statusBadge, item.isAlert ? styles.badgeAlert : styles.badgeSafe]}>
                <Text style={[styles.statusText, item.isAlert ? styles.textAlert : styles.textSafe]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.iconBg}>
                <Ionicons name="location" size={20} color={item.isAlert ? '#EF4444' : '#22C55E'} />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.destinationText}>{item.destination}</Text>
                <View style={styles.durationRow}>
                  <Feather name="clock" size={12} color="#6B7280" />
                  <Text style={styles.durationText}>{item.duration} tracked</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            
            {/* If there was an alert, show the biometric log */}
            {item.isAlert && (
              <View style={styles.alertLogBox}>
                <Feather name="activity" size={14} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.alertLogText}>Heart rate spike to 142 BPM at 22:15</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Navbar space
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardAlert: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSafe: {
    backgroundColor: '#DCFCE7',
  },
  badgeAlert: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSafe: {
    color: '#16A34A',
  },
  textAlert: {
    color: '#DC2626',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  alertLogBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: 16,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertLogText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  }
});