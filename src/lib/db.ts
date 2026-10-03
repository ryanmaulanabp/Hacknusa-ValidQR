import { Pool } from 'pg';
import { Merchant, IncidentLog, SecurityMode, ZoneCategory } from './types';
import { INITIAL_MERCHANTS, INITIAL_INCIDENT_LOGS } from './mockData';
import { haversineDistanceMeters } from './geofence';

// Global database pool cache across hot-reloads in Next.js
declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __inMemoryMerchants: Merchant[] | undefined;
  // eslint-disable-next-line no-var
  var __inMemoryIncidents: IncidentLog[] | undefined;
}

// In-Memory store fallback
function getMemoryMerchants(): Merchant[] {
  if (!global.__inMemoryMerchants) {
    global.__inMemoryMerchants = JSON.parse(JSON.stringify(INITIAL_MERCHANTS));
  }
  return global.__inMemoryMerchants!;
}

function getMemoryIncidents(): IncidentLog[] {
  if (!global.__inMemoryIncidents) {
    global.__inMemoryIncidents = JSON.parse(JSON.stringify(INITIAL_INCIDENT_LOGS));
  }
  return global.__inMemoryIncidents!;
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pool: Pool | null = null;
if (connectionString) {
  if (!global.__dbPool) {
    global.__dbPool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    });
  }
  pool = global.__dbPool;
}

/**
 * Ensure canonical baseline demo merchants always exist and are correctly configured in PostgreSQL.
 */
export async function seedOfficialDemoMerchants(existingClient?: any): Promise<void> {
  const client = existingClient || (pool ? await pool.connect() : null);
  if (!client) return;

  const shouldRelease = !existingClient;
  try {
    // 1. Delete rogue counterfeit merchant so it can never pose as valid in the database
    await client.query("DELETE FROM merchants WHERE nmid = 'ID88887777666'");

    // 2. Upsert canonical demo merchants
    for (const m of INITIAL_MERCHANTS) {
      const check = await client.query('SELECT id FROM merchants WHERE nmid = $1', [m.nmid]);
      if (check.rows.length > 0) {
        await client.query(
          `UPDATE merchants SET
            name = $1,
            city = $2,
            latitude = $3,
            longitude = $4,
            wa_number = $5,
            security_mode = $6,
            zone_category = $7,
            radius_meters = $8,
            qr_type = $9,
            owner_nik = $10,
            business_description = $11,
            store_photo_url = $12,
            product_photo_url = $13,
            is_active = true
          WHERE nmid = $14`,
          [
            m.name,
            m.city || 'BANDUNG',
            m.latitude,
            m.longitude,
            m.wa_number,
            m.security_mode || 'OPEN_ZONE',
            m.zone_category || 'UMKM',
            m.radius_meters || 20,
            m.qr_type || 'STATIS',
            m.owner_nik || null,
            m.business_description || null,
            m.store_photo_url || null,
            m.product_photo_url || null,
            m.nmid,
          ]
        );
      } else {
        await client.query(
          `INSERT INTO merchants (
            nmid, name, city, latitude, longitude, wa_number,
            security_mode, zone_category, radius_meters, qr_type,
            owner_nik, business_description, store_photo_url, product_photo_url, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true)`,
          [
            m.nmid,
            m.name,
            m.city || 'BANDUNG',
            m.latitude,
            m.longitude,
            m.wa_number,
            m.security_mode || 'OPEN_ZONE',
            m.zone_category || 'UMKM',
            m.radius_meters || 20,
            m.qr_type || 'STATIS',
            m.owner_nik || null,
            m.business_description || null,
            m.store_photo_url || null,
            m.product_photo_url || null,
          ]
        );
      }
    }
  } catch (err) {
    console.error('[DB] seedOfficialDemoMerchants error:', err);
  } finally {
    if (shouldRelease) {
      client.release();
    }
  }
}

