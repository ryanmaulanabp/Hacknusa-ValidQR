export interface WhatsAppAlertPayload {
  nmid: string;
  suspectedMerchantName: string;
  buyerLocation?: { latitude: number; longitude: number };
  timestamp: string;
  distanceMeters?: number;
  reason?: string;
  targetPhone?: string;
}

export async function sendFraudAlert(payload: WhatsAppAlertPayload): Promise<{ success: boolean; message: string }> {
  const token = process.env.FONNTE_TOKEN || process.env.WHATSAPP_TOKEN;
  const target = payload.targetPhone || process.env.WHATSAPP_ALERT_TARGET || '6281234567890';

  const messageText = 
`🚨 *PERINGATAN FRAUD QRIS (ValidQR NusaPay)* 🚨

Terdeteksi aktivitas mencurigakan pada merchant:
• *NMID Terduga*: ${payload.nmid}
• *Nama Merchant*: ${payload.suspectedMerchantName}
• *Alasan*: ${payload.reason || 'Potensi Overlay Attack / Lokasi Berbeda'}
• *Jarak*: ${payload.distanceMeters ? `${payload.distanceMeters}m dari lokasi merchant asli` : 'Di luar batas aman'}
• *Waktu*: ${new Date(payload.timestamp).toLocaleString('id-ID')}

Transaksi telah diblokir secara preventif oleh sistem ValidQR. Harap segera periksa stiker fisik QRIS di lokasi toko Anda!`;

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
      return { success: true, message: 'WhatsApp message sent via Fonnte' };
    } catch (err) {
      console.error('[WhatsAppBot] Error sending WhatsApp message:', err);
    }
  }

  // Fallback: log alert
  console.log(`[WhatsAppBot Simulated Dispatch]:\n${messageText}`);
  return { success: true, message: 'Alert simulated & recorded in server logs' };
}
