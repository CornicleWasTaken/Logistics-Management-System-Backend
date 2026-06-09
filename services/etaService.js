import { getDistance } from "geolib";

/**
 * Compute ETA given current coordinates and route geometry or destination.
 * @param {Object} opts
 * @param {[number, number]} opts.currentCoords - [lng, lat]
 * @param {Object} [opts.routeGeoJSON] - GeoJSON LineString with coordinates [[lng,lat], ...]
 * @param {number} [opts.speedKmph] - speed in km/h
 * @returns {Date|null} estimated arrival Date or null if cannot compute
 */
export function computeEta({ currentCoords, routeGeoJSON, speedKmph }) {
  if (!currentCoords) return null;

  // determine destination coordinate
  let dest = null;

  if (routeGeoJSON && Array.isArray(routeGeoJSON.coordinates) && routeGeoJSON.coordinates.length > 0) {
    const last = routeGeoJSON.coordinates[routeGeoJSON.coordinates.length - 1];
    // last is [lng, lat]
    dest = { latitude: last[1], longitude: last[0] };
  }

  if (!dest) return null;

  const current = { latitude: currentCoords[1], longitude: currentCoords[0] };

  // distance in meters
  const remainingMeters = getDistance(current, dest);

  // default speed 50 km/h
  const speed = speedKmph && speedKmph > 0 ? speedKmph : 50;

  // convert km/h to m/s: km/h * 1000 / 3600
  const speedMs = (speed * 1000) / 3600;

  if (speedMs <= 0) return null;

  const seconds = remainingMeters / speedMs;

  const eta = new Date(Date.now() + Math.round(seconds * 1000));

  return eta;
}

export default { computeEta };
