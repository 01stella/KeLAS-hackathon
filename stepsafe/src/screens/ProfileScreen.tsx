import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=32' }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}>Lilian Putri</Text>
            <Text style={styles.handleText}>@lilian.p</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.locationText}>Jakarta, Indonesia</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.chevronBtn}>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBg, { backgroundColor: '#ECFDF5' }]}>
              <Feather name="shield" size={18} color="#22C55E" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Journeys{"\n"}Completed</Text>
          </View>
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIconBg, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="location-outline" size={18} color="#22C55E" />
            </View>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Saved Places</Text>
          </View>
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <View style={[styles.statIconBg, { backgroundColor: '#F0FDF4' }]}>
              <Feather name="users" size={18} color="#22C55E" />
            </View>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Emergency{"\n"}Contacts</Text>
          </View>
        </View>

        {/* Saved Locations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved Locations</Text>
          <TouchableOpacity><Text style={styles.linkText}>See All</Text></TouchableOpacity>
        </View>
        
        <View style={styles.cardContainer}>
          <LocationItem icon="home" title="Home" subtitle="Jl. Melati No. 12, Pancoran, Jakarta Selatan" />
          <View style={styles.lineDivider} />
          <LocationItem icon="school" title="Campus" subtitle="Universitas Indonesia, Depok" />
          <View style={styles.lineDivider} />
          <LocationItem icon="briefcase" title="Office" subtitle="Sudirman Central Business District, Jakarta" />
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <TouchableOpacity><Text style={styles.linkText}>Edit</Text></TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <ContactItem initial="B" name="Budi Prasetyo" relation="Father" phone="+62 812 3456 7890" color="#22C55E" />
          <View style={styles.lineDivider} />
          <ContactItem initial="S" name="Siti Nurhaliza" relation="Mother" phone="+62 812 9876 5432" color="#A855F7" />
          <View style={styles.lineDivider} />
          <ContactItem initial="A" name="Andini Putri" relation="Sister" phone="+62 821 4567 8901" color="#F97316" />
        </View>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton}>
          <View style={styles.sosCircle}>
            <Text style={styles.sosText}>SOS</Text>
          </View>
          <View style={styles.sosContent}>
            <Text style={styles.sosTitle}>Need Help?</Text>
            <Text style={styles.sosSubtitle}>Tap to send an emergency alert</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

      </ScrollView>

      {/* Static Bottom Tab Bar */}
      <View style={styles.bottomTab}>
        <TabItem icon="home-outline" label="Homepage" />
        <TabItem icon="map-outline" label="Track" />
        <TabItem icon="time-outline" label="History" />
        <TabItem icon="person" label="Profile" active />
      </View>
    </SafeAreaView>
  );
}

// Reusable Components
const LocationItem = ({ icon, title, subtitle }) => (
  <View style={styles.listItem}>
    <View style={styles.locationIconBg}>
      <Ionicons name={icon} size={20} color="#22C55E" />
    </View>
    <View style={styles.listContent}>
      <Text style={styles.listTitle}>{title}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color="#888" style={{marginRight: 2}}/>
        <Text style={styles.listSubtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
    </View>
    <TouchableOpacity>
      <MaterialCommunityIcons name="dots-vertical" size={20} color="#999" />
    </TouchableOpacity>
  </View>
);

const ContactItem = ({ initial, name, relation, phone, color }) => (
  <View style={styles.listItem}>
    <View style={[styles.avatarPlaceholder, { backgroundColor: `${color}15` }]}>
      <Text style={[styles.avatarInitial, { color: color }]}>{initial}</Text>
    </View>
    <View style={styles.listContent}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
        <Text style={styles.listTitle}>{name}</Text>
        <View style={[styles.relationBadge, { backgroundColor: `${color}15` }]}>
          <Text style={[styles.relationText, { color: color }]}>{relation}</Text>
        </View>
      </View>
      <Text style={styles.listSubtitle}>{phone}</Text>
    </View>
    <TouchableOpacity style={styles.phoneButton}>
      <Ionicons name="call" size={16} color="#22C55E" />
    </TouchableOpacity>
  </View>
);

const TabItem = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Ionicons name={icon} size={24} color={active ? '#22C55E' : '#888'} />
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom tab
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22C55E',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileDetails: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  handleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
    marginLeft: 4,
  },
  chevronBtn: {
    padding: 8,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  linkText: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  locationIconBg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  lineDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 68,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '700',
  },
  relationBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  relationText: {
    fontSize: 10,
    fontWeight: '600',
  },
  phoneButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  sosCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sosContent: {
    flex: 1,
    marginLeft: 16,
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 2,
  },
  sosSubtitle: {
    fontSize: 12,
    color: '#666',
  },
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