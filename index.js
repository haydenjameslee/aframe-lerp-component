/* global AFRAME THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var degToRad = THREE.Math.degToRad;

/**
 * Linear Interpolation component for A-Frame.
 */
AFRAME.registerComponent('lerp', {
  schema: {
    timeout: { type: 'int', default: 100 }, // ms
    properties: {default:['position', 'rotation', 'scale']},
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    this.lerpingPosition = false;
    this.lerpingRotation = false;
    this.lerpingScale = false;

    this.el.addEventListener('componentchanged', this.changedListener.bind(this));
  },

  /**
   * Called on each scene tick.
   */
  tick: function (time, deltaTime) {
    var progress;
    var now = this.now();
    var obj3d = this.el.object3D;

    // Lerp position
    if (this.lerpingPosition) {
      progress = (now - this.startLerpTimePosition) / this.data.timeout;
      obj3d.position.lerpVectors(this.startPosition, this.targetPosition, progress);
      if (progress >= 1) {
        this.lerpingPosition = false;
      }
    }

    // Slerp rotation
    if (this.lerpingRotation) {
      progress = (now - this.startLerpTimeRotation) / this.data.timeout;
      THREE.Quaternion.slerp(this.startRotation, this.targetRotation, obj3d.quaternion, progress);
      if (progress >= 1) {
        this.lerpingRotation = false;
      }
    }

    // Lerp scale
    if (this.lerpingScale) {
      progress = (now - this.startLerpTimeScale) / this.data.timeout;
      obj3d.scale.lerpVectors(this.startScale, this.targetScale, progress);
      if (progress >= 1) {
        this.lerpingScale = false;
      }
    }
  },

  changedListener: function(event) {
    var name = event.detail.name;
    var oldData = event.detail.oldData;
    var newData = event.detail.newData;

    if (this.data.properties.indexOf(name) == -1) {
      return;
    }

    if (name == 'position') {
      this.toPosition(oldData, newData);
    } else if (name == 'rotation') {
      this.toRotation(oldData, newData);
    } else if (name == 'scale') {
      this.toScale(oldData, newData);
    }
  },

  /**
   * Start lerp to position (vec3)
   */
  toPosition: function (from, to) {
    this.lerpingPosition = true;
    this.startLerpTimePosition = this.now();
    this.startPosition = new THREE.Vector3(from.x, from.y, from.z);
    this.targetPosition = new THREE.Vector3(to.x, to.y, to.z);
  },

  /**
   * Start lerp to euler rotation (vec3,'YXZ')
   */
  toRotation: function (from, to) {
    this.lerpingRotation = true;
    this.startLerpTimeRotation = this.now();
    this.startRotation = new THREE.Quaternion();
    this.startRotation.setFromEuler(
        new THREE.Euler(degToRad(from.x), degToRad(from.y), degToRad(from.z), 'YXZ'));
    this.targetRotation = new THREE.Quaternion();
    this.targetRotation.setFromEuler(
        new THREE.Euler(degToRad(to.x), degToRad(to.y), degToRad(to.z), 'YXZ'));
  },

  /**
   * Start lerp to scale (vec3)
   */
  toScale: function (from, to) {
    this.lerpingScale = true;
    this.startLerpTimeScale = this.now();
    this.startScale = new THREE.Vector3(from.x, from.y, from.z);
    this.targetScale = new THREE.Vector3(to.x, to.y, to.z);
  },

  /**
   * Returns the current time in milliseconds (ms)
   */
  now: function() {
    return Date.now();
  }
});
