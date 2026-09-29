import { QrPayload } from './types';

const parseTLV = (payload: string): Map<string, string> => {
  const result = new Map<string, string>();
  let i = 0;

  while (i < payload.length) {
    if (i + 4 > payload.length) break;

    const tag = payload.substring(i, i + 2);
    const lengthStr = payload.substring(i + 2, i + 4);
    const length = parseInt(lengthStr, 10);

    if (isNaN(length)) break;

    const value = payload.substring(i + 4, i + 4 + length);
    result.set(tag, value);

    i += 4 + length;
  }

  return result;
};

const extractNmidFromTag62 = (additionalDataValue: string): string => {
  const subtags = parseTLV(additionalDataValue);
  // Sub-tag 07 = Reference Label (NMID in QRIS spec)
  return subtags.get('07') || '';
};

/**
 * Parses raw QRIS string into structured QrPayload.
 * Also supports fallback parsing for testing non-standard strings or plain text.
 */
export const parseQRIS = (raw: string): QrPayload => {
  const payload = raw.trim();
  if (!payload) {
    throw new Error('QR payload is empty');
  }

  try {
    const tlv = parseTLV(payload);

    const merchantName = tlv.get('59') || '';
    const merchantCity = tlv.get('60') || '';
    const postalCode = tlv.get('61') || '';
    const crc = tlv.get('63') || '';
    const additionalData = tlv.get('62') || '';

    let nmid = extractNmidFromTag62(additionalData);

    // Fallback: check tag 26 subtag 01 if tag 62.07 isn't present
    if (!nmid) {
      const tag26 = tlv.get('26') || '';
      if (tag26) {
        const sub26 = parseTLV(tag26);
        nmid = sub26.get('01') || sub26.get('02') || '';
      }
    }

    if (merchantName || nmid) {
      return {
        nmid: nmid || 'ID_UNKNOWN',
        merchantName: merchantName || 'Unknown Merchant',
        merchantCity,
        postalCode,
        rawPayload: payload,
        crc,
      };
    }
  } catch (e) {
    console.warn('TLV parsing failed, trying heuristic fallback', e);
  }

  // Fallback for simple demo strings like "ID10293847561,Warung Bakso Pak Budi"
  if (payload.includes(',')) {
    const parts = payload.split(',');
    return {
      nmid: parts[0]?.trim() || 'ID_UNKNOWN',
      merchantName: parts[1]?.trim() || 'Custom Merchant',
      merchantCity: parts[2]?.trim() || 'BANDUNG',
      rawPayload: payload,
    };
  }

  return {
    nmid: payload.startsWith('ID') ? payload : `ID${payload.slice(0, 10)}`,
    merchantName: 'Scanned Merchant',
    rawPayload: payload,
  };
};
