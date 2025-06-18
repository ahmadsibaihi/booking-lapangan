import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const cities = ["Futsal", "Basket", "Tenis", "Badminton"];
const filters = ["Semua", "Minisocer", "Futsal", "Basket", "Tenis", "Badminton"];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Futsal');
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.1.7.97:4000/lapangan')
      .then(response => response.json())
      .then(data => {
        setRecommended(data);
        setLoading(false);
      })
      .catch(err => {
        setRecommended([]);
        setLoading(false);
      });
  }, []);

  // Filter & Search
  const getFilteredData = () => {
    let data = [...recommended];

    if (selectedFilter !== 'Semua') {
      data = data.filter(item => item.jenis && item.jenis.toLowerCase() === selectedFilter.toLowerCase());
    }
    if (search.trim() !== '') {
      data = data.filter(item => item.nama.toLowerCase().includes(search.toLowerCase()));
    }
    return data;
  };

  const renderLapangan = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Image source={{ uri: item.gambar }} style={styles.cardImage} />
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{item.jenis || 'Lapangan'}</Text>
        </View>
      </View>
      <View style={{ padding: 8 }}>
        <Text style={styles.lapanganName}>{item.nama}</Text>
        <Text style={styles.lapanganAlamat}>{item.lokasi}</Text>
        <View style={styles.rowCenter}>
          <Ionicons name="star" size={14} color="#FFC529" />
          <Text style={styles.ratingText}>4.2</Text>
          <Text style={styles.ratingCount}>(40)</Text>
        </View>
        <Text style={styles.priceText}>{item.harga ? `${item.harga}/jam` : '300k/jam'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
          <View>
            <Text style={styles.haloText}>Halo, Abi</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.bigTitle}>Hari ini mau olahraga dimana?{'\n'}</Text>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#A1A1A1" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Mau Olahraga Apa?"
            placeholderTextColor="#A1A1A1"
            style={{ flex: 1, fontSize: 15, color: '#fff' }}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.cityBtn}>
          <Text style={styles.cityBtnText}>{selectedCity}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              selectedFilter === f && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(f)}>
            <Text style={[
              styles.filterChipText,
              selectedFilter === f && styles.filterChipTextActive
            ]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.rekomenRow}>
        <Text style={styles.seeAll}>Rekomendasi untuk kamu</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={getFilteredData()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderLapangan}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingLeft: 20, paddingBottom: 0, paddingTop: 8, marginBottom: 160 }}
        />
      )}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="home" size={24} color="#FFC529" />
          <Text style={{ color: '#FFC529', fontSize: 12 }}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="time-outline" size={22} color="#858585" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="card-outline" size={22} color="#858585" />
          <Text style={styles.navText}>Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="person-outline" size={22} color="#858585" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#181743' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 20, marginRight: 12 },
  haloText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  notifBtn: { backgroundColor: '#23225C', padding: 8, borderRadius: 16 },
  bigTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginLeft: 20, marginTop: 24, marginBottom: 16, lineHeight: 32 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 14 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#23225C', borderRadius: 14, paddingHorizontal: 12, height: 44,
  },
  cityBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#23225C', borderRadius: 12, marginLeft: 10, paddingHorizontal: 15, height: 44,
  },
  cityBtnText: { color: '#fff', fontSize: 15, fontWeight: '500', marginRight: 4 },
  filterRow: { flexDirection: 'row', marginLeft: 20, marginBottom: 10 },
  filterChip: {
    backgroundColor: '#F4F4F4', paddingHorizontal: 18, paddingVertical: 7,
    borderRadius: 18, marginRight: 10
  },
  filterChipActive: { backgroundColor: '#FFC529' },
  filterChipText: { color: '#181743', fontWeight: '500' },
  filterChipTextActive: { color: '#181743', fontWeight: '700' },
  rekomenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8, marginHorizontal: 20 },
  rekomenTitle: { color: '#181743', fontSize: 16, fontWeight: 'bold' },
  seeAll: { color: '#727272', fontSize: 13, fontWeight: '500' },
  card: {
    width: 210, backgroundColor: '#fff', borderRadius: 19, marginRight: 14,
    shadowColor: '#23225C', shadowOpacity: 0.07, shadowOffset: { width: 0, height: 2 }, shadowRadius: 7,
    marginVertical: 12, overflow: 'hidden'
  },
  cardImage: { width: '100%', height: 130, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  distanceBadge: {
    position: 'absolute', top: 10, right: 10, backgroundColor: '#FFC529',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, zIndex: 2
  },
  distanceText: { color: '#181743', fontSize: 13, fontWeight: '700' },
  lapanganName: { color: '#181743', fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  lapanganAlamat: { color: '#727272', fontSize: 12, marginBottom: 4 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  ratingText: { color: '#FFC529', fontSize: 13, marginLeft: 2, fontWeight: '700' },
  ratingCount: { color: '#727272', fontSize: 12, marginLeft: 3 },
  priceText: { color: '#181743', fontWeight: 'bold', fontSize: 15, marginTop: 3 },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22,
    height: 75, paddingHorizontal: 18, position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 15
  },
  navBtn: { alignItems: 'center', flex: 1 },
  navText: { color: '#858585', fontSize: 12, marginTop: 1 }
});