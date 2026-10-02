export interface WhatsAppAlertPayload {
  nmid: string;
  suspectedMerchantName: string;
  buyerLocation?: { latitude: number; longitude: number };
  timestamp: string;
  distanceMeters?: number;
  reason?: string;
  targetPhone?: string;
}

export interface WhatsAppDeviceStatus {
  connected: boolean;
  device?: string;
  name?: string;
  quota?: string;
  status: string;
}

export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  return cleaned;
}

export async function checkWhatsAppStatus(): Promise<WhatsAppDeviceStatus> {
  const token = process.env.FONNTE_TOKEN || process.env.WHATSAPP_TOKEN;
  if (!token) {
    return { connected: false, status: 'No token configured' };
  }

  try {
    const res = await fetch('https://api.fonnte.com/device', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      cache: 'no-store',
    });
    const data = await res.json();
    return {
      connected: data.device_status === 'connect',
      device: data.device,
      name: data.name,
      quota: data.quota,
      status: data.device_status || 'unknown',
    };
  } catch (err: any) {
    return { connected: false, status: err.message || 'Connection error' };
  }
}

export async function sendFraudAlert(payload: WhatsAppAlertPayload): Promise<{ success: boolean; message: string; details?: any }> {
  const token = process.env.FONNTE_TOKEN || process.env.WHATSAPP_TOKEN;
  const rawTarget = payload.targetPhone || process.env.WHATSAPP_ALERT_TARGET || '6281224990680';
  const target = normalizePhoneNumber(rawTarget);

  const mapsLink = payload.buyerLocation
    ? `\n• *Peta Lokasi*: https://www.google.com/maps?q=${payload.buyerLocation.latitude},${payload.buyerLocation.longitude}`
    : '';

  const messageText = 
`🚨 *PERINGATAN FRAUD QRIS (ValidQR NusaPay)* 🚨

Terdeteksi anomali keamanan pada transaksi merchant Anda:
• *NMID Terduga*: ${payload.nmid}
• *Nama Merchant*: ${payload.suspectedMerchantName}
• *Alasan*: ${payload.reason || 'Potensi Overlay Attack / Lokasi Berbeda'}
• *Jarak*: ${payload.distanceMeters ? `${payload.distanceMeters}m dari lokasi terdaftar` : 'Di luar radius geofence aman'}
• *Waktu*: ${new Date(payload.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB${mapsLink}

🛡️ *Tindakan Sistem*: Transaksi telah *DIBLOKIR* secara otomatis sebelum saldo nasabah terpotong.

⚠️ *Tindakan Diperlukan*: Segera periksa fisik stiker QRIS di meja kasir Anda. Jika tertimpa stiker asing, segera lepas dan amankan lokasi toko.`;

  console.log(`[WhatsAppBot] 📲 Fraud alert triggered for NMID: ${payload.nmid} -> ${target}`);

  if (token) {
    try {
      const res = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target,
          message: messageText,
        }),
      });
      const data = await res.json();
      console.log('[WhatsAppBot] Fonnte API response:', data);

      if (data && data.status === false) {
        return { success: false, message: data.reason || 'Fonnte dispatch rejected', details: data };
      }

      return { success: true, message: 'WhatsApp fraud alert successfully dispatched via Fonnte', details: data };
    } catch (err: any) {
      console.error('[WhatsAppBot] Error sending WhatsApp message:', err);
      return { success: false, message: err.message || 'Network error sending WhatsApp alert' };
    }
  }

  // Fallback: log alert
  console.log(`[WhatsAppBot Simulated Dispatch]:\n${messageText}`);
  return { success: true, message: 'Alert simulated & recorded in server logs (No token)' };
}

export async function sendTestAlert(targetPhone?: string): Promise<{ success: boolean; message: string; details?: any }> {
  const token = process.env.FONNTE_TOKEN || process.env.WHATSAPP_TOKEN;
  const rawTarget = targetPhone || process.env.WHATSAPP_ALERT_TARGET || '6281224990680';
  const target = normalizePhoneNumber(rawTarget);

  const messageText = 
`🔔 *VALIDQR (NUSAPAY) — TEST NOTIFIKASI WHATSAPP* 🔔

Halo! Ini adalah pesan uji coba dari sistem anti-fraud *ValidQR*.

✅ *Status Gateway*: Terhubung Aktif
✅ *Provider*: Fonnte WhatsApp API
✅ *Target*: ${target}
✅ *Waktu*: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB

Sistem ValidQR siap mengirimkan notifikasi instan apabila terjadi percobaan penipuan pemalsuan stiker QRIS (Overlay Attack) pada toko Anda.`;

  if (!token) {
    return { success: false, message: 'FONNTE_TOKEN belum dikonfigurasi di environment server' };
  }

  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target,
        message: messageText,
      }),
    });
    const data = await res.json();
    if (data && data.status === false) {
      return { success: false, message: data.reason || 'Fonnte error', details: data };
    }
    return { success: true, message: 'Pesan uji coba WhatsApp berhasil dikirim!', details: data };
  } catch (err: any) {
    return { success: false, message: err.message || 'Gagal mengirim pesan uji coba' };
  }
}

