export interface GeofenceResult {
  inRange: boolean;
  distanceMeters: number;
  locationCheck: 'MATCH' | 'MISMATCH' | 'SKIPPED';
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Calculate the great-circle distance between two GPS coordinates
 * using the Haversine formula.
 */
export const haversineDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6_371_000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if user coordinates are within geofence radius.
 */
export const checkGeofence = (
  userLat: number | null | undefined,
  userLon: number | null | undefined,
  merchantLat: number,
  merchantLon: number,
  radiusMeters: number = 20 // Default 20m as per mobile app & hackathon demo
): GeofenceResult => {
  if (userLat == null || userLon == null || isNaN(userLat) || isNaN(userLon)) {
    return {
      inRange: true, // Degraded
      distanceMeters: 0,
      locationCheck: 'SKIPPED',
    };
  }

  const distance = haversineDistanceMeters(userLat, userLon, merchantLat, merchantLon);
  const roundedDist = Math.round(distance * 10) / 10;
  const inRange = roundedDist <= radiusMeters;

  return {
    inRange,
    distanceMeters: roundedDist,
    locationCheck: inRange ? 'MATCH' : 'MISMATCH',
  };
};
