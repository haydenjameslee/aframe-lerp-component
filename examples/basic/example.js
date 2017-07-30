var def = document.querySelector('#default');
var lerp = document.querySelector('#lerp');

var direction = 1; // -1 for left, 1 for right
var speed = 1;
var updateRate = 5;
var timeToChangeDirection = 1000;

var moveInDirection = function() {
  var defPosition = def.getAttribute('position');
  var x = defPosition.x;
  var newX = x + direction * speed;

  defPosition.x = newX;
  def.setAttribute('position', defPosition);

  var lerpPosition = lerp.getAttribute('position');
  var newLerpPos = {
    x: newX,
    y: lerpPosition.y,
    z: lerpPosition.z
  };
  lerp.setAttribute('position', newLerpPos);
};

var changeDirection = function() {
  if (direction > 0) {
    direction = -1;
  } else {
    direction = 1;
  }
};

setInterval(moveInDirection, 1000 / updateRate);
setInterval(changeDirection, timeToChangeDirection);