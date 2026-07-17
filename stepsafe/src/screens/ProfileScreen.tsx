import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  // 1. Dynamic State for Emergency Contacts
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Budi Prasetyo', relation: 'Father', phone: '+62 812 3456 7890', color: '#22C55E' },
    { id: '2', name: 'Siti Nurhaliza', relation: 'Mother', phone: '+62 812 9876 5432', color: '#A855F7' },
    { id: '3', name: 'Andini Putri', relation: 'Sister', phone: '+62 821 4567 8901', color: '#F97316' }
  ]);

  // 2. Modal State & Form Fields
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Pre-defined colors for new contacts
  const colorPalette = ['#3B82F6', '#EC4899', '#EAB308', '#14B8A6', '#8B5CF6'];

  // Add Contact Handler
  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;

    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    
    const newContact = {
      id: Date.now().toString(),
      name: newName,
      relation: newRelation || 'Friend',
      phone: newPhone,
      color: randomColor
    };

    setContacts([...contacts, newContact]);
    closeModal();
  };

  // Delete Contact Handler
  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  // Reset and Close Modal
  const closeModal = () => {
    setIsModalVisible(false);
    setNewName('');
    setNewRelation('');
    setNewPhone('');
  };

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
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.avatar} 
            />
            <View style={styles.cameraIconBadge}>
              <Ionicons name="camera" size={12} color="#FFF" />
            </View>
          </View>
          
          <View style={styles.profileDetails}>
            <Text style={styles.nameText}>user1</Text>
            <Text style={styles.handleText}>user1@mail.com</Text>
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
            {/* Dynamically update contact count */}
            <Text style={styles.statNumber}>{contacts.length}</Text> 
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
          {/* Change Edit to Add and trigger modal */}
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Text style={styles.linkText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          {contacts.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>No emergency contacts yet.</Text>
            </View>
          ) : (
            contacts.map((contact, index) => (
              <React.Fragment key={contact.id}>
                <ContactItem 
                  initial={contact.name.charAt(0).toUpperCase()} 
                  name={contact.name} 
                  relation={contact.relation} 
                  phone={contact.phone} 
                  color={contact.color}
                  onDelete={() => handleDeleteContact(contact.id)}
                />
                {index < contacts.length - 1 && <View style={styles.lineDivider} />}
              </React.Fragment>
            ))
          )}
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

      {/* Add Contact Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Full Name"
              value={newName}
              onChangeText={setNewName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Relation (e.g. Roommate, Father)"
              value={newRelation}
              onChangeText={setNewRelation}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
              placeholderTextColor="#999"
            />

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: (!newName || !newPhone) ? '#D1D5DB' : '#22C55E' }]} 
              disabled={!newName || !newPhone}
              onPress={handleAddContact}
            >
              <Text style={styles.modalButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

// Reusable Components
const LocationItem = ({ icon, title, subtitle }: any) => (
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

// Added onDelete prop and replaced phone icon with a delete icon
const ContactItem = ({ initial, name, relation, phone, color, onDelete }: any) => (
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
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Ionicons name="trash-outline" size={18} color="#EF4444" />
    </TouchableOpacity>
  </View>
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
    paddingBottom: 100, 
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
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
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
  
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 16,
    color: '#111',
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});