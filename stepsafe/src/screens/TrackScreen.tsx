import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Switch } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrackScreen() {
  const [isEmergencyEnabled, setIsEmergencyEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Track</Text>
            <Text style={styles.headerSubtitle}>Monitor your health and stay safe</Text>
          </View>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>Tracking Active</Text>
          </View>
        </View>

        {/* Device Card */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceIconBg}>
            <Ionicons name="watch" size={32} color="#333" />
            <View style={styles.deviceConnectedBadge}>
              <Ionicons name="checkmark" size={10} color="#FFF" />
            </View>
          </View>
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>SafeStep Watch 3</Text>
            <View style={styles.deviceStatusRow}>
              <Text style={styles.deviceStatusText}>Connected • 100%</Text>
              <Ionicons name="battery-full" size={16} color="#22C55E" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>

        {/* Heart Rate Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="heart" size={16} color="#EF4444" />
              </View>
              <Text style={styles.cardTitle}>Heart Rate</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>

          <View style={styles.heartRateContent}>
            {/* Circular Progress Mockup */}
            <View style={styles.hrRingContainer}>
              <View style={styles.hrRingOuter}>
                <View style={styles.hrRingInner}>
                  <Ionicons name="heart-half" size={20} color="#EF4444" style={{marginBottom: 4}}/>
                  <Text style={styles.hrBigNumber}>86</Text>
                  <Text style={styles.hrUnit}>BPM</Text>
                  <Text style={styles.hrStatus}>Normal</Text>
                </View>
              </View>
            </View>

            {/* Side Stats */}
            <View style={styles.hrStats}>
              <View style={styles.hrStatItem}>
                <Text style={styles.hrStatLabel}>Min</Text>
                <Text style={styles.hrStatValue}><Text style={{color: '#22C55E'}}>68</Text> BPM</Text>
              </View>
              <View style={styles.hrStatItem}>
                <Text style={styles.hrStatLabel}>Max</Text>
                <Text style={styles.hrStatValue}><Text style={{color: '#EF4444'}}>112</Text> BPM</Text>
              </View>
              <View style={styles.hrStatItem}>
                <Text style={styles.hrStatLabel}>Latest</Text>
                <Text style={styles.hrStatValue}><Text style={{color: '#22C55E'}}>86</Text> BPM</Text>
              </View>
            </View>
          </View>

          {/* Faux Chart Area (Using stylized bars for compatibility) */}
          <View style={styles.chartContainer}>
            <View style={styles.chartGrid}>
              {[150, 120, 90, 60, 30, 0].map((val) => (
                <View key={val} style={styles.chartGridLine}>
                  <Text style={styles.chartGridLabel}>{val}</Text>
                  <View style={styles.chartGridDashed} />
                </View>
              ))}
            </View>
            
            <View style={styles.chartBars}>
              {/* Generating random-looking bars to simulate the wave */}
              {[40, 45, 42, 50, 48, 40, 35, 45, 55, 60, 58, 55, 52, 48, 55, 60, 58, 50, 45, 40, 35, 30, 40, 45, 50, 55, 58, 50, 48, 45, 50, 55, 60, 55, 50, 45, 48, 45, 40].map((height, i) => (
                <View key={i} style={[styles.chartBar, { height: height + '%' }]} />
              ))}
              <View style={styles.chartLatestDot} />
            </View>

            <View style={styles.chartXAxis}>
              <Text style={styles.chartXLabel}>09:36</Text>
              <Text style={styles.chartXLabel}>09:37</Text>
              <Text style={styles.chartXLabel}>09:38</Text>
              <Text style={styles.chartXLabel}>09:39</Text>
              <Text style={styles.chartXLabel}>09:40</Text>
              <Text style={styles.chartXLabel}>09:41</Text>
            </View>
          </View>
        </View>

        {/* Gyroscope Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <MaterialCommunityIcons name="axis-arrow" size={16} color="#3B82F6" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Gyroscope <Text style={{fontWeight: '400', color: '#666'}}>(Motion)</Text></Text>
                <Text style={styles.cardSubtitle}>No unusual movement detected</Text>
              </View>
            </View>
            <View style={styles.normalBadge}>
              <Text style={styles.normalBadgeText}>Normal</Text>
            </View>
          </View>

          {/* Faux Wave Line */}
          <View style={styles.waveContainer}>
            <View style={styles.waveLine} />
            <View style={styles.waveDot} />
          </View>

          <View style={styles.cardDivider} />
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sensitivity</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.settingValue}>Medium</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Detection Card */}
        <View style={styles.card}>
          <View style={[styles.cardHeader, { marginBottom: 16 }]}>
            <View style={styles.cardTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                <Feather name="shield" size={16} color="#9333EA" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Emergency Detection</Text>
                <Text style={styles.cardSubtitle}>We'll alert your contacts if an emergency is detected</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#22C55E" }}
              thumbColor={"#FFF"}
              ios_backgroundColor="#E5E7EB"
              onValueChange={() => setIsEmergencyEnabled(!isEmergencyEnabled)}
              value={isEmergencyEnabled}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>

          <View style={styles.monitoringIcons}>
            <View style={styles.monitorItem}>
              <View style={[styles.monitorIconBg, {backgroundColor: '#FEE2E2'}]}>
                <Ionicons name="pulse" size={20} color="#EF4444" />
              </View>
              <Text style={styles.monitorTitle}>Heart Rate</Text>
              <Text style={styles.monitorSub}>Monitoring</Text>
            </View>
            <View style={styles.monitorItem}>
              <View style={[styles.monitorIconBg, {backgroundColor: '#EFF6FF'}]}>
                <MaterialCommunityIcons name="fall" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.monitorTitle}>Fall Detection</Text>
              <Text style={styles.monitorSub}>Enabled</Text>
            </View>
            <View style={styles.monitorItem}>
              <View style={[styles.monitorIconBg, {backgroundColor: '#F3E8FF'}]}>
                <Feather name="phone-call" size={18} color="#9333EA" />
              </View>
              <Text style={styles.monitorTitle}>Motion</Text>
              <Text style={styles.monitorSub}>Monitoring</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="settings-outline" size={18} color="#22C55E" style={{marginRight: 8}}/>
              <Text style={styles.settingLabel}>Detection Sensitivity</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.settingValue, {color: '#22C55E', fontWeight: '600'}]}>High</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Static Bottom Tab Bar */}
    </SafeAreaView>
  );
}

