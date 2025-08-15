import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const LOCAL_IP = '10.1.7.97'; // IP laptop kamu

let BASE_URL = '';

if (Platform.OS === 'web') {
  BASE_URL = 'http://localhost:3000';
} else if (Platform.OS === 'ios') {
  BASE_URL = `http://${LOCAL_IP}:3000`; // untuk iPhone
} else {
  BASE_URL = 'http://10.0.2.2:3000'; // untuk Android emulator
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* ========= TAMBAHAN MULAI DARI SINI (tidak menghapus yang ada) ========= */

// Timeout agar request tidak ngegantung (opsional, aman ditambah)
api.defaults.timeout = 15000;

// Logging ringan saat development
api.interceptors.request.use((config) => {
  if (__DEV__) {
    const method = (config.method || 'get').toUpperCase();
    console.log(`[API] → ${method} ${config.baseURL}${config.url}`, config.params || '', config.data || '');
  }
  return config;
});

// Token dari AsyncStorage (sudah ada di bawah—biarkan, ini tambahan agar header lain aman)
api.interceptors.request.use((config) => {
  // Pastikan Accept header selalu ada
  config.headers = {
    Accept: 'application/json',
    ...config.headers,
  };
  return config;
});

/* ========= YANG ASLI: REQUEST INTERCEPTOR TOKEN ========= */
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
/* ========= AKHIR BAGIAN ASLI ========= */

// Handler opsional untuk 401 → bisa diarahkan ke layar Auth dari luar file ini
let authFailureHandler = null;

// Interceptor respons: normalisasi error & tangani 401
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API] ← ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    if (__DEV__) {
      console.log('[API ERROR]', status, error?.response?.data || error.message);
    }
    // Jika token invalid/expired
    if (status === 401) {
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
      } catch {}
      if (typeof authFailureHandler === 'function') {
        try { authFailureHandler(); } catch {}
      }
    }
    // Bungkus error agar konsisten
    const normalized = {
      status: status || 0,
      message: error?.response?.data?.error || error?.message || 'Network error',
      data: error?.response?.data,
      original: error,
    };
    return Promise.reject(normalized);
  }
);

/* ========= UTIL & HELPER EXPORT ========= */

/** Atur callback saat 401 terjadi (mis: reset ke Auth di root) */
export const onAuthFailure = (cb) => {
  authFailureHandler = cb;
};

/** Ganti baseURL secara dinamis (misal pindah ke IP LAN saat device fisik) */
export const setBaseURL = (url) => {
  if (url && typeof url === 'string') {
    api.defaults.baseURL = url;
  }
};

/** Set token secara manual + simpan ke AsyncStorage */
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
  }
};

/** Upload multipart dengan progress (foto bukti pembayaran, dll) */
export const postMultipart = (path, formData, onProgress) => {
  return api.post(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (typeof onProgress === 'function' && evt.total) {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        onProgress(pct);
      }
    },
  });
};

/** Helper untuk dapat URL penuh (debug) */
export const fullUrl = (path = '') => {
  const base = api.defaults.baseURL || BASE_URL;
  return `${base}${path}`;
};

/* ========= TAMBAHAN SELESAI ========= */

export default api;