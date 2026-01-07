// DrawTriangle.js (c) 2012 matsuda
var canvas // the global
var ctx // the global
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  // made global
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');  // made global

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to BLACK not blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
  // let v1 = new Vector3() 
  // handleDrawEvent();
}

// function drawVector(v,color) {}
function handleDrawEvent(){
  let v1x = Number(document.getElementById("v1x").value);
  let v1y = Number(document.getElementById("v1y").value);
  console.log(v1x);
  console.log(v1y);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, 'red');

  //ctx.strokeStyle = 'red';
  //let cx = canvas.width / 2;  // canvas center on x axis
  //let cy = canvas.height / 2; // canvas center on y axis

  //ctx.beginPath();
  //ctx.moveTo(cx, cy);
  //ctx.lineTo(cx + (v1x * 20), cy - (v1y * 20));
  //ctx.stroke();

  //ctx.strokeStyle = 'blue';

}

function drawVector(vect, color){
  console.log('here');
  console.log(vect.elements[0]);
  console.log(vect.elements[1]);
  let cx = canvas.width / 2;  // canvas center on x axis
  let cy = canvas.height / 2; // canvas center on y axis
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + (vect.elements[0] * 20), cy - (vect.elements[1] * 20));
  ctx.stroke();
}