import { Merchant, Transaction, IncidentLog } from './types';

// Default Demo Coordinates
// Gedung Selaru, Telkom University: -6.974021, 107.630342
export const SELARU_LAT = -6.974021;
export const SELARU_LON = 107.630342;

// Masjid Syamsul 'Ulum, Telkom University (Mode Statis Eksklusif): -6.973800, 107.630100
export const MASJID_LAT = -6.973800;
export const MASJID_LON = 107.630100;

// Jakarta Pusat (Penipu): -6.175392, 106.827153 (~120 km from Bandung)
export const JAKARTA_LAT = -6.175392;
export const JAKARTA_LON = 106.827153;

export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 1,
    nmid: 'ID10293847561',
    name: 'WARUNG BAKSO PAK BUDI',
    city: 'BANDUNG',
    latitude: SELARU_LAT,
    longitude: SELARU_LON,
    wa_number: '081224990680',
    security_mode: 'OPEN_ZONE',
    zone_category: 'UMKM',
    radius_meters: 20,
    qr_type: 'STATIS',
    owner_nik: '3273012345670001',
    business_description: 'Menjual bakso urat sapi khas Solo, mie ayam pangsit, dan aneka minuman segar',
    store_photo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    product_photo_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    is_auto_registered: false,
    created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-09-01T08:00:00Z').toISOString(),
  },
  {
    id: 2,
    nmid: 'ID99999999980',
    name: 'TOKO AKSESORIS PENIPU',
    city: 'JAKARTA PUSAT',
    latitude: JAKARTA_LAT,
    longitude: JAKARTA_LON,
    wa_number: '6280000000000',
    security_mode: 'OPEN_ZONE',
    zone_category: 'UMKM',
    radius_meters: 20,
    qr_type: 'STATIS',
    owner_nik: '3171019999990009',
    business_description: 'Toko aksesoris ponsel dan souvenir palsu sindikat scammer',
    store_photo_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    product_photo_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    is_auto_registered: false,
    created_at: new Date('2026-09-10T08:00:00Z').toISOString(),
    updated_at: new Date('2026-09-10T08:00:00Z').toISOString(),
  },
  {
    id: 3,
    nmid: 'ID10293847999',
    name: 'DKM MASJID SYAMSUL ULUM',
    city: 'BANDUNG',
    latitude: MASJID_LAT,
    longitude: MASJID_LON,
    wa_number: '081224990680',
    security_mode: 'EXCLUSIVE_STATIC',
    zone_category: 'TEMPAT_IBADAH',
    radius_meters: 25,
    qr_type: 'STATIS',
    owner_nik: '3273010101850002',
    business_description: 'Kotak amal infaq & shodaqoh resmi DKM Masjid Syamsul Ulum Telkom University',
    store_photo_url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    product_photo_url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    is_auto_registered: false,
    created_at: new Date('2026-09-15T08:00:00Z').toISOString(),
    updated_at: new Date('2026-09-15T08:00:00Z').toISOString(),
  },
  {
    id: 4,
    nmid: 'ID10293847555',
    name: 'KANTIN BU JOKO SELARU',
    city: 'BANDUNG',
    latitude: -6.974030,
    longitude: 107.630350,
    wa_number: '081234567890',
    security_mode: 'DYNAMIC',
    zone_category: 'UMKM',
    radius_meters: 20,
    is_active: true,
    is_auto_registered: false,
    created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
    updated_at: new Date('2026-09-01T08:00:00Z').toISOString(),
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-984210',
    title: 'Warung Bakso Pak Budi',
    merchantName: 'Warung Bakso Pak Budi',
    nmid: 'ID10293847561',
    date: 'Hari ini, 12:45',
    amount: 35000,
    type: 'debit',
    status: 'SUCCESS',
    category: 'Makanan & Minuman',
  },
  {
    id: 'TX-984209',
    title: 'Top Up NusaPay Platinum',
    merchantName: 'BCA Virtual Account',
    nmid: '-',
    date: 'Hari ini, 10:15',
    amount: 500000,
    type: 'credit',
    status: 'SUCCESS',
    category: 'Top Up',
  },
  {
    id: 'TX-984180',
    title: 'Kantin Teknik Telkom Univ',
    merchantName: 'Kantin Bu Joko',
    nmid: 'ID10293847555',
    date: 'Kemarin, 13:20',
    amount: 22000,
    type: 'debit',
    status: 'SUCCESS',
    category: 'Makanan',
  },
  {
    id: 'TX-984155',
    title: 'Stiker QRIS Penipu (Blocked)',
    merchantName: 'Toko Aksesoris Penipu',
    nmid: 'ID99999999980',
    date: 'Kemarin, 09:12',
    amount: 50000,
    type: 'debit',
    status: 'BLOCKED',
    category: 'Anti-Fraud Block',
  },
];

