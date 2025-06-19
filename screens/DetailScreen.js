import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailScreen({ route, navigation }) {
  const { lapangan } = route.params;
  const [tanggal, setTanggal] = useState(new Date());
  const [jam, setJam] = useState(new Date());
  const [showTanggal, setShowTanggal] = useState(false);
  const [showJam, setShowJam] = useState(false);

  const onBooking = async () => {
    const bookingData = {
      lapangan: lapangan.nama,
      lokasi: lapangan.lokasi,
      tanggal: tanggal.toLocaleDateString(),
      jam: jam.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const existingData = await AsyncStorage.getItem('bookingData');
      const arr = existingData ? JSON.parse(existingData) : [];
      arr.push(bookingData);
      await AsyncStorage.setItem('bookingData', JSON.stringify(arr));
      alert('Yeayy Booking berhasil, Terima Kasih.');
      navigation.navigate('History');
    } catch (e) {
      alert('Gagal booking');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Image source={{ uri: lapangan.gambar }} style={styles.image} />
        <View style={styles.infoCard}>
          <Text style={styles.title}>{lapangan.nama}</Text>
          <Text style={styles.lokasi}>{lapangan.lokasi}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="star" size={18} color="#FFC529" />
            <Text style={styles.rating}>4.2</Text>
            <Text style={styles.jenis}>{lapangan.jenis}</Text>
            <Text style={styles.harga}>{lapangan.harga ? `${lapangan.harga}/jam` : '300k/jam'}</Text>
          </View>
        </View>

        <Text style={styles.label}>Pilih Tanggal Booking</Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowTanggal(true)}>
          <Ionicons name="calendar-outline" size={20} color="#23225C" />
          <Text style={styles.inputText}>{tanggal.toDateString()}</Text>
        </TouchableOpacity>
        {showTanggal && (
          <DateTimePicker
            value={tanggal}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowTanggal(false);
              if (selected) setTanggal(selected);
            }}
          />
        )}

        <Text style={styles.label}>Pilih Jam Booking</Text>
        <TouchableOpacity style={styles.inputBox} onPress={() => setShowJam(true)}>
          <Ionicons name="time-outline" size={20} color="#23225C" />
          <Text style={styles.inputText}>
            {jam.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {showJam && (
          <DateTimePicker
            value={jam}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowJam(false);
              if (selected) setJam(selected);
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={onBooking}>
          <Text style={styles.buttonText}>Booking Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#181743' },
  container: { flex: 1, padding: 20 },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 10,
    backgroundColor: '#eee',
    shadowColor: '#23225C',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 6,
  },
  infoCard: {
    backgroundColor: '#23225C',
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#23225C',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFC529', marginBottom: 2 },
  lokasi: { color: '#fff', fontSize: 15, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  rating: { color: '#FFC529', marginLeft: 5, marginRight: 15, fontWeight: 'bold' },
  jenis: { color: '#fff', marginRight: 15 },
  harga: { color: '#fff', fontWeight: 'bold' },
  label: { color: '#FFC529', fontSize: 16, marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    marginTop: 2,
    shadowColor: '#23225C',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  inputText: { marginLeft: 10, color: '#23225C', fontSize: 16 },
  button: {
    backgroundColor: '#FFC529',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#FFC529',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: { color: '#181743', fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5 },
});