/**
 * Auto-initialize tables in PostgreSQL if connected
 */
export async function initDatabase(): Promise<{ mode: 'cloud' | 'in_memory'; message: string }> {
  if (!pool) {
    console.log('[DB] No DATABASE_URL found. Running in in-memory mode.');
    return { mode: 'in_memory', message: 'In-memory fallback mode active' };
  }

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS merchants (
          id            SERIAL PRIMARY KEY,
          nmid          VARCHAR(20)    NOT NULL,
          name          VARCHAR(255)   NOT NULL,
          city          VARCHAR(100)   DEFAULT 'BANDUNG',
          latitude      DECIMAL(10, 7) NOT NULL,
          longitude     DECIMAL(10, 7) NOT NULL,
          wa_number     VARCHAR(20),
          security_mode VARCHAR(30)    DEFAULT 'DYNAMIC',
          zone_category VARCHAR(50)    DEFAULT 'UMKM',
          radius_meters INTEGER        DEFAULT 20,
          is_active     BOOLEAN        DEFAULT TRUE,
          is_auto_registered BOOLEAN   DEFAULT FALSE,
          created_at    TIMESTAMPTZ    DEFAULT NOW(),
          updated_at    TIMESTAMPTZ    DEFAULT NOW()
        );

        -- Add columns if existing table didn't have them
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS security_mode VARCHAR(30) DEFAULT 'OPEN_ZONE';
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS zone_category VARCHAR(50) DEFAULT 'UMKM';
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS radius_meters INTEGER DEFAULT 20;
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS qr_type VARCHAR(20) DEFAULT 'STATIS';
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS dynamic_amount DECIMAL(12, 2);
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS owner_nik VARCHAR(20);
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS business_description TEXT;
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS store_photo_url TEXT;
        ALTER TABLE merchants ADD COLUMN IF NOT EXISTS product_photo_url TEXT;

        CREATE TABLE IF NOT EXISTS incident_logs (
          id              SERIAL PRIMARY KEY,
          nmid_scanned    VARCHAR(20)    NOT NULL,
          merchant_name   VARCHAR(255),
          status          VARCHAR(30)    NOT NULL,
          color           VARCHAR(10)    NOT NULL,
          reason          VARCHAR(50),
          fuzzy_score     INTEGER,
          latitude        DECIMAL(10, 7),
          longitude       DECIMAL(10, 7),
          distance_meters DECIMAL(10, 2),
          gps_available   BOOLEAN,
          raw_payload     TEXT,
          created_at      TIMESTAMPTZ    DEFAULT NOW()
        );
      `);

      // Seed and guarantee canonical baseline demo merchants
      await seedOfficialDemoMerchants(client);
      return { mode: 'cloud', message: 'Connected to Supabase/Neon PostgreSQL successfully' };
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('[DB] PostgreSQL connection failed, falling back to in-memory mode:', err.message);
    return { mode: 'in_memory', message: `PostgreSQL connection failed: ${err.message}` };
  }
}

let schemaEnsured = false;
export async function ensureSchema(): Promise<void> {
  if (schemaEnsured || !pool) return;
  try {
    await initDatabase();
    schemaEnsured = true;
  } catch (err) {
    console.warn('[DB] Auto schema init check error:', err);
  }
}

/**
 * Get merchants by NMID
 */
export async function getMerchantsByNmid(nmid: string): Promise<Merchant[]> {
  if (pool) {
    await ensureSchema();
    try {
      const res = await pool.query(
        'SELECT * FROM merchants WHERE nmid = $1 AND is_active = TRUE ORDER BY created_at ASC',
        [nmid]
      );
      return res.rows.map(mapMerchantRow);
    } catch (err) {
      console.error('[DB Query Error, using memory fallback]:', err);
    }
  }

  const mem = getMemoryMerchants();
  return mem.filter(m => m.nmid === nmid && m.is_active);
}

/**
 * Get all active merchants
 */
export async function getAllMerchants(): Promise<Merchant[]> {
  if (pool) {
    await ensureSchema();
    try {
      const res = await pool.query('SELECT * FROM merchants ORDER BY id DESC');
      return res.rows.map(mapMerchantRow);
    } catch (err) {
      console.error('[DB Query Error, using memory fallback]:', err);
    }
  }

  return [...getMemoryMerchants()].reverse();
}

/**
 * Create a new merchant
 */
export async function createMerchant(data: {
  nmid: string;
  name: string;
  city?: string;
  latitude: number;
  longitude: number;
  wa_number?: string | null;
  security_mode?: SecurityMode;
  zone_category?: ZoneCategory;
  radius_meters?: number;
  qr_type?: 'STATIS' | 'DINAMIS';
  dynamic_amount?: number | null;
  owner_nik?: string | null;
  business_description?: string | null;
  store_photo_url?: string | null;
  product_photo_url?: string | null;
  is_auto_registered?: boolean;
}): Promise<Merchant> {
  const city = data.city || 'BANDUNG';
  const security_mode = data.security_mode || 'OPEN_ZONE';
  const zone_category = data.zone_category || 'UMKM';
  const isExclusive = security_mode === 'EXCLUSIVE_STATIC' || security_mode === 'EXCLUSIVE_ZONE';
  const radius_meters = data.radius_meters || (isExclusive ? 60 : 20);
  const qr_type = data.qr_type || 'STATIS';
  const dynamic_amount = data.dynamic_amount != null ? Number(data.dynamic_amount) : null;

  if (pool) {
    await ensureSchema();
    try {
      const res = await pool.query(
        `INSERT INTO merchants (
          nmid, name, city, latitude, longitude, wa_number,
          security_mode, zone_category, radius_meters,
          qr_type, dynamic_amount, owner_nik, business_description,
          store_photo_url, product_photo_url,
          is_active, is_auto_registered, created_at, updated_at
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, TRUE, $16, NOW(), NOW())
         RETURNING *`,
        [
          data.nmid,
          data.name,
          city,
          data.latitude,
          data.longitude,
          data.wa_number || null,
          security_mode,
          zone_category,
          radius_meters,
          qr_type,
          dynamic_amount,
          data.owner_nik || null,
          data.business_description || null,
          data.store_photo_url || null,
          data.product_photo_url || null,
          !!data.is_auto_registered,
        ]
      );
      return mapMerchantRow(res.rows[0]);
    } catch (err: any) {
      console.error('[DB Insert Error]:', err);
      throw new Error(`Gagal menyimpan merchant ke database: ${err.message}`);
    }
  }

  const mem = getMemoryMerchants();
  const newMerchant: Merchant = {
    id: mem.length > 0 ? Math.max(...mem.map(m => m.id)) + 1 : 1,
    nmid: data.nmid,
    name: data.name,
    city,
    latitude: Number(data.latitude),
    longitude: Number(data.longitude),
    wa_number: data.wa_number || null,
    security_mode,
    zone_category,
    radius_meters,
    qr_type,
    dynamic_amount,
    owner_nik: data.owner_nik || null,
    business_description: data.business_description || null,
    store_photo_url: data.store_photo_url || null,
    product_photo_url: data.product_photo_url || null,
    is_active: true,
    is_auto_registered: !!data.is_auto_registered,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mem.push(newMerchant);
  return newMerchant;
}

/**
 * Delete / deactivate merchant
 */
export async function deleteMerchant(id: number): Promise<boolean> {
  if (pool) {
    try {
      await pool.query('DELETE FROM merchants WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.error('[DB Delete Error, using memory fallback]:', err);
    }
  }

  const mem = getMemoryMerchants();
  const index = mem.findIndex(m => m.id === id);
  if (index !== -1) {
    mem.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Update merchant details (e.g. WhatsApp number, mode, radius)
 */
export async function updateMerchant(
  id: number,
  data: {
    wa_number?: string | null;
    name?: string;
    latitude?: number;
    longitude?: number;
    security_mode?: SecurityMode;
    zone_category?: ZoneCategory;
    radius_meters?: number;
  }
): Promise<Merchant | null> {
  if (pool) {
    try {
      const res = await pool.query(
        `UPDATE merchants
         SET wa_number = COALESCE($2, wa_number),
             name = COALESCE($3, name),
             latitude = COALESCE($4, latitude),
             longitude = COALESCE($5, longitude),
             security_mode = COALESCE($6, security_mode),
             zone_category = COALESCE($7, zone_category),
             radius_meters = COALESCE($8, radius_meters),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, data.wa_number, data.name, data.latitude, data.longitude, data.security_mode, data.zone_category, data.radius_meters]
      );
      if (res.rows.length > 0) return mapMerchantRow(res.rows[0]);
    } catch (err) {
      console.error('[DB Update Error, using memory fallback]:', err);
    }
  }

  const mem = getMemoryMerchants();
  const idx = mem.findIndex(m => m.id === id);
  if (idx !== -1) {
    if (data.wa_number !== undefined) mem[idx].wa_number = data.wa_number;
    if (data.name !== undefined) mem[idx].name = data.name;
    if (data.latitude !== undefined) mem[idx].latitude = data.latitude;
    if (data.longitude !== undefined) mem[idx].longitude = data.longitude;
    if (data.security_mode !== undefined) mem[idx].security_mode = data.security_mode;
    if (data.zone_category !== undefined) mem[idx].zone_category = data.zone_category;
    if (data.radius_meters !== undefined) mem[idx].radius_meters = data.radius_meters;
    mem[idx].updated_at = new Date().toISOString();
    return mem[idx];
  }
  return null;
}

