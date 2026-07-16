import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Navbar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.bottomTab}>
      {state.routes.map((route: any, index: number) => {
        if (route.name === 'explore') {
          return null;
        }

        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        
        let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
        
        if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
        if (route.name === 'track') iconName = isFocused ? 'map' : 'map-outline';
        if (route.name === 'history') iconName = isFocused ? 'time' : 'time-outline';
        if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(route.name);
          }
        };
        
        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress}>
            <Ionicons name={iconName} size={24} color={isFocused ? '#22C55E' : '#888'} />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {options.title !== undefined ? options.title : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (keep your exact same styles here)
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
    flex: 1,
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