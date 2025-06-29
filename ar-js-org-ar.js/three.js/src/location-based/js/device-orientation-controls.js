import * as THREE from "three";

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

/* NOTE that this is a modified version of THREE.DeviceOrientationControls to
 * allow exponential smoothing.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */

const DeviceOrientationControls = function (object, options) {
  const scope = this;

  this.object = object;
  this.object.rotation.reorder("YXZ");

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = options?.smoothingFactor || 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;
  this.EPS = 0.000001;

  const onDeviceOrientationChangeEvent = function (event) {
    scope.deviceOrientation = event;
  };

  const onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  const setObjectQuaternion = (function () {
    const zee = new THREE.Vector3(0, 0, 1);

    const euler = new THREE.Euler();

    const q0 = new THREE.Quaternion();

    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  })();

  this.connect = function () {
    onScreenOrientationChangeEvent(); // run once on load

    // iOS 13+

    if (
      window.DeviceOrientationEvent !== undefined &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      window.DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            window.addEventListener(
              "orientationchange",
              onScreenOrientationChangeEvent,
              false,
            );
            window.addEventListener(
              "deviceorientation",
              onDeviceOrientationChangeEvent,
              false,
            );
          }
        })
        .catch(function (error) {
          console.error("THREE.DeviceOrientationControls: ", error);
        });
    } else {
      window.addEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent,
        false,
      );
      window.addEventListener(
        "deviceorientation",
        onDeviceOrientationChangeEvent,
        false,
      );
    }

    scope.enabled = true;
  };

  this.disconnect = function () {
    window.removeEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false,
    );
    window.removeEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false,
    );

    scope.enabled = false;
  };

  this.update = function () {
    if (scope.enabled === false) return;

    const device = scope.deviceOrientation;

    if (device) {
      let alpha = device.alpha
        ? THREE.MathUtils.degToRad(device.alpha) + scope.alphaOffset
        : 0; // Z

      let beta = device.beta ? THREE.MathUtils.degToRad(device.beta) : 0; // X'

      let gamma = device.gamma ? THREE.MathUtils.degToRad(device.gamma) : 0; // Y''

      const orient = scope.screenOrientation
        ? THREE.MathUtils.degToRad(scope.screenOrientation)
        : 0; // O

      // NW Added smoothing code
      const k = this.smoothingFactor;

      if (this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
        beta = this._getSmoothedAngle(
          beta + Math.PI,
          this.lastOrientation.beta,
          k,
        );
        gamma = this._getSmoothedAngle(
          gamma + this.HALF_PI,
          this.lastOrientation.gamma,
          k,
          Math.PI,
        );
      } else {
        beta += Math.PI;
        gamma += this.HALF_PI;
      }

      this.lastOrientation = {
        alpha: alpha,
        beta: beta,
        gamma: gamma,
      };
      setObjectQuaternion(
        scope.object.quaternion,
        alpha,
        beta - Math.PI,
        gamma - this.HALF_PI,
        orient,
      );
    }
  };

  // NW Added
  this._orderAngle = function (a, b, range = this.TWO_PI) {
    if (
      (b > a && Math.abs(b - a) < range / 2) ||
      (a > b && Math.abs(b - a) > range / 2)
    ) {
      return { left: a, right: b };
    } else {
      return { left: b, right: a };
    }
  };

  // NW Added
  this._getSmoothedAngle = function (a, b, k, range = this.TWO_PI) {
    const angles = this._orderAngle(a, b, range);
    const angleshift = angles.left;
    const origAnglesRight = angles.right;
    angles.left = 0;
    angles.right -= angleshift;
    if (angles.right < 0) angles.right += range;
    let newangle =
      origAnglesRight == b
        ? (1 - k) * angles.right + k * angles.left
        : k * angles.right + (1 - k) * angles.left;
    newangle += angleshift;
    if (newangle >= range) newangle -= range;
    if (newangle < 0) newangle += range; // modulo for negative numbers
    return newangle;
  };

  this.dispose = function () {
    scope.disconnect();
  };

  this.connect();
};

export default DeviceOrientationControls;