/**
 * Log incident to audit table
 */
export async function logIncident(data: {
  nmid_scanned: string;
  merchant_name: string;
  status: string;
  color: string;
  reason?: string;
  fuzzy_score?: number;
  latitude?: number;
  longitude?: number;
  distance_meters?: number;
  gps_available?: boolean;
  raw_payload?: string;
}): Promise<IncidentLog> {
  if (pool) {
    try {
      const res = await pool.query(
        `INSERT INTO incident_logs (nmid_scanned, merchant_name, status, color, reason, fuzzy_score, latitude, longitude, distance_meters, gps_available, raw_payload, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         RETURNING *`,
        [
          data.nmid_scanned,
          data.merchant_name,
          data.status,
          data.color,
          data.reason || null,
          data.fuzzy_score != null ? Math.round(data.fuzzy_score) : null,
          data.latitude || null,
          data.longitude || null,
          data.distance_meters || null,
          data.gps_available ?? false,
          data.raw_payload || null,
        ]
      );
      return res.rows[0];
    } catch (err) {
      console.error('[DB LogIncident Error, using memory fallback]:', err);
    }
  }

  const incidents = getMemoryIncidents();
  const log: IncidentLog = {
    id: incidents.length + 1,
    nmid_scanned: data.nmid_scanned,
    merchant_name: data.merchant_name,
    status: data.status as any,
    color: data.color as any,
    reason: data.reason,
    fuzzy_score: data.fuzzy_score,
    latitude: data.latitude,
    longitude: data.longitude,
    distance_meters: data.distance_meters,
    gps_available: data.gps_available,
    raw_payload: data.raw_payload,
    created_at: new Date().toISOString(),
  };
  incidents.unshift(log);
  return log;
}

