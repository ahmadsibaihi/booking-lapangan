import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../backend-api/api';

export default function PaymentScreen({ route, navigation }) {
  const booking = route?.params?.booking;
  const [amount, setAmount] = useState(booking?.total_price ? String(booking.total_price) : '');
  const [proof, setProof] = useState('');

  const submit = async () => {
    try {
      if (!booking?.id) return Alert.alert('Error', 'Booking tidak valid');
      await api.post('/api/payments', {
        booking_id: booking.id,
        method: 'manual',
        amount: Number(amount || 0),
        proof_image_url: proof
      });
      Alert.alert('Terkirim', 'Pembayaran terkirim, menunggu verifikasi admin');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Gagal mengirim pembayaran');
    }
  };

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:18, fontWeight:'700', marginBottom:12 }}>Pembayaran</Text>
      <Text>Booking ID: {booking?.id}</Text>
      <Text style={{ marginTop:10 }}>Jumlah (Rp)</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric"
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:10, marginTop:6 }} />
      <Text style={{ marginTop:10 }}>URL Bukti (dummy)</Text>
      <TextInput value={proof} onChangeText={setProof} placeholder="https://..." autoCapitalize="none"
        style={{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:10, marginTop:6 }} />
      <TouchableOpacity onPress={submit}
        style={{ backgroundColor:'#2D2547', padding:14, borderRadius:12, marginTop:16, alignItems:'center' }}>
        <Text style={{ color:'#fff', fontWeight:'700' }}>Kirim Pembayaran</Text>
      </TouchableOpacity>
    </View>
  );
}
