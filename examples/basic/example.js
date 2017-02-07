var def = document.querySelector('#default');
var lerp = document.querySelector('#lerp');

var direction = 1; // -1 for left, 1 for right
var speed = 1;
var updateRate = 5;
var timeToChangeDirection = 1500;

var moveInDirection = function() {
  var defPosition = def.getAttribute('position');
  var lerpPosition = lerp.getAttribute('position');
  var x = defPosition.x;
  var newX = x + direction * speed;

  defPosition.x = newX;
  lerpPosition.x = newX;

  def.setAttribute('position', defPosition);
  lerp.setAttribute('position', lerpPosition);
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