/**
 * Get incident logs
 */
export async function getIncidentLogs(limit: number = 50): Promise<IncidentLog[]> {
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM incident_logs ORDER BY created_at DESC LIMIT $1', [limit]);
      return res.rows;
    } catch (err) {
      console.error('[DB getIncidentLogs Error, using memory fallback]:', err);
    }
  }

  return getMemoryIncidents().slice(0, limit);
}

function mapMerchantRow(row: any): Merchant {
  return {
    id: row.id,
    nmid: row.nmid,
    name: row.name,
    city: row.city || 'BANDUNG',
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    wa_number: row.wa_number,
    security_mode: row.security_mode || 'OPEN_ZONE',
    zone_category: row.zone_category || 'UMKM',
    radius_meters: row.radius_meters != null ? parseInt(row.radius_meters, 10) : 20,
    qr_type: row.qr_type || 'STATIS',
    dynamic_amount: row.dynamic_amount != null ? parseFloat(row.dynamic_amount) : null,
    owner_nik: row.owner_nik || null,
    business_description: row.business_description || null,
    store_photo_url: row.store_photo_url || null,
    product_photo_url: row.product_photo_url || null,
    is_active: row.is_active,
    is_auto_registered: row.is_auto_registered,
    created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
  };
}

/**
 * Check if user coordinates fall inside any active EXCLUSIVE_STATIC / EXCLUSIVE_ZONE merchant zone,
 * and whether the scanned NMID conflicts with that exclusive merchant.
 */
