import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform, StatusBar, TouchableOpacity, Modal, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
// Import the journey context to fetch global history data[cite: 6]
import { useJourney } from '../context/JourneyContext';

export default function HistoryScreen() {
  const [selectedJourney, setSelectedJourney] = useState<any>(null);
  
  // Retrieve the global journey history state[cite: 6]
  const { history } = useJourney();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Journey History</Text>
        <Text style={styles.headerSubtitle}>Your biometric logs & past routes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Render the list of journeys dynamically from the global context[cite: 6] */}
        {history.map((item: any) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.card, item.isAlert && styles.cardAlert]}
            onPress={() => setSelectedJourney(item)}
          >
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
            
            {item.isAlert && (
              <View style={styles.alertLogBox}>
                <Feather name="activity" size={14} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.alertLogText}>Heart rate spike to 142 BPM at 22:15</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        {/* Display message if history list is empty[cite: 6] */}
        {history.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 40 }}>
            No past journeys tracked yet.
          </Text>
        )}
      </ScrollView>

      {/* Detail Modal for viewing specific journey information */}
      <Modal visible={!!selectedJourney} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Journey Details</Text>
              <TouchableOpacity onPress={() => setSelectedJourney(null)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Image 
              source={selectedJourney?.pathImage} // Uses the path linked in the data[cite: 5]
              style={styles.mapPathImage} 
              resizeMode="cover" 
            />
            
            <View style={{ padding: 20 }}>
              {/* Origin to Destination Path */}
              <View style={styles.routePathContainer}>
                <View style={styles.dotCurrent} />
                <View style={styles.lineConnector} />
                <View style={styles.dotDestination} />
                
                <View style={styles.routeTextContainer}>
                  <Text style={styles.routeLabel}>Start: {selectedJourney?.origin}</Text>
                  <Text style={styles.routeLabel}>End: {selectedJourney?.destination}</Text>
                </View>
              </View>

              <Text style={[styles.dateText, { marginTop: 10 }]}>{selectedJourney?.date}</Text>
              
              <View style={[styles.alertLogBox, { marginTop: 16 }]}>
                <Feather name="activity" size={14} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.alertLogText}>
                  {selectedJourney?.isAlert ? "Biometric safety threshold was met during this trip." : "Journey completed safely."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 10 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#111' 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 4 
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 100 
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
    borderColor: '#F3F4F6' 
  },
  cardAlert: { 
    borderColor: '#FEE2E2', 
    backgroundColor: '#FEF2F2' 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  dateText: { 
    fontSize: 13, 
    color: '#4B5563', 
    fontWeight: '600' 
  },
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  badgeSafe: { 
    backgroundColor: '#DCFCE7' 
  },
  badgeAlert: { 
    backgroundColor: '#FEE2E2' 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  textSafe: { 
    color: '#16A34A' 
  },
  textAlert: { 
    color: '#DC2626' 
  },
  cardBody: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconBg: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    backgroundColor: '#F3F4F6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  routeInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  destinationText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111', 
    marginBottom: 4 
  },
  durationRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  durationText: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginLeft: 4 
  },
  alertLogBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 10, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#FECACA' 
  },
  alertLogText: { 
    fontSize: 12, 
    color: '#DC2626', 
    fontWeight: '600' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  detailModal: { 
    backgroundColor: '#FFF', 
    height: '75%', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    overflow: 'hidden' 
  },
  mapPathImage: { 
    width: '100%', 
    height: 250 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '800' 
  },
  routePathContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  lineConnector: { 
    width: 2, 
    height: 24, 
    backgroundColor: '#E5E7EB', 
    marginHorizontal: 4 
  },
  routeTextContainer: { 
    marginLeft: 12, 
    flex: 1 
  },
  routeLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 4 
  },
  dotCurrent: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#3B82F6' 
  },
  dotDestination: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#EF4444' 
  },
});