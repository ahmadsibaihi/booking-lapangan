import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const [riwayat, setRiwayat] = useState([]);

  const fetchData = async () => {
    const data = await AsyncStorage.getItem('bookingData');
    if (data) {
      setRiwayat(JSON.parse(data));
    } else {
      setRiwayat([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const hapusRiwayat = () => {
    Alert.alert('Konfirmasi', 'Yakin mau hapus semua booking?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('bookingData');
          setRiwayat([]);
          alert('Riwayat berhasil dihapus');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Booking</Text>

      {riwayat.length > 0 && (
        <Button title="Hapus Semua" color="red" onPress={hapusRiwayat} />
      )}

      {riwayat.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Tidak ada data booking</Text>
      ) : (
        <FlatList
          style={{ marginTop: 20 }}
          data={riwayat}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nama}>{item.lapangan}</Text>
              <Text>{item.lokasi}</Text>
              <Text>{item.tanggal} - {item.jam}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  card: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8
  },
  nama: { fontWeight: 'bold', fontSize: 16 }
});