// Reusable Tab Component
const TabItem = ({ icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Ionicons name={icon} size={24} color={active ? '#22C55E' : '#888'} />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom tab
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  deviceIconBg: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  deviceConnectedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#22C55E',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  deviceStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatusText: {
    fontSize: 13,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  heartRateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  hrRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 32,
  },
  hrRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#FEE2E2',
    borderTopColor: '#EF4444',
    borderRightColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }], // Fakes the partial ring look
  },
  hrRingInner: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }], // Corrects text rotation
  },
  hrBigNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111',
    lineHeight: 40,
  },
  hrUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  hrStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  hrStats: {
    justifyContent: 'center',
  },
  hrStatItem: {
    marginBottom: 12,
  },
  hrStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  hrStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  // Faux Chart Styles
  chartContainer: {
    height: 120,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 20,
    justifyContent: 'space-between',
  },
  chartGridLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartGridLabel: {
    width: 24,
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartGridDashed: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 30,
    height: 100,
    paddingBottom: 4,
  },
  chartBar: {
    width: 2,
    backgroundColor: '#FCA5A5',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  chartLatestDot: {
    position: 'absolute',
    right: 0,
    bottom: '42%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    marginTop: 8,
  },
  chartXLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  // Gyroscope
  normalBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  normalBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  waveContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
  },
  waveLine: {
    height: 2,
    backgroundColor: '#93C5FD',
    width: '100%',
    borderRadius: 1,
  },
  waveDot: {
    position: 'absolute',
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    color: '#666',
  },
  settingValue: {
    fontSize: 14,
    color: '#111',
    marginRight: 4,
  },
  monitoringIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  monitorItem: {
    alignItems: 'center',
  },
  monitorIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  monitorTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  monitorSub: {
    fontSize: 10,
    color: '#666',
  },
  // Bottom Tab
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#22C55E',
    fontWeight: '600',
  }
});