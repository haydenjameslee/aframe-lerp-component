/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('lerp component', function () {
  var component;
  var el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'lerp') { return; }
      component = el.components['lerp'];
      done();
    });
    el.setAttribute('lerp', {});
  });

  suite('toPosition', function () {

    test('sets start and target position', function () {
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };

      component.toPosition(from, to);

      assert.deepEqual(component.startPosition, new THREE.Vector3(1, 1, 1));
      assert.deepEqual(component.targetPosition, new THREE.Vector3(2, 2, 2));
    });

    test('sets start lerp time for position', function () {
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };

      component.toPosition(from, to);

      assert.approximately(component.startLerpTimePosition, Date.now(), 1);
    });

    test('sets lerping position true', function () {
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };

      component.toPosition(from, to);

      assert.isTrue(component.lerpingPosition);
    });
  });

  suite('toRotation', function () {

    test('sets start and target rotation', function () {
      var from = { x: 0, y: 0, z: 0 };
      var to = { x: 0, y: 90, z: 0 };

      component.toRotation(from, to);

      assert.deepEqual(component.startRotation, new THREE.Quaternion(0, 0, 0, 1));
      assert.deepEqual(component.targetRotation, new THREE.Quaternion(0, 0.7071067811865475, 0, 0.7071067811865476));
    });

    test('sets start lerp time for rotation', function () {
      var from = { x: 0, y: 0, z: 0 };
      var to = { x: 0, y: 90, z: 0 };

      component.toRotation(from, to);

      assert.approximately(component.startLerpTimeRotation, Date.now(), 1);
    });

    test('sets lerping rotation true', function () {
      var from = { x: 0, y: 0, z: 0 };
      var to = { x: 0, y: 90, z: 0 };

      component.toRotation(from, to);

      assert.isTrue(component.lerpingRotation);
    });
  });

  suite('toScale', function () {

    test('sets start and target position', function () {
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };

      component.toScale(from, to);

      assert.deepEqual(component.startScale, new THREE.Vector3(1, 1, 1));
      assert.deepEqual(component.targetScale, new THREE.Vector3(2, 2, 2));
    });

    test('sets start lerp time for position', function () {
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };

      component.toScale(from, to);

      assert.approximately(component.startLerpTimeScale, Date.now(), 1);
    });

    test('sets lerping position true', function () {
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };

      component.toScale(from, to);

      assert.isTrue(component.lerpingScale);
    });
  });

  suite('tick', function () {

    test('skip if not lerping', sinon.test(function () {
      var obj3d = el.object3D;

      this.spy(obj3d.position, 'copy');
      this.spy(obj3d.quaternion, 'copy');
      this.spy(obj3d.scale, 'copy');

      component.lerpingPosition = false;
      component.lerpingRotation = false;
      component.lerpingScale = false;

      component.tick();

      assert.isFalse(obj3d.position.copy.called);
      assert.isFalse(obj3d.quaternion.copy.called);
      assert.isFalse(obj3d.scale.copy.called);
    }));

    test('lerps position', sinon.test(function () {
      var obj3d = el.object3D;
      var duration = 100;
      component.data.duration = duration;
      var from = { x: 0, y: 0, z: 0 };
      var to = { x: 2, y: 2, z: 2 };
      var nowStub = this.stub(Date, 'now');

      nowStub.returns(0);
      component.toPosition(from, to);

      nowStub.returns(duration / 4);
      component.tick();

      var actual = obj3d.position;
      var expected = new THREE.Vector3(0.5,0.5,0.5);
      assert.deepEqual(actual, expected, 'Position 1/4');

      nowStub.returns(duration / 2);
      component.tick();

      actual = obj3d.position;
      expected = new THREE.Vector3(1,1,1);
      assert.deepEqual(actual, expected, 'Position 1/2');

      nowStub.returns(duration);
      component.tick();

      actual = obj3d.position;
      expected = new THREE.Vector3(2,2,2);
      assert.deepEqual(actual, expected, 'Position End');
      assert.isFalse(component.lerpingPosition);
    }));

    test('lerps rotation', sinon.test(function () {

      var assertQuaternionApprox = function(a, b, msg) {
        assert.approximately(a.x, b.x, 0.000000001, msg + ' x');
        assert.approximately(a.y, b.y, 0.000000001, msg + ' y');
        assert.approximately(a.z, b.z, 0.000000001, msg + ' z');
        assert.approximately(a.w, b.w, 0.000000001, msg + ' w');
      };

      var obj3d = el.object3D;
      var duration = 100;
      component.data.duration = duration;
      var from = { x: 0, y: 0, z: 0 };
      var to = { x: 0, y: 180, z: 0 };
      var nowStub = this.stub(Date, 'now');

      nowStub.returns(0);
      component.toRotation(from, to);

      nowStub.returns(duration / 4);
      component.tick();

      var actual = obj3d.quaternion;
      var expected = new THREE.Quaternion(0, 0.3826834323650898, 0, 0.9238795325112867);
      assertQuaternionApprox(actual, expected, 'Rotation 1/4');

      nowStub.returns(duration / 2);
      component.tick();

      actual = obj3d.quaternion;
      expected = new THREE.Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475);
      assertQuaternionApprox(actual, expected, 'Rotation 1/2');

      nowStub.returns(duration);
      component.tick();

      actual = obj3d.quaternion;
      expected = new THREE.Quaternion(0,1,0,0);
      assertQuaternionApprox(actual, expected, 'Rotation End');
      assert.isFalse(component.lerpingRotation);
    }));

    test('lerps scale', sinon.test(function () {
      var obj3d = el.object3D;
      var duration = 100;
      component.data.duration = duration;
      var from = { x: 1, y: 1, z: 1 };
      var to = { x: 2, y: 2, z: 2 };
      var nowStub = this.stub(Date, 'now');

      nowStub.returns(0);
      component.toScale(from, to);

      nowStub.returns(duration / 4);
      component.tick();

      var actual = obj3d.scale;
      var expected = new THREE.Vector3(1.25,1.25,1.25);
      assert.deepEqual(actual, expected, 'Scale 1/4');

      nowStub.returns(duration / 2);
      component.tick();

      actual = obj3d.scale;
      expected = new THREE.Vector3(1.5,1.5,1.5);
      assert.deepEqual(actual, expected, 'Scale 1/2');

      nowStub.returns(duration);
      component.tick();

      actual = obj3d.scale;
      expected = new THREE.Vector3(2,2,2);
      assert.deepEqual(actual, expected, 'Scale End');
      assert.isFalse(component.lerpingScale);
    }));


  });

  suite('now', function() {

    test('returns current time in ms', function() {
      var time = Date.now();

      var result = component.now();

      assert.approximately(result, time, 1);
    });
  });
});
