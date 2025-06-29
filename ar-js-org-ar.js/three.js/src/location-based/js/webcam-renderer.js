import * as THREE from "three";

/**
 * initialize the WEBAR an a given previously initialized THREE.WebGLRenderer
 *
 * @param {THREE.WebGLRenderer} renderer the renderer to use
 * @param {HTMLVideoElement} video video element to use
 */
class WebAR {
  constructor(renderer, video) {
    this.renderer = renderer;
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    if (!video) {
      this.video = document.createElement("video");
      this.video.setAttribute("autoplay", true);
      this.video.setAttribute("playsinline", true);
      this.video.style.display = "none";
      document.body.appendChild(this.video);
    } else {
      this.video = video;
    }

    this.videoTexture = new THREE.VideoTexture(this.video);
    // TODO it is not possible to have linear filter with video texture
    // webgl1 only support power of 2 texture for linear filter
    // and video are rarely power of 2.
    // still investigate it with webgl2
    // videoTexture.minFilter = THREE.LinearFilter;
    // videoTexture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.constraints = {
      video: {
        facingMode: "environment",
      },
      audio: false,
    };
  }

  /**
   * start the webcam
   *
   * @param {Object} constraints the constraints to use for the webcam
   */
  start(constraints) {
    if (constraints) {
      this.constraints = constraints;
    }
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.addEventListener("loadedmetadata", () => {
            this.video.play();
            resolve();
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * stop the webcam
   */
  stop() {
    this.video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  }

  /**
   * update the scene
   */
  update() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
  }

  /**
   * resize the scene
   */
  resize() {
    // TODO
  }
}

export default WebAR;
