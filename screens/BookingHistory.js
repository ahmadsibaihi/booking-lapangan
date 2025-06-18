import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const stored = await AsyncStorage.getItem('bookingData');
        if (stored) {
          setBookings(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Gagal memuat data booking:', error);
      }
    };

    loadBookings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cardShadow}>
      <View style={styles.cardContainer}>
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <Text style={styles.venueName}>{item.lokasi}</Text>
          <TouchableOpacity style={styles.chatBtn}>
            <Text style={styles.chatBtnText}>Chat Penyewa</Text>
            <View style={styles.redDot} />
          </TouchableOpacity>
        </View>
        {/* Main Info */}
        <View style={styles.cardMain}>
          <MaterialCommunityIcons name="soccer-field" size={32} color="#222" style={{ marginRight: 10 }} />
          <View>
            <Text style={styles.fieldName}>{item.lapangan}</Text>
            <Text style={styles.timeInfo}>{item.tanggal}, {item.jam}</Text>
          </View>
        </View>
        {/* Footer */}
        <TouchableOpacity>
          <Text style={styles.eticketText}>Lihat E-Tiket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <View style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Pemesanan Berlangsung</Text>
        </View>
        <View style={styles.tabInactive}>
          <Text style={styles.tabTextInactive}>Riwayat Pemesanan</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Penyewaan lapangan anda</Text>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada riwayat booking 📭</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 4,
    marginTop: 10,
  },
  tabActive: {
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: '#FFCB05',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabTextActive: {
    color: '#2D2547',
    fontWeight: '700',
    fontSize: 15,
  },
  tabTextInactive: {
    color: '#B0B0B0',
    fontWeight: '500',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 10,
    marginLeft: 18,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
    marginHorizontal: 18,
    marginVertical: 15,
    borderRadius: 18,
    backgroundColor: 'transparent'
  },
  cardContainer: {
    borderRadius: 18,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  cardHeader: {
    backgroundColor: '#2D2547',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  venueName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  chatBtn: {
    backgroundColor: '#FFCB05',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginLeft: 12,
  },
  chatBtnText: {
    color: '#2D2547',
    fontWeight: '700',
    fontSize: 13,
  },
  redDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B3B',
    position: 'absolute',
    top: -3,
    right: -3,
    borderWidth: 1,
    borderColor: '#fff'
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCB05',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2547',
    marginBottom: 2,
  },
  timeInfo: {
    fontSize: 14,
    color: '#2D2547',
    fontWeight: '500',
  },
  eticketText: {
    color: '#3340AC',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'left',
    padding: 16,
    paddingTop: 10,
    textDecorationLine: 'underline'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});