// screens/HomeScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const filters = ['Semua', 'Futsal', 'Basket', 'Tenis', 'Badminton'];

export default function HomeScreen({ navigation }) {
  // --------- State ----------
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Semua');
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  // ⚠️ Ganti ke IP kamu atau pakai env
  const LOCAL_IP = '10.1.7.97';
  const DATA_URL = `http://${LOCAL_IP}:4000/lapangan`;

  // --------- Effects ----------
  useEffect(() => {
    (async () => {
      try {
        const str = await AsyncStorage.getItem('user');
        if (str) setMe(JSON.parse(str));
      } catch (e) {
        console.log('Get user error:', e);
      }
    })();
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(DATA_URL, { signal: ac.signal });
        const data = await res.json();
        setRecommended(Array.isArray(data) ? data : (data?.lapangan ?? []));
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.log('Fetch lapangan error:', e);
          setRecommended([]);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [DATA_URL]);

  // --------- Helpers ----------
  const firstName = (me?.name || '').trim().split(' ')[0] || 'Kamu';

  const shortenWords = (s) =>
    s
      .replace(/Badminton/gi, 'Badmin')
      .replace(/Minisoccer/gi, 'MiniSoc')
      .replace(/Sepak Bola/gi, 'Sepak')
      .replace(/\s+/g, ' ')
      .trim();

  const truncate = (s, max = 18) => (s.length <= max ? s : s.slice(0, max - 3) + '...');
  const niceName = (name) => truncate(shortenWords(name), 18);

  const berita = useMemo(
    () => [
      {
        id: 1,
        title: 'Tips Endurance & Shooting buat Pemula Basket',
        image: 'https://picsum.photos/seed/basket-1/800/600',
        url: 'https://www.kompas.tv/lifestyle/591172/latihan-basket-untuk-pemula-ini-tips-endurance-fisik-dan-teknik-shooting-dari-pemain-pelita-jaya',
      },
      {
        id: 2,
        title: '5 Olahraga Bikin Badan Tinggi & Sehat (Cocok Buat Remaja)',
        image: 'https://picsum.photos/seed/health-1/800/600',
        url: 'https://www.cnnindonesia.com/gaya-hidup/20250711201429-255-1249782/5-olahraga-ini-bisa-bikin-tubuh-tinggi-dan-sehat',
      },
      {
        id: 3,
        title: 'MSL: Liga Minisoccer Komunitas Resmi Dibuka',
        image: 'https://picsum.photos/seed/minisoccer-1/800/600',
        url: 'https://deputi2.kemenpora.go.id/detail/909/digital-sport-berkolaborasi-liga-komunitas-minisoccer-gandeng-teknologi-cetak-pemain-masa-depan',
      },
      {
        id: 4,
        title: 'KONI Dorong Sepak Bola Mini di Seluruh Provinsi',
        image: 'https://picsum.photos/seed/minisoccer-2/800/600',
        url: 'https://megapolitan.antaranews.com/berita/360193/sepakbola-mini-indonesia',
      },
      {
        id: 5,
        title: 'Teknik Dasar Futsal untuk Pemula (Latihan Praktis)',
        image: 'https://picsum.photos/seed/futsal-1/800/600',
        url: 'https://www.milo.co.id/artikel/energi-sang-juara/teknik-dasar-futsal',
      },
      {
        id: 6,
        title: '5 Tips Latihan Futsal Menuju Level Pro',
        image: 'https://picsum.photos/seed/futsal-2/800/600',
        url: 'https://eraspace.com/artikel/post/5-tips-latihan-futsal-untuk-gapai-mimpi-jadi-atlet-profesional',
      },
      {
        id: 7,
        title: 'Cara Main Badminton 1v1: Dasar sampai Pro',
        image: 'https://picsum.photos/seed/badminton-1/800/600',
        url: 'https://ayo.co.id/blog/cara-bermain-bulu-tangkis-1-lawan-1-untuk-pemula-dan-pro',
      },
      {
        id: 8,
        title: 'Teknik Dasar Futsal: Kontrol, Dribble, Passing',
        image: 'https://picsum.photos/seed/futsal-3/800/600',
        url: 'https://kreyatcenter.com/blog/2024/05/22/teknik-dasar-futsal-bagi-pemula/',
      },
    ],
    []
  );

  // --------- Logout (lintas platform & pasti reset) ----------
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (e) {
      console.log('AsyncStorage remove error:', e);
    } finally {
      // ✅ Reset ke root stack dan arahkan ke Auth
      try {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Auth' }], // Pastikan 'Auth' ada di RootStack
          })
        );
      } catch (e) {
        console.log('Reset error:', e);
        // Fallback kalau reset gagal
        try {
          navigation.replace('Auth');
        } catch (e2) {
          console.log('Replace error:', e2);
        }
      }
    }
  };

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      // ✅ React Native Web: Alert buttons kurang reliable → pakai window.confirm
      // @ts-ignore
      const ok = typeof window !== 'undefined' ? window.confirm('Yakin mau keluar?') : true;
      if (ok) handleLogout();
    } else {
      Alert.alert('Logout', 'Yakin mau keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: handleLogout },
      ]);
    }
  };

  // --------- Derived data ----------
  const getFilteredData = () => {
    let data = Array.isArray(recommended) ? recommended : [];
    if (selectedFilter !== 'Semua') {
      data = data.filter(
        (item) => item.jenis && item.jenis.toLowerCase() === selectedFilter.toLowerCase()
      );
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      data = data.filter((item) => item.nama?.toLowerCase().includes(q));
    }
    return data;
  };

  const rekomendasiData = useMemo(() => getFilteredData().slice(0, 7), [recommended, selectedFilter, search]);

  // --------- Renderers ----------
  const renderLapangan = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { lapangan: item })}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: item.gambar }}
        style={styles.cardImage}
        onError={() => console.log('Image load error:', item.gambar)}
      />
      <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 12 }}>
        <Text style={styles.lapanganName} numberOfLines={1} ellipsizeMode="tail">
          {niceName(item.nama)}
        </Text>
        <Text style={styles.lapanganAlamat} numberOfLines={1}>
          {item.lokasi}
        </Text>
        <View style={styles.rowCenter}>
          <Ionicons name="star" size={14} color="#FFC529" />
          <Text style={styles.ratingText}>4.2</Text>
          <Text style={styles.ratingCount}>(40)</Text>
        </View>
        <Text style={styles.priceText}>
          {item.harga ? `Rp. ${Number(item.harga).toLocaleString('id-ID')}/Jam` : 'Rp. 300.000/Jam'}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.jenis || 'Lapangan'}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderBerita = ({ item }) => (
    <TouchableOpacity
      style={styles.newsCard}
      activeOpacity={0.9}
      onPress={() => {
        if (item.url) Linking.openURL(item.url).catch((e) => console.log('Open URL error:', e));
      }}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  // --------- UI ----------
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.floatingHeader}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../assets/user/users.png')} style={styles.avatar} />
            <Text style={styles.haloText}>{`Hai, ${firstName}!`}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={26} color="#23225C" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.notifBtn, { backgroundColor: '#FF4D4D' }]}
              onPress={confirmLogout} // ✅ cross-platform confirm
            >
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.bigTitle}>{`Pilihan tepat buat sehat 😁`}</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#A1A1A1" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Haiii, Mau Olahraga Apa?"
              placeholderTextColor="#A1A1A1"
              style={{ flex: 1, fontSize: 15, color: '#23225C' }}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>
        </View>

        <FlatList
          data={filters}
          keyExtractor={(f) => f}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
              onPress={() => setSelectedFilter(f)}
            >
              <Text
                style={[styles.filterChipText, selectedFilter === f && styles.filterChipTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRowScroll}
          style={{ marginBottom: 10 }}
        />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Mau Main dimana?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LapanganList', { filter: selectedFilter })}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable content */}
      <FlatList
        data={loading ? [] : rekomendasiData}
        renderItem={renderLapangan}
        keyExtractor={(item) => String(item.id)}
        ListFooterComponent={
          <View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Berita Olahraga</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={berita}
              renderItem={renderBerita}
              keyExtractor={(item) => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingBottom: 30 }}
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <Text style={{ color: '#23225C', textAlign: 'center', marginTop: 20 }}>Loading...</Text>
          ) : null
        }
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FF' },
  floatingHeader: { backgroundColor: '#F4F6FF', paddingBottom: 0, zIndex: 10, elevation: 2 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 20, marginRight: 12 },
  haloText: { color: '#23225C', fontSize: 16, fontWeight: '500' },
  notifBtn: { backgroundColor: '#FFC529', padding: 8, borderRadius: 16 },
  bigTitle: { color: '#23225C', fontSize: 22, fontWeight: 'bold', marginLeft: 20, marginTop: 8, marginBottom: 12, lineHeight: 30 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 15 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterRowScroll: { paddingLeft: 20, paddingRight: 10, alignItems: 'center' },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: { backgroundColor: '#FFC529', borderColor: '#FFC529' },
  filterChipText: { color: '#23225C', fontWeight: '500' },
  filterChipTextActive: { color: '#23225C', fontWeight: '700' },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
    marginHorizontal: 20,
  },
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
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    minHeight: 113,
    position: 'relative',
    paddingRight: 15,
  },
  cardImage: { width: 90, height: 90, borderRadius: 14, marginLeft: 10 },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFC529',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9,
    zIndex: 2,
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
    alignItems: 'center',
  },
  newsImage: { width: '100%', height: 90, borderRadius: 12, marginBottom: 10 },
  newsTitle: { color: '#23225C', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
});