export const INITIAL_INCIDENT_LOGS: IncidentLog[] = [
  {
    id: 1,
    nmid_scanned: 'ID99999999980',
    merchant_name: 'TOKO AKSESORIS PENIPU',
    status: 'BLOCKED',
    color: 'RED',
    reason: 'LOCATION_MISMATCH',
    fuzzy_score: 100,
    latitude: SELARU_LAT,
    longitude: SELARU_LON,
    distance_meters: 122450,
    gps_available: true,
    created_at: new Date('2026-09-28T09:12:00Z').toISOString(),
  },
  {
    id: 2,
    nmid_scanned: 'ID10293847561',
    merchant_name: 'BAKSO BUDI DIPATIUKUR',
    status: 'REBRAND_WARNING',
    color: 'YELLOW',
    reason: 'NAME_MISMATCH',
    fuzzy_score: 45,
    latitude: SELARU_LAT,
    longitude: SELARU_LON,
    distance_meters: 8,
    gps_available: true,
    created_at: new Date('2026-09-28T14:30:00Z').toISOString(),
  },
];

// Helper to build standard EMVCo payload string
function makeTlv(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

export function buildDemoPayload(
  nmid: string,
  name: string,
  city: string = 'BANDUNG',
  options?: {
    qrType?: 'STATIS' | 'DINAMIS';
    amount?: number | null;
    invoiceNumber?: string | null;
  }
): string {
  const isDynamic = options?.qrType === 'DINAMIS' || (options?.amount != null && options.amount > 0);
  const pointOfInitiation = isDynamic ? '12' : '11';
  const merchantAccountInfo = makeTlv('00', 'ID.CO.QRIS.WWW') + makeTlv('01', nmid);

  let additionalDataField = makeTlv('07', nmid);
  if (options?.invoiceNumber) {
    additionalDataField = makeTlv('01', options.invoiceNumber) + additionalDataField;
  }

  let payload = (
    makeTlv('00', '01') +
    makeTlv('01', pointOfInitiation) +
    makeTlv('26', merchantAccountInfo) +
    '52045812' +
    '5303360'
  );

  if (isDynamic && options?.amount != null && options.amount > 0) {
    const formattedAmount = options.amount.toFixed(2);
    payload += makeTlv('54', formattedAmount);
  }

  payload += (
    makeTlv('58', 'ID') +
    makeTlv('59', name.substring(0, 25)) +
    makeTlv('60', city.substring(0, 15)) +
    makeTlv('62', additionalDataField) +
    '6304ABCD'
  );

  return payload;
}

// Pre-built QRIS Payloads for HackNusa Demo
export const DEMO_PRESETS = {
  stickerA: {
    id: 'A',
    label: 'Stiker A: Merchant Asli (Gedung Selaru)',
    nmid: 'ID10293847561',
    merchantName: 'WARUNG BAKSO PAK BUDI',
    city: 'BANDUNG',
    expectedColor: 'GREEN',
    expectedStatus: 'VERIFIED',
    description: 'NMID terdaftar resmi, nama cocok 100%, lokasi GPS dalam radius 20m.',
    rawPayload: buildDemoPayload('ID10293847561', 'WARUNG BAKSO PAK BUDI', 'BANDUNG'),
  },
  stickerB: {
    id: 'B',
    label: 'Stiker B: QRIS Penipu / Overlay Attack (Jakarta)',
    nmid: 'ID99999999980',
    merchantName: 'TOKO AKSESORIS PENIPU',
    city: 'JAKARTA PUSAT',
    expectedColor: 'RED',
    expectedStatus: 'BLOCKED',
    description: 'Stiker fisik ditempel di Bandung tapi lokasi merchant di Jakarta (~120km) -> Terblokir Seketika!',
    rawPayload: buildDemoPayload('ID99999999980', 'TOKO AKSESORIS PENIPU', 'JAKARTA PUSAT'),
  },
  stickerC: {
    id: 'C',
    label: 'Stiker C: Rebrand Fraud (Nama Berbeda)',
    nmid: 'ID10293847561',
    merchantName: 'BAKSO BUDI DIPATIUKUR',
    city: 'BANDUNG',
    expectedColor: 'YELLOW',
    expectedStatus: 'REBRAND_WARNING',
    description: 'NMID sama dengan Pak Budi, lokasi cocok, tetapi nama diubah menjadi "Bakso Budi Dipatiukur" (Fuzzy ~45%).',
    rawPayload: buildDemoPayload('ID10293847561', 'BAKSO BUDI DIPATIUKUR', 'BANDUNG'),
  },
  stickerUnknown: {
    id: 'UNKNOWN',
    label: 'Stiker D: NMID Palsu / Bodong Tidak Terdaftar',
    nmid: 'ID99900011122',
    merchantName: 'QRIS PALSU TIDAK RESMI',
    city: 'UNKNOWN',
    expectedColor: 'YELLOW',
    expectedStatus: 'REBRAND_WARNING',
    description: 'NMID belum terdaftar di sistem -> Auto Register or Unregistered alert.',
    rawPayload: buildDemoPayload('ID99900011122', 'QRIS PALSU TIDAK RESMI', 'UNKNOWN'),
  },
  stickerMasjid: {
    id: 'MASJID',
    label: 'Stiker E: QRIS Resmi Masjid (Mode Statis Eksklusif)',
    nmid: 'ID10293847999',
    merchantName: 'DKM MASJID SYAMSUL ULUM',
    city: 'BANDUNG',
    userLat: MASJID_LAT,
    userLon: MASJID_LON,
    expectedColor: 'GREEN',
    expectedStatus: 'VERIFIED',
    description: 'Tempat ibadah dengan Mode Statis Eksklusif. Transaksi infaq resmi berhasil dan dilindungi zona eksklusif.',
    rawPayload: buildDemoPayload('ID10293847999', 'DKM MASJID SYAMSUL ULUM', 'BANDUNG'),
  },
  stickerFakeKotakAmal: {
    id: 'ROGUE_KOTAK_AMAL',
    label: 'Stiker F: Penipuan Kotak Amal (QR Liar di Area Masjid)',
    nmid: 'ID88887777666',
    merchantName: 'REKENING PRIBADI INFAQ PALSU',
    city: 'BANDUNG',
    userLat: MASJID_LAT,
    userLon: MASJID_LON,
    expectedColor: 'RED',
    expectedStatus: 'BLOCKED',
    description: 'Discan di dalam area Masjid (Mode Statis Eksklusif). Otomatis DIBLOKIR karena hanya 1 QR resmi yang diizinkan di zona ini!',
    rawPayload: buildDemoPayload('ID88887777666', 'REKENING PRIBADI INFAQ PALSU', 'BANDUNG'),
  },
  stickerKantinBuJoko: {
    id: 'KANTIN_BERDAMPINGAN',
    label: 'Stiker G: Pedagang Berdampingan (Mode Dinamis / UMKM)',
    nmid: 'ID10293847555',
    merchantName: 'KANTIN BU JOKO SELARU',
    city: 'BANDUNG',
    userLat: -6.974030,
    userLon: 107.630350,
    expectedColor: 'GREEN',
    expectedStatus: 'VERIFIED',
    description: 'Hanya berjarak 3 meter dari Bakso Pak Budi (Food Court). Kedua pedagang tetap aman dan tidak saling memblokir!',
    rawPayload: buildDemoPayload('ID10293847555', 'KANTIN BU JOKO SELARU', 'BANDUNG'),
  },
  stickerMasjidNoGps: {
    id: 'MASJID_NO_GPS',
    label: 'Stiker H: QR Masjid Tanpa GPS (Zero-Tolerance: BLOCKED)',
    nmid: 'ID10293847999',
    merchantName: 'DKM MASJID SYAMSUL ULUM',
    city: 'BANDUNG',
    userLat: null,
    userLon: null,
    expectedColor: 'RED',
    expectedStatus: 'BLOCKED',
    description: 'Scan QR resmi Masjid tetapi GPS smartphone mati/denied. Otomatis DIBLOKIR karena Zona Eksklusif mewajibkan GPS aktif tanpa toleransi!',
    rawPayload: buildDemoPayload('ID10293847999', 'DKM MASJID SYAMSUL ULUM', 'BANDUNG'),
  },
  stickerDynamic: {
    id: 'DYNAMIC_INVOICE',
    label: 'Stiker I: QRIS Dinamis Kasir / POS (Nominal Terkunci Rp 35.000)',
    nmid: 'ID10293847561',
    merchantName: 'WARUNG BAKSO PAK BUDI',
    city: 'BANDUNG',
    userLat: SELARU_LAT,
    userLon: SELARU_LON,
    expectedColor: 'GREEN',
    expectedStatus: 'VERIFIED',
    description: 'QRIS Dinamis per transaksi kasir: nominal Rp 35.000 terkunci otomatis di Tag 54, invoice unik, aman dari manipulasi nominal.',
    rawPayload: buildDemoPayload('ID10293847561', 'WARUNG BAKSO PAK BUDI', 'BANDUNG', {
      qrType: 'DINAMIS',
      amount: 35000,
      invoiceNumber: 'INV-2026-001',
    }),
  },
};

