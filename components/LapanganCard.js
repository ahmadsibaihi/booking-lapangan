import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function LapanganCard({ data, onPress }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: data.gambar }} style={styles.image} />
      <Text style={styles.title}>{data.nama}</Text>
      <Text style={styles.lokasi}>{data.lokasi}</Text>
      <Button title="Pesan" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
    borderRadius: 10
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5
  },
  lokasi: {
    color: '#555',
    marginBottom: 10
  }
});
