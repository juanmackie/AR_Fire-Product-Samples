/**
 * SphericalMercator Gps projection.
 *
 * Original code from https://github.com/makinacorpus/Leaflet.TextPath/blob/master/leaflet.textpath.js#L193
 * and https://github.com/CloudMade/Leaflet/blob/master/src/geo/projection/Projection.SphericalMercator.js
 *
 * Thanks to the original authors.
 */

const SphMercProjection = {
  R: 6378137,
  MAX_LATITUDE: 85.0511287798,

  project: function (lon, lat) {
    const d = Math.PI / 180,
      max = this.MAX_LATITUDE,
      saneLat = Math.max(Math.min(max, lat), -max),
      x = this.R * lon * d,
      y = this.R * Math.log(Math.tan(Math.PI / 4 + (saneLat * d) / 2));

    return [x, y];
  },

  unproject: function (x, y) {
    const d = 180 / Math.PI;

    return [
      x * d / this.R,
      (2 * Math.atan(Math.exp(y / this.R)) - Math.PI / 2) * d,
    ];
  },

  bounds: (function () {
    const d = this.R * Math.PI;
    return [-d, -d, d, d];
  })(),
};

export { SphMercProjection };
