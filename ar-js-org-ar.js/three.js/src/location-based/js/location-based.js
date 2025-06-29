import * as THREE from "three";
import { SphMercProjection } from "./sphmerc-projection.js";

/**
 * Location-based AR for three.js
 *
 * Creates a THREE.Group that contains the camera and a THREE.Group for POI objects.
 * Handles the controls and the positioning of the POIs
 *
 * @param {THREE.Scene} scene The THREE.js scene
 * @param {THREE.Camera} camera The THREE.js camera
 */
class LocationBased {
  constructor(scene, camera, options = {}) {
    this._scene = scene;
    this._camera = camera;
    this._projection = new SphMercProjection();
    this._eventHandlers = {}; // to store event handlers
    this._gpsMinAccuracy = options.gpsMinAccuracy || 100;
    this._gpsMinDistance = options.gpsMinDistance || 0;
    this._maximumAge = options.maximumAge || 0;
    this._watchPositionId = null;
    this._pois = new THREE.Group();
    this._pois.name = "pois";
    this._scene.add(this._pois);
    this._initialPositionAsOrigin = options.initialPositionAsOrigin || false;
    this._isStarted = false;
  }

  /**
   * Start GPS tracking
   */
  startGps() {
    if (this._watchPositionId !== null) {
      console.warn("GPS tracking already started.");
      return;
    }

    if (!navigator.geolocation) {
      this._emit("gpserror", 0); // PositionError.POSITION_UNAVAILABLE
      return;
    }

    this._watchPositionId = navigator.geolocation.watchPosition(
      (position) => {
        if (!this._isStarted) {
          // when the GPS is started, the first position is used as the origin
          if (this._initialPositionAsOrigin) {
            this.setWorldOrigin(
              position.coords.longitude,
              position.coords.latitude,
            );
          } else {
            this.setWorldOrigin(0, 0); // no origin, all positions are absolute
          }
          this._isStarted = true;
        }
        this._updatePosition(position);
      },
      (error) => {
        this._emit("gpserror", error.code);
      },
      {
        enableHighAccuracy: true,
        maximumAge: this._maximumAge,
      },
    );
  }

  /**
   * Stop GPS tracking
   */
  stopGps() {
    if (this._watchPositionId === null) {
      console.warn("GPS tracking not started.");
      return;
    }

    navigator.geolocation.clearWatch(this._watchPositionId);
    this._watchPositionId = null;
    this._isStarted = false;
  }

  /**
   * Simulate GPS position
   * @param {number} longitude
   * @param {number} latitude
   * @param {number} altitude
   */
  fakeGps(longitude, latitude, altitude) {
    if (this._initialPositionAsOrigin) {
      this.setWorldOrigin(longitude, latitude);
    } else {
      this.setWorldOrigin(0, 0); // no origin, all positions are absolute
    }
    this._updatePosition({
      coords: {
        longitude: longitude,
        latitude: latitude,
        altitude: altitude || null, // altitude is optional
        accuracy: 0, // no accuracy for fake GPS
      },
    });
  }

  /**
   * Set GPS options
   * @param {object} options
   * @param {number} options.gpsMinAccuracy Minimum accuracy in meters for GPS position
   * @param {number} options.gpsMinDistance Minimum distance in meters to trigger a GPS position update
   * @param {number} options.maximumAge Maximum age in milliseconds for a GPS position
   */
  setGpsOptions(options) {
    if (options.gpsMinAccuracy) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
    if (options.gpsMinDistance) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.maximumAge) {
      this._maximumAge = options.maximumAge;
    }
  }

  /**
   * Add an object to the scene at a given GPS position
   * @param {THREE.Object3D} object The object to add
   * @param {number} longitude The longitude of the object
   * @param {number} latitude The latitude of the object
   * @param {number} altitude The altitude of the object (optional)
   */
  add(object, longitude, latitude, altitude) {
    this.setWorldPosition(object, longitude, latitude, altitude);
    this._pois.add(object);
  }

  /**
   * Set the elevation of the camera
   * @param {number} elevation The elevation of the camera
   */
  setElevation(elevation) {
    this._camera.position.y = elevation;
  }

  /**
   * Convert longitude/latitude to world coordinates
   * @param {number} longitude
   * @param {number} latitude
   * @returns {number[]} [x, z] world coordinates
   */
  lonLatToWorldCoords(longitude, latitude) {
    const projectedPos = this._projection.project(longitude, latitude);
    return [projectedPos[0] - this._origin[0], projectedPos[1] - this._origin[1]];
  }

  /**
   * Add an event listener
   * @param {string} event The event name
   * @param {function} callback The callback function
   */
  on(event, callback) {
    if (!this._eventHandlers[event]) {
      this._eventHandlers[event] = [];
    }
    this._eventHandlers[event].push(callback);
  }

  /**
   * Update the camera position and POIs based on the GPS position
   * @param {GeolocationPosition} position The GPS position
   * @private
   */
  _updatePosition(position) {
    if (position.coords.accuracy > this._gpsMinAccuracy) {
      this._emit("gpserror", 2); // PositionError.POSITION_UNAVAILABLE
      return;
    }

    if (
      this._lastPosition &&
      this._lastPosition.longitude === position.coords.longitude &&
      this._lastPosition.latitude === position.coords.latitude &&
      this._lastPosition.altitude === position.coords.altitude
    ) {
      return; // no change
    }

    if (
      this._lastPosition &&
      this.calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        this._lastPosition.latitude,
        this._lastPosition.longitude,
      ) < this._gpsMinDistance
    ) {
      return; // not enough distance moved
    }

    this._lastPosition = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
      altitude: position.coords.altitude,
    };

    const [x, z] = this.lonLatToWorldCoords(
      position.coords.longitude,
      position.coords.latitude,
    );
    this._camera.position.x = x;
    this._camera.position.z = -z; // negative z is forward in three.js

    if (position.coords.altitude !== null) {
      this._camera.position.y = position.coords.altitude;
    }

    this._emit("gpsupdate", position);
  }

  /**
   * Set the world origin to a given GPS position
   * @param {number} longitude
   * @param {number} latitude
   * @private
   */
  setWorldOrigin(longitude, latitude) {
    this._origin = this._projection.project(longitude, latitude);
    this.initialPosition = { longitude, latitude };
  }

  /**
   * Set the world position of an object given its GPS coordinates
   * @param {THREE.Object3D} object The object to position
   * @param {number} longitude The longitude of the object
   * @param {number} latitude The latitude of the object
   * @param {number} altitude The altitude of the object (optional)
   */
  setWorldPosition(object, longitude, latitude, altitude) {
    const [x, z] = this.lonLatToWorldCoords(longitude, latitude);
    object.position.x = x;
    object.position.z = -z; // negative z is forward in three.js
    if (altitude !== undefined) {
      object.position.y = altitude;
    }
  }

  /**
   * Calculate the distance between two GPS positions
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {number} The distance in meters
   * @private
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }

  /**
   * Emit an event
   * @param {string} event The event name
   * @param  {...any} args The event arguments
   * @private
   */
  _emit(event, ...args) {
    if (this._eventHandlers[event]) {
      this._eventHandlers[event].forEach((callback) => {
        callback(...args);
      });
    }
  }
}

export default LocationBased;
