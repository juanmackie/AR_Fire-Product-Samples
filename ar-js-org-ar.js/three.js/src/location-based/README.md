# Location Based for three.js

This is the location based feature for three.js.

It can be imported as a module, or as a global variable.

## Module

```javascript
import { LocationBased, DeviceOrientationControls } from 'ar.js/three.js/build/ar-threex-location-only.js';
// or
import { LocationBased, DeviceOrientationControls } from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';

const locationBased = new LocationBased(scene, camera);
const deviceOrientationControls = new DeviceOrientationControls(camera);

// ...

function animate() {
    requestAnimationFrame(animate);
    deviceOrientationControls.update(); // important!
    renderer.render(scene, camera);
}
```

## Global variable

```html
<script src="https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex-location-only.js"></script>
<script>
    const locationBased = new THREEx.LocationBased(scene, camera);
    const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

    // ...

    function animate() {
        requestAnimationFrame(animate);
        deviceOrientationControls.update(); // important!
        renderer.render(scene, camera);
    }
</script>
```

## API

### LocationBased

#### Constructor

`new LocationBased(scene, camera, options)`

- `scene`: THREE.Scene
- `camera`: THREE.Camera
- `options`: Object
    - `initialPositionAsOrigin`: Boolean (default: `false`). If `true`, the initial GPS position is used as the origin of the world. If `false`, the origin is at `0,0` latitude/longitude.

#### Methods

- `startGps()`: Start GPS tracking.
- `stopGps()`: Stop GPS tracking.
- `fakeGps(longitude, latitude, altitude)`: Fake GPS position. `altitude` is optional.
- `setGpsOptions(options)`: Set GPS options.
    - `options`: Object
        - `gpsMinAccuracy`: Number (default: `100`). Minimum accuracy in meters for GPS position.
        - `gpsMinDistance`: Number (default: `0`). Minimum distance in meters to trigger a GPS position update.
        - `maximumAge`: Number (default: `0`). Maximum age in milliseconds for a GPS position.
- `add(object, longitude, latitude, altitude)`: Add an object to the scene at a given GPS position. `altitude` is optional.
- `setElevation(elevation)`: Set the elevation of the camera. Default is `0`.
- `lonLatToWorldCoords(longitude, latitude)`: Convert longitude/latitude to world coordinates.
- `on(event, callback)`: Add an event listener.
    - `event`: String. Event name.
        - `gpsupdate`: Fired when GPS position is updated. Callback receives an object with `coords` property, which is a GeolocationCoordinates object.
        - `gpserror`: Fired when there is an error with GPS. Callback receives an error code (1, 2 or 3).
- `setWorldPosition(object, longitude, latitude, altitude)`: Set the world position of an object given its GPS coordinates. `altitude` is optional.

### DeviceOrientationControls

#### Constructor

`new DeviceOrientationControls(object, options)`

- `object`: THREE.Object3D. The object to control (usually the camera).
- `options`: Object
    - `smoothingFactor`: Number (default: `1`). Smoothing factor for device orientation. `1` means no smoothing.

#### Methods

- `update()`: Update the object's orientation. Call this in your animation loop.
- `connect()`: Start listening to device orientation events.
- `disconnect()`: Stop listening to device orientation events.

---

For more details, please check the [official documentation](https://ar-js-org.github.io/AR.js-Docs/location-based/).
Also, check the [examples](../../examples/location-based/).
