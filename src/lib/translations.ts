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

  // ── Merchant Portal ──
  mp_title: { id: 'ValidQR Merchant Portal', en: 'ValidQR Merchant Portal' },
  mp_subtitle: {
    id: 'Pilih lokasi merchant dengan Leaflet, generate stiker QRIS, dan kelola database',
    en: 'Pick merchant location with Leaflet, generate QRIS stickers, and manage database',
  },
  mp_wa_gateway: { id: 'WhatsApp Anti-Fraud Gateway:', en: 'WhatsApp Anti-Fraud Gateway:' },
  mp_wa_active: { id: 'Terhubung Aktif', en: 'Active & Connected' },
  mp_wa_connected: { id: 'Tersambung', en: 'Connected' },
  mp_open_scanner: { id: 'Buka Mobile App Scanner', en: 'Open Mobile Scanner' },
  mp_refresh_title: { id: 'Refresh Data', en: 'Refresh Data' },
  mp_form_title_create: { id: 'Daftarkan Merchant & Terbitkan Stiker QRIS', en: 'Register Merchant & Issue QRIS Sticker' },
  mp_form_title_view: { id: 'Detail Merchant Terdaftar', en: 'Registered Merchant Details' },
  mp_form_subtitle: {
    id: 'Isi identitas fisik, unggah bukti toko & produk, pilih tipe QRIS serta zona perimeter',
    en: 'Fill in physical identity, upload store & product proofs, select QRIS type and perimeter zone',
  },
  mp_btn_new_merchant: { id: 'Daftarkan Merchant Baru', en: 'Register New Merchant' },
  mp_conflict_warning: { id: 'Peringatan Konflik Zona Statis Eksklusif:', en: 'Exclusive Static Zone Conflict Warning:' },
  mp_conflict_desc: {
    id: 'Titik pin berada dalam radius zona eksklusif',
    en: 'Selected pin is within the radius of exclusive zone',
  },
  mp_store_name: { id: 'Nama Merchant / Toko *', en: 'Merchant / Store Name *' },
  mp_city: { id: 'Kota Merchant *', en: 'Merchant City *' },
  mp_nmid_optional: { id: 'NMID (Opsional)', en: 'NMID (Optional)' },
  mp_nmid_tip: { id: 'Auto-generate jika kosong', en: 'Auto-generated if blank' },
  mp_wa_number: { id: 'Nomor WhatsApp Pemilik Toko (Alert Anti-Fraud)', en: 'Owner WhatsApp Number (Anti-Fraud Alerts)' },
  mp_wa_placeholder: { id: '0812xxxx atau 62812xxxx', en: '0812xxxx or 62812xxxx' },
  mp_wa_save_update: { id: 'Simpan Perubahan Nomor', en: 'Save Phone Changes' },
  mp_wa_saving: { id: 'Menyimpan...', en: 'Saving...' },
  mp_wa_test_btn: { id: 'Uji Notifikasi WA', en: 'Test WA Notification' },
  mp_nik_label: { id: 'NIK KTP Penanggung Jawab * (16 Digit)', en: 'Owner NIK / National ID * (16 Digits)' },
  mp_nik_badge: { id: 'Verifikasi Identitas Resmi', en: 'Official Identity Verification' },
  mp_nik_placeholder: { id: 'Contoh: 3273012345670001 (Wajib 16 digit)', en: 'e.g. 3273012345670001 (Must be 16 digits)' },
  mp_desc_label: { id: 'Rincian Barang Dagangan / Hal yang Dijual *', en: 'Sold Goods & Business Details *' },
  mp_desc_badge: { id: 'Verifikasi Komoditas Usaha', en: 'Business Commodity Verification' },
  mp_desc_placeholder: { id: 'Contoh: Menjual bakso urat, mie ayam, es teh manis, dan minuman segar', en: 'e.g. Selling meatballs, chicken noodles, iced tea, and fresh drinks' },

  // Tipe QRIS
  mp_qris_type_title: { id: 'Pilihan Tipe QRIS (Standar Bank Indonesia)', en: 'QRIS Type Selection (Bank Indonesia Standard)' },
  mp_qris_spec_badge: { id: 'ASPI EMVCo Spec', en: 'ASPI EMVCo Spec' },
  mp_qris_static_title: { id: 'QRIS Statis (Stiker Tetap)', en: 'Static QRIS (Fixed Sticker)' },
  mp_qris_static_badge: { id: 'Stiker Fisik', en: 'Physical Sticker' },
  mp_qris_static_desc: {
    id: 'Jenis kode QR yang tetap dan tidak berubah, digunakan untuk memfasilitasi pembayaran berulang kali. Pelanggan memindai lalu memasukkan nominal pembayaran secara manual.',
    en: 'Fixed, unchanging QR code used for recurring payments. Customers scan and enter the payment amount manually in their digital wallet.',
  },
  mp_qris_static_tip: { id: 'Cocok untuk meja kasir, etalase, gerobak, & kotak amal', en: 'Suitable for cashier desks, shopfronts, food carts, & charity boxes' },
  mp_qris_dynamic_title: { id: 'QRIS Dinamis (Kasir / Per Transaksi)', en: 'Dynamic QRIS (POS / Per Transaction)' },
  mp_qris_dynamic_badge: { id: 'Nominal Terkunci', en: 'Locked Amount' },
  mp_qris_dynamic_desc: {
    id: 'Jenis kode QR yang berubah untuk setiap transaksi. Memuat jumlah pembayaran secara otomatis (Tag 54) dan invoice unik, mengeliminasi risiko manipulasi nominal.',
    en: 'QR code generated per transaction. Automatically includes payment amount (Tag 54) and unique invoice ID, eliminating payment amount manipulation.',
  },
  mp_qris_dynamic_tip: { id: 'Cocok untuk sistem kasir modern POS, struk otomatis, & invoice', en: 'Suitable for modern POS cashier systems, auto-receipts, & invoices' },
  mp_qris_amount_label: { id: 'Nominal Tagihan Kasir (Rupiah) *', en: 'Cashier Bill Amount (IDR) *' },
  mp_qris_amount_help: { id: 'Nominal ini akan otomatis terkunci di EMVCo Tag 54 saat QR discan pembeli.', en: 'This amount will be locked in EMVCo Tag 54 when scanned by buyer.' },

  // Mode Lokasi
  mp_sec_title: { id: 'Kebijakan Lokasi & Mode Perimeter Geofence', en: 'Location Policy & Geofence Perimeter Mode' },
  mp_sec_spec_badge: { id: 'Anti-Tampering Engine', en: 'Anti-Tampering Engine' },
  mp_open_zone_title: { id: 'Zona Terbuka (Multi-Merchant)', en: 'Open Zone (Multi-Merchant)' },
  mp_open_zone_badge: { id: 'Standar UMKM', en: 'MSME Standard' },
  mp_open_zone_desc: {
    id: 'Cocok untuk sentra kuliner, pujasera, pasar, atau toko berdampingan. Beberapa merchant resmi boleh berada di area yang sama dan transaksi tetap sukses bersamaan.',
    en: 'Suitable for food courts, street markets, or adjacent shops. Multiple official merchants can coexist in the same area without blocking each other.',
  },
  mp_open_zone_tip: { id: 'Aman untuk pedagang berdampingan di ruko / pujasera / pasar', en: 'Safe for adjacent merchants in commercial complexes / food courts' },
  mp_exclusive_zone_title: { id: 'Zona Eksklusif (Single-Merchant)', en: 'Exclusive Zone (Single-Merchant)' },
  mp_exclusive_zone_badge: { id: 'Perimeter Terkunci', en: 'Locked Perimeter' },
  mp_exclusive_zone_desc: {
    id: 'Khusus area yang butuh proteksi sterilisasi tinggi (Masjid, Gereja, RS, Kasir Darurat). Hanya 1 QR resmi yang boleh aktif. Jika ada QR liar lain discan di radius ini, transaksi otomatis DIBLOKIR KERAS.',
    en: 'For high-security sterilised areas (Mosques, Churches, Hospitals, Emergency Cashiers). Only 1 official QR allowed. Any rogue QRs scanned in this radius are HARD BLOCKED.',
  },
  mp_exclusive_zone_tip: { id: '🛑 Blokir Mutlak QR Asing • Proteksi Kotak Amal & Fasilitas Publik', en: '🛑 Absolute Rogue QR Block • Charity & Public Facility Protection' },
  mp_category_label: { id: 'Kategori Kawasan', en: 'Area Category' },
  mp_cat_umkm: { id: '🏪 Pedagang / UMKM / Kuliner (Pasar/Food Court)', en: '🏪 Merchant / MSME / Culinary (Market/Food Court)' },
  mp_cat_worship: { id: '🕌 Tempat Ibadah (Masjid / Gereja / Kotak Amal)', en: '🕌 Place of Worship (Mosque / Church / Charity Box)' },
  mp_cat_hospital: { id: '🏥 Fasilitas Kesehatan / Rumah Sakit / Kasir Darurat', en: '🏥 Healthcare / Hospital / Emergency Cashier' },
  mp_cat_gov: { id: '🏛️ Kantor Instansi / Layanan Publik Pemerintah', en: '🏛️ Government / Public Service Office' },
  mp_cat_other: { id: '🏢 Area Khusus Lainnya', en: '🏢 Other Specialized Area' },
  mp_radius_label: { id: 'Radius Perimeter Geofence', en: 'Geofence Perimeter Radius' },

  // Berkas Bukti Usaha
  mp_proof_section_title: { id: 'Berkas Verifikasi Fisik Toko & Hal yang Dijual *', en: 'Store Physical Verification Files & Goods Sold *' },
  mp_proof_section_badge: { id: 'Wajib Lampirkan Bukti', en: 'Proof Required' },
  mp_proof_section_desc: {
    id: 'Demi mencegah sembarangan orang membuat QR palsu atau toko fiktif, pendaftar wajib melampirkan foto tempat usaha fisik dan foto barang dagangan sebelum stiker QR resmi dapat diterbitkan.',
    en: 'To prevent fake QR generation or fictitious shops, registrants must attach physical storefront and goods photos before official QR sticker can be issued.',
  },
  mp_proof_store_label: { id: '1. Foto Tempat Usaha / Etalase *', en: '1. Storefront / Shop Photo *' },
  mp_proof_product_label: { id: '2. Foto Produk / Hal yang Dijual *', en: '2. Product / Goods Sold Photo *' },
  mp_sample_link: { id: 'Contoh Foto', en: 'Sample Photo' },
  mp_attached_badge: { id: '✓ Terlampir', en: '✓ Attached' },
  mp_upload_store_hint: { id: 'Pilih / Unggah Foto Toko', en: 'Select / Upload Store Photo' },
  mp_upload_prod_hint: { id: 'Pilih / Unggah Foto Produk', en: 'Select / Upload Product Photo' },
  mp_upload_subhint: { id: 'Maks. 8MB (Auto-Kompresi JPG, PNG, WebP)', en: 'Max. 8MB (Auto-Compressed JPG, PNG, WebP)' },

  // Peta
  mp_map_title: { id: 'Pilih Titik Lokasi Fisik di Peta (Leaflet OpenStreetMap)', en: 'Select Physical Location on Map (Leaflet OpenStreetMap)' },
  mp_map_subtitle: {
    id: 'Klik pada peta untuk memindahkan pin lokasi kasir / merchant secara presisi',
    en: 'Click on the map to accurately place the cashier / merchant location pin',
  },
  mp_quick_pins: { id: 'Preset Lokasi Cepat:', en: 'Quick Location Presets:' },
  mp_btn_submit_create: { id: 'Terbitkan Stiker QRIS & Simpan ke Database', en: 'Generate QRIS Sticker & Save to Database' },
  mp_btn_submit_update: { id: 'Perbarui Data Merchant', en: 'Update Merchant Details' },
  mp_btn_submitting: { id: 'Menyimpan & Menerbitkan...', en: 'Saving & Generating...' },

  // Tabel
  mp_table_title: { id: 'Database Merchant Terdaftar', en: 'Registered Merchant Database' },
  mp_table_subtitle: { id: 'Daftar merchant yang terdaftar di ValidQR Engine', en: 'Merchants registered in ValidQR Engine' },
  mp_col_merchant: { id: 'Merchant', en: 'Merchant' },
  mp_col_type: { id: 'Tipe QR', en: 'QR Type' },
  mp_col_mode: { id: 'Mode Lokasi', en: 'Location Mode' },
  mp_col_coords: { id: 'Koordinat & Radius', en: 'Coordinates & Radius' },
  mp_col_wa: { id: 'WhatsApp', en: 'WhatsApp' },
  mp_col_actions: { id: 'Aksi', en: 'Actions' },
  mp_badge_conflict: { id: 'Konflik', en: 'Conflict' },
  mp_btn_inspect_docs: { id: 'Lihat Berkas', en: 'View Proofs' },
  mp_btn_print_qr: { id: 'Buat Stiker', en: 'Print Sticker' },
  mp_btn_edit: { id: 'Ubah Data', en: 'Edit Data' },
  mp_btn_delete: { id: 'Hapus', en: 'Delete' },

  // StickerModal
  sm_title: { id: 'Stiker QRIS Resmi ValidQR', en: 'Official ValidQR QRIS Sticker' },
  sm_subtitle: { id: 'Standar Nasional Pembayaran Digital Indonesia', en: 'Indonesian Digital Payment National Standard' },
  sm_btn_download: { id: 'Unduh PNG', en: 'Download PNG' },
  sm_btn_print: { id: 'Cetak Stiker', en: 'Print Sticker' },
  sm_close: { id: 'Tutup', en: 'Close' },
  sm_dynamic_alert: { id: 'Stiker ini memuat nominal terkunci otomatis (Tag 54). Pembeli tidak perlu mengetikkan nominal.', en: 'This sticker contains a locked amount (Tag 54). Buyers do not need to type the amount.' },
  sm_footer_warning: { id: 'DILINDUNGI SISTEM ANTI-FRAUD ValidQR 2026', en: 'PROTECTED BY ValidQR ANTI-FRAUD SYSTEM 2026' },

  // ProofModal
  pm_title: { id: 'Berkas Verifikasi Fisik Merchant', en: 'Merchant Physical Verification Proofs' },
  pm_badge_verified: { id: 'Berkas Terverifikasi', en: 'Verified Documents' },
  pm_col_qr: { id: 'Tipe QRIS', en: 'QRIS Type' },
  pm_col_mode: { id: 'Mode Keamanan Area', en: 'Area Security Mode' },
  pm_col_nik: { id: 'NIK Pemilik Toko', en: 'Owner National ID (NIK)' },
  pm_verified_id: { id: 'Identitas Terverifikasi', en: 'Verified Identity' },
  pm_desc_header: { id: 'Deskripsi Barang Dagangan / Hal yang Dijual', en: 'Goods & Merchandise Description' },
  pm_store_header: { id: '1. Foto Tempat Usaha Fisik', en: '1. Physical Storefront Photo' },
  pm_product_header: { id: '2. Foto Barang Dagangan / Menu', en: '2. Merchandise / Menu Photo' },
  pm_reg_at: { id: 'Terdaftar:', en: 'Registered:' },
  pm_close_btn: { id: 'Tutup Berkas', en: 'Close Documents' },
};
