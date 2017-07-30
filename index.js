/* global AFRAME THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var degToRad = THREE.Math.degToRad;
var almostEqual = require('almost-equal');
/**
 * Linear Interpolation component for A-Frame.
 */
AFRAME.registerComponent('lerp', {
  schema: {
    properties: { default: ['position', 'rotation', 'scale']},
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    var el = this.el;
    this.lastPosition = el.getAttribute('position');
    this.lastRotation = el.getAttribute('rotation');
    this.lastScale = el.getAttribute('scale');

    this.lerpingPosition = false;
    this.lerpingRotation = false;
    this.lerpingScale = false;

    this.timeOfLastUpdate = 0;
  },

  /**
   * Called on each scene tick.
   */
  tick: function (time, deltaTime) {
    var progress;
    var now = this.now();
    var obj3d = this.el.object3D;

    this.checkForComponentChanged();

    // Lerp position
    if (this.lerpingPosition) {
      progress = (now - this.startLerpTimePosition) / this.duration;
      obj3d.position.lerpVectors(this.startPosition, this.targetPosition, progress);
      // console.log("new position", obj3d.position);
      if (progress >= 1) {
        this.lerpingPosition = false;
      }
    }

    // Slerp rotation
    if (this.lerpingRotation) {
      progress = (now - this.startLerpTimeRotation) / this.duration;
      THREE.Quaternion.slerp(this.startRotation, this.targetRotation, obj3d.quaternion, progress);
      if (progress >= 1) {
        this.lerpingRotation = false;
      }
    }

    // Lerp scale
    if (this.lerpingScale) {
      progress = (now - this.startLerpTimeScale) / this.duration;
      obj3d.scale.lerpVectors(this.startScale, this.targetScale, progress);
      if (progress >= 1) {
        this.lerpingScale = false;
      }
    }
  },

  checkForComponentChanged: function() {
    var el = this.el;

    var hasChanged = false;

    var newPosition = el.getAttribute('position');
    if (this.isLerpable('position') && !this.almostEqualVec3(this.lastPosition, newPosition)) {
      this.toPosition(this.lastPosition, newPosition);
      this.lastPosition = newPosition;
      hasChanged = true;
    }

    var newRotation = el.getAttribute('rotation');
    if (this.isLerpable('rotation') && !this.almostEqualVec3(this.lastRotation, newRotation)) {
      this.toRotation(this.lastRotation, newRotation);
      this.lastRotation = newRotation;
      hasChanged = true;
    }

    var newScale = el.getAttribute('scale');
    if (this.isLerpable('scale') && !this.almostEqualVec3(this.lastScale, newScale)) {
      this.toScale(this.lastScale, newScale);
      this.lastScale = newScale;
      hasChanged = true;
    }

    if (hasChanged) {
      this.updateDuration();
    }
  },

  isLerpable: function(name) {
    return this.data.properties.indexOf(name) != -1
  },

  updateDuration: function() {
    var now = this.now();
    this.duration = now - this.timeOfLastUpdate;
    this.timeOfLastUpdate = now;
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

  almostEqualVec3: function(a, b) {
    return almostEqual(a.x, b.x) && almostEqual(a.y, b.y) && almostEqual(a.z, b.z);
  },

  /**
   * Returns the current time in milliseconds (ms)
   */
  now: function() {
    return Date.now();
  }
});
