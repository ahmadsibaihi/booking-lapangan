import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const filters = ["Semua", "Minisocer", "Futsal", "Basket", "Tenis", "Badminton"];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
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

  const rekomendasiData = getFilteredData().slice(0, 7);

  const berita = [
    {
      id: 1,
      title: 'Tips Memilih Sepatu Futsal yang Nyaman',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'Manfaat Olahraga Basket untuk Kesehatan',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const renderLapangan = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { lapangan: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.gambar }} style={styles.cardImage} />
      <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 12 }}>
        <Text style={styles.lapanganName} numberOfLines={1}>{item.nama}</Text>
        <Text style={styles.lapanganAlamat} numberOfLines={1}>{item.lokasi}</Text>
        <View style={styles.rowCenter}>
          <Ionicons name="star" size={14} color="#FFC529" />
          <Text style={styles.ratingText}>4.2</Text>
          <Text style={styles.ratingCount}>(40)</Text>
        </View>
        <Text style={styles.priceText}>{item.harga ? `${item.harga}/jam` : '300k/jam'}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.jenis || 'Lapangan'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBerita = ({ item }) => (
    <View style={styles.newsCard}>
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Floating Search & Filter */}
      <View style={styles.floatingHeader}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }} style={styles.avatar} />
            <Text style={styles.haloText}>Halo, Abi</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={26} color="#23225C" />
          </TouchableOpacity>
        </View>
        <Text style={styles.bigTitle}>Hari ini mau olahraga apa?</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#A1A1A1" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Haiii, Mau Olahraga Apa?"
              placeholderTextColor="#A1A1A1"
              style={{ flex: 1, fontSize: 15, color: '#23225C' }}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRowScroll}
          style={{ marginBottom: 10 }}
        >
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
        </ScrollView>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Rekomendasi untuk kamu</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LapanganList', { filter: selectedFilter })}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Scrollable content */}
      <FlatList
        data={loading ? [] : rekomendasiData}
        renderItem={renderLapangan}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          <View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Berita Olahraga</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={berita}
              renderItem={renderBerita}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingBottom: 30 }}
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? <Text style={{ color: '#23225C', textAlign: 'center', marginTop: 20 }}>Loading...</Text> : null
        }
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FF' },
  floatingHeader: {
    backgroundColor: '#F4F6FF',
    paddingBottom: 0,
    zIndex: 10,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 18, marginBottom: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 20, marginRight: 12 },
  haloText: { color: '#23225C', fontSize: 16, fontWeight: '500' },
  notifBtn: { backgroundColor: '#FFC529', padding: 8, borderRadius: 16 },
  bigTitle: { color: '#23225C', fontSize: 22, fontWeight: 'bold', marginLeft: 20, marginTop: 8, marginBottom: 12, lineHeight: 30 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 15 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, height: 44,
    borderWidth: 1, borderColor: '#E0E0E0'
  },
  filterRowScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    alignItems: 'center',
  },
  filterChip: {
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 18, marginRight: 10, borderWidth: 1, borderColor: '#E0E0E0'
  },
  filterChipActive: { backgroundColor: '#FFC529', borderColor: '#FFC529' },
  filterChipText: { color: '#23225C', fontWeight: '500' },
  filterChipTextActive: { color: '#23225C', fontWeight: '700' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8, marginHorizontal: 20 },
  sectionTitle: { color: '#23225C', fontSize: 16, fontWeight: 'bold' },
  seeAll: { color: '#4285F4', fontSize: 13, fontWeight: '500' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#23225C',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    minHeight: 110,
    position: 'relative',
    paddingRight: 10,
  },
  cardImage: { width: 90, height: 90, borderRadius: 14, marginLeft: 10 },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFC529',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 2
  },
  badgeText: { color: '#23225C', fontSize: 13, fontWeight: 'bold' },
  lapanganName: { color: '#23225C', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  lapanganAlamat: { color: '#727272', fontSize: 12, marginBottom: 5 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { color: '#FFC529', fontSize: 13, marginLeft: 2, fontWeight: '700' },
  ratingCount: { color: '#727272', fontSize: 12, marginLeft: 3 },
  priceText: { color: '#23225C', fontWeight: 'bold', fontSize: 15, marginTop: 3 },
  newsCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#23225C',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
    elevation: 2,
    padding: 10,
    alignItems: 'center'
  },
  newsImage: { width: '100%', height: 90, borderRadius: 12, marginBottom: 10 },
  newsTitle: { color: '#23225C', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
});