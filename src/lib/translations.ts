export type LanguageCode = 'id' | 'en';

export const translations: Record<string, Record<LanguageCode, string>> = {
  // ── Header & Profile ──
  greeting: { id: 'Halo, Selamat Pagi', en: 'Good Morning' },
  user_name: { id: 'Ryan Maulana', en: 'Ryan Maulana' },
  user_title: { id: 'NusaPay Platinum', en: 'NusaPay Platinum' },
  balance_type: { id: 'NusaPay Platinum', en: 'NusaPay Platinum' },

  // ── Balance Card ──
  active_balance: { id: 'Saldo Aktif', en: 'Active Balance' },
  show: { id: 'Tampilkan', en: 'Show' },
  hide: { id: 'Sembunyikan', en: 'Hide' },
  topup: { id: 'Top Up', en: 'Top Up' },
  transfer: { id: 'Transfer', en: 'Transfer' },
  withdraw: { id: 'Tarik', en: 'Withdraw' },
  request: { id: 'Minta', en: 'Request' },
  history: { id: 'Riwayat', en: 'History' },

  // ── ValidQR Shield ──
  shield_title: { id: 'ValidQR Shield Aktif', en: 'ValidQR Shield Active' },
  shield_desc: {
    id: 'Perlindungan Geofence GPS 20m & Anti-Overlay QRIS',
    en: '20m GPS Geofence & QRIS Anti-Overlay Protected',
  },
  shield_status: { id: 'Adaptive 3-Layer Security', en: 'Adaptive 3-Layer Security' },

  // ── Services ──
  quick_services: { id: 'Layanan Cepat', en: 'Quick Services' },
  service_pulsa: { id: 'Pulsa & Data', en: 'Mobile & Data' },
  service_electric: { id: 'Listrik PLN', en: 'PLN Power' },
  service_water: { id: 'Air PDAM', en: 'PDAM Water' },
  service_emoney: { id: 'E-Money', en: 'E-Money' },
  service_bpjs: { id: 'BPJS Kesehatan', en: 'BPJS Health' },
  service_voucher: { id: 'Voucher Game', en: 'Game Voucher' },
  service_shopping: { id: 'Belanja', en: 'Shopping' },
  service_more: { id: 'Lainnya', en: 'More' },

  // ── Promo Banner ──
  promo_badge: { id: 'PROMO HACKATHON 2026', en: 'HACKATHON 2026 PROMO' },
  promo_title: { id: 'Cashback 50% QRIS', en: '50% QRIS Cashback' },
  promo_desc: { id: 'Semua merchant ValidQR terverifikasi', en: 'All verified ValidQR merchants' },

  // ── Recent Activity ──
  recent_title: { id: 'Aktivitas Terkini', en: 'Recent Activities' },
  see_all: { id: 'Lihat Semua', en: 'See All' },
  today: { id: 'Hari ini', en: 'Today' },
  yesterday: { id: 'Kemarin', en: 'Yesterday' },

  // ── Bottom Nav ──
  nav_home: { id: 'Beranda', en: 'Home' },
  nav_wallet: { id: 'Dompet', en: 'Wallet' },
  nav_history: { id: 'Riwayat', en: 'History' },
  nav_profile: { id: 'Profil', en: 'Profile' },
  scan: { id: 'SCAN', en: 'SCAN' },

  // ── Scanner Screen ──
  scan_title: { id: 'Scan QRIS NusaPay', en: 'NusaPay QRIS Scan' },
  scan_hint: { id: 'Arahkan kamera ke kode QRIS fisik', en: 'Point camera at physical QRIS code' },
  scan_upload_btn: { id: 'Pilih dari Galeri', en: 'Upload from Gallery' },
  scan_demo_presets: { id: 'Preset Demo Pengujian (HackNusa):', en: 'Test Demo Presets (HackNusa):' },
  demo_sticker_a: { id: 'Stiker A: Merchant Asli (VERIFIED)', en: 'Sticker A: Official Merchant (VERIFIED)' },
  demo_sticker_b: { id: 'Stiker B: Overlay Attack / Lokasi Jauh (BLOCKED)', en: 'Sticker B: Overlay Attack (BLOCKED)' },
  demo_sticker_c: { id: 'Stiker C: Rebrand Fraud / Nama Beda (WARNING)', en: 'Sticker C: Rebrand Fraud (WARNING)' },
  camera_permission_required: { id: 'Izin kamera diperlukan untuk memindai QR.', en: 'Camera permission required to scan QR.' },
  gps_fetching: { id: 'Memperoleh koordinat GPS real-time...', en: 'Fetching real-time GPS coordinates...' },

  // ── Verification Popup (Modal) ──
  kicker_blocked: { id: 'TRANSAKSI DIBLOKIR', en: 'TRANSACTION BLOCKED' },
  kicker_unverified_loc: { id: 'LOKASI TIDAK TERVERIFIKASI', en: 'LOCATION UNVERIFIED' },
  kicker_name_diff_unverified: {
    id: 'NAMA BERBEDA & LOKASI TIDAK TERVERIFIKASI',
    en: 'NAME MISMATCH & LOCATION UNVERIFIED',
  },
  kicker_name_mismatch: {
    id: 'PERINGATAN NAMA MERCHANT BERBEDA',
    en: 'MERCHANT NAME MISMATCH WARNING',
  },
  kicker_verified: { id: 'PEMBAYARAN TERVERIFIKASI', en: 'PAYMENT VERIFIED' },

  title_unregistered: { id: '🚨 QRIS TIDAK TERDAFTAR!', en: '🚨 QRIS UNREGISTERED!' },
  title_blocked: { id: '🚨 TRANSAKSI DIBLOKIR!', en: '🚨 TRANSACTION BLOCKED!' },
  title_loc_unverified: {
    id: 'Peringatan: Lokasi Tidak Diverifikasi',
    en: 'Warning: Location Not Verified',
  },
  title_name_loc_unverified: {
    id: 'Peringatan: Nama Berbeda & Lokasi Tidak Diverifikasi',
    en: 'Warning: Name & Location Not Verified',
  },
  title_name_diff: {
    id: 'Peringatan: Nama Merchant Berbeda',
    en: 'Warning: Merchant Name Mismatch',
  },
  title_verified: { id: 'QRIS Terverifikasi', en: 'QRIS Verified' },

  sub_unregistered: {
    id: 'NMID pada QRIS ini tidak ada di database resmi. Kemungkinan QRIS palsu/bodong.',
    en: 'The NMID on this QRIS is not found in the official database. Likely counterfeit QRIS.',
  },
  sub_blocked_overlay: {
    id: 'Lokasi Anda tidak sesuai dengan lokasi merchant terdaftar. Kemungkinan stiker QRIS ditimpa (overlay attack).',
    en: 'Your location does not match the registered merchant location. Possible sticker overlay attack.',
  },
  sub_gps_skipped: {
    id: 'Anda tidak memberikan izin lokasi. Sistem hanya memverifikasi NMID.',
    en: 'Location permission was not provided. System is only verifying NMID.',
  },
  sub_name_diff: {
    id: 'NMID dan lokasi terverifikasi, namun nama merchant berbeda dari database. Transaksi tetap dapat dilanjutkan.',
    en: 'NMID and location are verified, but merchant name differs from database. You may still proceed.',
  },
  sub_verified: {
    id: 'Merchant ini terdaftar resmi dan lokasi Anda sesuai.',
    en: 'This merchant is officially registered and your location matches.',
  },

  btn_proceed: { id: 'Lanjutkan Pembayaran', en: 'Proceed with Payment' },
  btn_proceed_warning: { id: 'Ya, Lanjutkan Pembayaran', en: 'Yes, Proceed Payment' },
  btn_proceed_no_loc: { id: 'Lanjutkan (Tanpa Verifikasi Lokasi)', en: 'Proceed (Without Location)' },
  btn_close: { id: 'Tutup & Kembali', en: 'Close & Return' },
  btn_report_name: { id: 'Laporkan Perubahan Nama', en: 'Report Name Change' },

  header_detail: { id: 'DETAIL VERIFIKASI', en: 'VERIFICATION DETAILS' },
  header_partial: { id: 'VERIFIKASI PARSIAL (NMID ONLY)', en: 'PARTIAL VERIFICATION (NMID ONLY)' },
  header_critical: { id: 'RINCIAN KETIDAKSESUAIAN KRITIS', en: 'CRITICAL MISMATCH DETAILS' },
  header_not_found: { id: 'NMID TIDAK DITEMUKAN', en: 'NMID NOT FOUND' },

  label_nmid_check: { id: 'NMID Check', en: 'NMID Check' },
  status_registered: { id: 'terdaftar', en: 'registered' },
  status_not_found: { id: 'tidak ditemukan', en: 'not found' },
  badge_official: { id: '✓ Resmi', en: '✓ Official' },
  badge_not_in_db: { id: '✗ TIDAK DI DATABASE', en: '✗ NOT IN DATABASE' },

  label_loc_check: { id: 'Location Check', en: 'Location Check' },
  loc_perm_denied: { id: 'Izin lokasi tidak tersedia / ditolak', en: 'Location unavailable / denied' },
  loc_from_merchant: { id: 'dari merchant', en: 'from merchant' },
  loc_radius_tol: { id: 'Radius toleransi:', en: 'Tolerance radius:' },
  loc_exceeds: { id: 'Melebihi radius', en: 'Exceeds radius' },
  badge_unverified: { id: '❓ Tidak Dicek', en: '❓ Skipped' },
  badge_match: { id: '✓ Cocok', en: '✓ Match' },
  badge_mismatch: { id: '✗ Tidak Cocok', en: '✗ Mismatch' },

  label_fuzzy: { id: 'Fuzzy Name Match', en: 'Fuzzy Name Match' },
  label_scan: { id: 'Scan:', en: 'Scan:' },
  label_db: { id: 'Database:', en: 'Database:' },
  fuzzy_identical: { id: 'ℹ️ Nama identik / sangat mirip', en: 'ℹ️ Identical / close match' },
  fuzzy_partial: { id: '⚡ Partial Match — mungkin rebrand', en: '⚡ Partial Match — possible rebrand' },
  fuzzy_diff: { id: '⚠️ Nama sangat berbeda', en: '⚠️ Significant name difference' },

  report_id: { id: 'ID Laporan:', en: 'Report ID:' },
  tx_allowed: { id: 'Transaksi diizinkan', en: 'Transaction allowed' },
  tx_blocked: { id: 'Transaksi diblokir', en: 'Transaction blocked' },

  // ── Payment Amount Page ──
  page_input_nominal: { id: 'Input Nominal', en: 'Payment Amount' },
  label_nominal_input: { id: 'Nominal Pembayaran', en: 'Payment Amount' },
  chip_exact_balance: { id: 'Pas Saldo', en: 'Exact Balance' },
  row_wallet_balance: { id: 'Saldo Dompet NusaPay', en: 'NusaPay Wallet Balance' },
  row_payment_amount: { id: 'Nominal Pembayaran', en: 'Payment Amount' },
  row_remaining_balance: { id: 'Sisa Saldo Setelah Bayar', en: 'Remaining Balance' },
  err_insufficient_balance: {
    id: 'Saldo Anda tidak mencukupi untuk nominal ini',
    en: 'Insufficient balance for this payment',
  },
  btn_confirm_pay: { id: 'Konfirmasi & Bayar', en: 'Confirm & Pay' },

  pin_title: { id: 'Konfirmasi PIN NusaPay', en: 'Confirm NusaPay PIN' },
  pin_sub_prefix: { id: 'Pembayaran', en: 'Payment of' },
  pin_sub_to: { id: 'ke', en: 'to' },
  btn_authenticate: {
    id: 'Autentikasi & Selesaikan Pembayaran',
    en: 'Authenticate & Complete Payment',
  },

  // ── Payment Success Page ──
  success_badge: { id: 'TRANSAKSI BERHASIL', en: 'TRANSACTION SUCCESSFUL' },
  success_title: { id: 'Pembayaran Selesai', en: 'Payment Completed' },
  receipt_title: { id: 'Struk Pembayaran', en: 'Payment Receipt' },
  receipt_badge_qris: { id: 'QRIS Digital', en: 'Digital QRIS' },
  receipt_recipient: { id: 'Penerima', en: 'Recipient' },
  receipt_city: { id: 'Kota Merchant', en: 'Merchant City' },
  receipt_nmid: { id: 'NMID Merchant', en: 'Merchant NMID' },
  receipt_time: { id: 'Waktu Transaksi', en: 'Transaction Time' },
  receipt_ref: { id: 'Nomor Referensi', en: 'Reference Number' },
  receipt_source: { id: 'Sumber Dana', en: 'Source of Funds' },
  receipt_source_val: { id: 'Saldo Utama NusaPay', en: 'NusaPay Main Balance' },
  receipt_remaining: { id: 'Sisa Saldo Anda', en: 'Remaining Balance' },
  shield_verified_title: {
    id: 'Dilindungi oleh ValidQR AI Shield',
    en: 'Protected by ValidQR AI Shield',
  },
  shield_verified_desc: {
    id: 'Geofence GPS 20m & Integritas NMID Terverifikasi',
    en: '20m GPS Geofence & NMID Integrity Verified',
  },
  btn_back_home: { id: 'Kembali ke Beranda', en: 'Back to Home' },
};
