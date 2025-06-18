import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Image, Platform, StyleSheet, Text, View } from 'react-native';


export default function DetailScreen({ route }) {
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
    let newData = [];

    if (existingData) {
      newData = JSON.parse(existingData);
    }

    newData.push(bookingData);
    await AsyncStorage.setItem('bookingData', JSON.stringify(newData));

    alert('Booking berhasil disimpan!');
  } catch (error) {
    console.log('Gagal simpan booking:', error);
    alert('Gagal simpan booking');
  }
};

  return (
    <View style={styles.container}>
      <Image source={{ uri: lapangan.gambar }} style={styles.image} />
      <Text style={styles.title}>{lapangan.nama}</Text>
      <Text style={styles.lokasi}>{lapangan.lokasi}</Text>

      <Text style={styles.label}>Pilih Tanggal Booking:</Text>
      <Button title={tanggal.toDateString()} onPress={() => setShowTanggal(true)} />

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

      <Text style={styles.label}>Pilih Jam Booking:</Text>
      <Button title={jam.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onPress={() => setShowJam(true)} />

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

      <View style={{ marginTop: 20 }}>
        <Button title="Konfirmasi Booking" onPress={onBooking} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  lokasi: { color: '#777', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
});
