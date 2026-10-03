export type SecurityMode = 'DYNAMIC' | 'EXCLUSIVE_STATIC' | 'OPEN_ZONE' | 'EXCLUSIVE_ZONE';
export type QrType = 'STATIS' | 'DINAMIS';
export type ZoneCategory = 'UMKM' | 'TEMPAT_IBADAH' | 'RUMAH_SAKIT' | 'INSTANSI' | 'LAINNYA';

export interface Merchant {
  id: number;
  nmid: string;
  name: string;
  city?: string;
  latitude: number;
  longitude: number;
  wa_number?: string | null;
  security_mode?: SecurityMode;
  zone_category?: ZoneCategory;
  radius_meters?: number;
  qr_type?: QrType;
  dynamic_amount?: number | null;
  owner_nik?: string | null;
  business_description?: string | null;
  store_photo_url?: string | null;
  product_photo_url?: string | null;
  is_active: boolean;
  is_auto_registered?: boolean;
  created_at: string;
  updated_at: string;
}

export interface IncidentLog {
  id?: number;
  nmid_scanned: string;
  merchant_name: string;
  status: 'VERIFIED' | 'SOFT_WARNING' | 'REBRAND_WARNING' | 'BLOCKED' | 'HARD_BLOCK';
  color: 'GREEN' | 'YELLOW' | 'RED';
  reason?: string;
  fuzzy_score?: number;
  latitude?: number;
  longitude?: number;
  distance_meters?: number;
  gps_available?: boolean;
  raw_payload?: string;
  created_at?: string;
}

export interface QrPayload {
  nmid: string;
  merchantName: string;
  merchantCity?: string;
  postalCode?: string;
  rawPayload: string;
  crc?: string;
  qrType?: QrType;
  pointOfInitiationMethod?: '11' | '12';
  transactionAmount?: number | null;
  invoiceNumber?: string | null;
}

export interface ScanResponse {
  status: 'VERIFIED' | 'SOFT_WARNING' | 'REBRAND_WARNING' | 'BLOCKED' | 'HARD_BLOCK';
  color: 'GREEN' | 'YELLOW' | 'RED';
  message: string;
  nmid: string;
  nmid_valid: boolean;
  matched_name: string;
  merchant_city?: string;
  location_check: 'MATCH' | 'MISMATCH' | 'SKIPPED';
  locationCheck?: 'MATCH' | 'MISMATCH' | 'SKIPPED';
  distance_meters: number | null;
  duration_seconds?: number | null;
  calculation_method?: string | null;
  geofence_radius: number;
  fuzzy_score: number;
  fuzzy_algorithm?: string;
  scanned_name: string;
  auto_registered?: boolean;
  reason?: string;
  gps_checked: boolean;
  conflict_count?: number;
  conflict_names?: Array<{ id: number; name: string }>;
  incident_id?: number;
  security_mode?: SecurityMode;
  zone_category?: ZoneCategory;
  qr_type?: QrType;
  transaction_amount?: number | null;
  invoice_number?: string | null;
  exclusive_zone_detected?: boolean;
  exclusive_merchant_name?: string;
  store_photo_url?: string | null;
  product_photo_url?: string | null;
  business_description?: string | null;
}

export interface Transaction {
  id: string;
  title: string;
  merchantName: string;
  nmid: string;
  date: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'SUCCESS' | 'BLOCKED' | 'WARNING';
  category: string;
}
