export interface GeoPositionResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface GeolocationErrorResult {
  code: number;
  message: string;
  isPermissionDenied: boolean;
}

/**
 * Requests device GPS coordinates via standard navigator.geolocation API
 */
export const captureCurrentGpsPosition = (): Promise<GeoPositionResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by your current browser.',
        isPermissionDenied: false,
      } as GeolocationErrorResult);
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Number(pos.coords.accuracy.toFixed(1)),
          timestamp: new Date(pos.timestamp).toISOString(),
        });
      },
      (err) => {
        reject({
          code: err.code,
          message: err.message,
          isPermissionDenied: err.code === err.PERMISSION_DENIED,
        } as GeolocationErrorResult);
      },
      options
    );
  });
};

/**
 * Calculates straight line distance in km between two GPS coordinates (Haversine Formula)
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};
