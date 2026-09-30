import { Merchant, Transaction, IncidentLog } from './types';

// Default Demo Coordinates
// Gedung Selaru, Telkom University: -6.974021, 107.630342
export const SELARU_LAT = -6.974021;
export const SELARU_LON = 107.630342;

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
    wa_number: '6281234567890',
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
    is_active: true,
    is_auto_registered: false,
    created_at: new Date('2026-09-10T08:00:00Z').toISOString(),
    updated_at: new Date('2026-09-10T08:00:00Z').toISOString(),
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

export function buildDemoPayload(nmid: string, name: string, city: string = 'BANDUNG'): string {
  const merchantAccountInfo = makeTlv('00', 'ID.CO.QRIS.WWW') + makeTlv('01', nmid);
  const additionalDataField = makeTlv('07', nmid);

  return (
    makeTlv('00', '01') +
    makeTlv('01', '11') +
    makeTlv('26', merchantAccountInfo) +
    '52045812' +
    '5303360' +
    makeTlv('58', 'ID') +
    makeTlv('59', name.substring(0, 25)) +
    makeTlv('60', city.substring(0, 15)) +
    makeTlv('62', additionalDataField) +
    '6304ABCD'
  );
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
};