export async function checkExclusiveZoneCollision(
  userLat: number | null | undefined,
  userLon: number | null | undefined,
  scannedNmid: string
): Promise<{
  hasCollision: boolean;
  exclusiveMerchant?: Merchant;
  distanceMeters?: number;
}> {
  if (userLat == null || userLon == null || isNaN(Number(userLat)) || isNaN(Number(userLon))) {
    return { hasCollision: false };
  }

  const allMerchants = await getAllMerchants();
  const exclusiveMerchants = allMerchants.filter(
    m => m.is_active && (m.security_mode === 'EXCLUSIVE_STATIC' || m.security_mode === 'EXCLUSIVE_ZONE')
  );

  for (const em of exclusiveMerchants) {
    const dist = haversineDistanceMeters(Number(userLat), Number(userLon), em.latitude, em.longitude);
    const radius = em.radius_meters || 50;

    if (dist <= radius) {
      // User is physically inside the protected perimeter of an exclusive zone!
      // If the scanned NMID is NOT this exclusive merchant, it is a rogue QR violation!
      if (em.nmid !== scannedNmid) {
        return {
          hasCollision: true,
          exclusiveMerchant: em,
          distanceMeters: Math.round(dist),
        };
      }
    }
  }

  return { hasCollision: false };
}

/**
 * Check if given coordinates fall inside any existing active EXCLUSIVE_STATIC / EXCLUSIVE_ZONE merchant zone.
 * Zero-Tolerance policy: strictly forbids registering any other merchant inside an exclusive static perimeter.
 */
export async function checkRegistrationCollision(
  lat: number | null | undefined,
  lon: number | null | undefined,
  excludeMerchantId?: number
): Promise<{
  hasCollision: boolean;
  exclusiveMerchant?: Merchant;
  distanceMeters?: number;
}> {
  if (lat == null || lon == null || isNaN(Number(lat)) || isNaN(Number(lon))) {
    return { hasCollision: false };
  }

  const allMerchants = await getAllMerchants();
  const exclusiveMerchants = allMerchants.filter(
    m => m.is_active && (m.security_mode === 'EXCLUSIVE_STATIC' || m.security_mode === 'EXCLUSIVE_ZONE') && (excludeMerchantId ? m.id !== excludeMerchantId : true)
  );

  for (const em of exclusiveMerchants) {
    const dist = haversineDistanceMeters(Number(lat), Number(lon), em.latitude, em.longitude);
    const radius = em.radius_meters || 50;

    // Strict 0-Meter Cutoff: if dist <= radius, collision!
    if (dist <= radius) {
      return {
        hasCollision: true,
        exclusiveMerchant: em,
        distanceMeters: Math.round(dist),
      };
    }
  }

  return { hasCollision: false };
}
