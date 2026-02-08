// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;      // use color
    } else if (u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);   // use UV Debug color
    } else if (u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);   // use texture0
    } else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);   // use second texture 
    } else{
      gl_FragColor = vec4(1,.2,.2,1);   // error, put red  
    }
  }`

// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  //block animal Q1
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  //u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  //if (!u_Size) {
  //  console.log('Failed to get the storage location of u_Size');
  //  return;
  //}
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // set initial val of matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements)
}

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
// global variables related to UI elements
let g_selectedColor=[1.0, 0.0, 0.0, 1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_selectedSegment=10;
let g_globalAngle=5;
let g_headSlide=0;
let g_neck=-15;
let g_beak=0;
let g_wingR=0;
let g_wingL=0;
let g_animation=false;
let g_shift_click=false;
let g_pos=[0,0];

// setup actions for HTML UI elements
function addActionsForHtmlUI(){

  //attemp at rotating by dragging on canvas
  //document.getElementById('webgl').addEventListener('mousedown', function() {g_click_down = true;});
  document.getElementById('webgl').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_pos = convertCoordinatesEventToGL(ev)};});
  document.getElementById('webgl').addEventListener('click', function(ev) {if(ev.shiftKey){g_shift_click = true;}else{g_shift_click = false;}});

  // size slider event
  //document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;});
  //document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegment = this.value;});

  // animation on/off
  document.getElementById('animationON').onclick = function() {g_animation = true;};
  document.getElementById('animationOFF').onclick = function() {g_animation = false;};
  //beak
  document.getElementById('beakSlide').addEventListener('mousemove', function() {g_beak = this.value; renderAllShapes();});
  //test (aka: neck)
  document.getElementById('testSlide').addEventListener('mousemove', function() {g_neck = this.value; renderAllShapes();});
  //head
  document.getElementById('headSlide').addEventListener('mousemove', function() {g_headSlide = this.value; renderAllShapes();});
  //camera
  document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
  //
  //RIGHT WING
  document.getElementById('wingRSlide').addEventListener('mousemove', function() {g_wingR = this.value; renderAllShapes();});
  document.getElementById('wingLSlide').addEventListener('mousemove', function() {g_wingL = this.value; renderAllShapes();});
  // my picture
  //document.getElementById('pictureButton').onclick = function() {drawPicture();};
}

function initTextures(){
  //var texture = gl.createTexture();
  //if(!texture){
  //  console.log('Failed to create the texture object');
  //  return false;
  //}

  //var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0')
  //if(!u_Sampler0){
  //  console.log('Failed to get storage location of u_Sampler');
  //  return false;
  //}

  var image1 = new Image();
  if(!image1){
    console.log('Failed to create the image object');
    return false;
  }

  var image2 = new Image();
  if(!image2){
    console.log('Failed to create the image object');
    return false;
  }

  image1.onload = function(){ sendImageToTEXTURE0(image1, u_Sampler0, 0);};
  image1.src = 'stone.jpg';

  image2.onload = function(){ sendImageToTEXTURE0(image2, u_Sampler1, 1);};
  image2.src = 'plank.jpg';

  return true;
}

function sendImageToTEXTURE0(image, sampler, n){
  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  //flip image y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  //enable texture unit0
  if (n == 0){
    gl.activeTexture(gl.TEXTURE0);
  }
  else {
    gl.activeTexture(gl.TEXTURE1);
  }
  //bind texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  //set texture param
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //set texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  //set texture0 to sampler
  gl.uniform1i(sampler, n);
  //gl.uniform1i(u_Sampler1, 1);
  console.log('finished loadTexture');

}

function main() {
  
  // setup canvas and gl variables
  setupWebGL();
  // setup shaders and connect GLSL variable to javascript variables
  connectVariablesToGLSL();

  // setup actions for HTML UI elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //////canvas.onmousedown = click;
  //canvas.onmousedown = function(ev){ click(ev) }; // = click //also works
  /////canvas.onmousemove = function(ev){ if(ev.buttons == 1) {click(ev)} };
  initTextures();
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

//asgn2 
function tick(){
  g_seconds=performance.now()/1000.0-g_startTime;
  //console.log(g_seconds);

  //update animation angles
  updateAnimationAngles();
  // draw everything
  renderAllShapes();

  requestAnimationFrame(tick);
}

/// this is where class used to be

var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = []; //array to store size of each point

function click(ev) {
  
  // take click event and return webGL coords
  let [x,y] = convertCoordinatesEventToGL(ev);

  // creating and storing new point
  //let point = new Triangle(); //Triangle();//Point();
  let point;
  if (g_selectedType == POINT){
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE){
    point = new Triangle();
  }
  else{
    point = new Circle();
    point.segments = g_selectedSegment;
    //console.log(g_selectedSegment);
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array
  //g_points.push([x, y]);

  //g_colors.push(g_selectedColor.slice());
  // console.log(g_selectedColor);

  //g_sizes.push(g_selectedSize);
  // Store the coordinates to g_points array
//  if (x >= 0.0 && y >= 0.0) {      // First quadrant
//    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
//  } else if (x < 0.0 && y < 0.0) { // Third quadrant
//    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
//  } else {                         // Others
//    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
//  }

  // draws all the shapes that are supposed to be on canvas
  renderAllShapes();
}

// Take the event (ev) from click and return the WebGL Coordinates
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function updateAnimationAngles(){
  if(g_animation){
    g_neck = 45*Math.sin(g_seconds);
    g_headSlide = 20*Math.cos(g_seconds);
    g_beak = Math.abs(10*Math.sin(g_seconds));
  }
  if(g_shift_click){
    g_wingL = -Math.abs(45*Math.sin(g_seconds));
    g_wingR = -Math.abs(45*Math.sin(g_seconds));
    //console.log("SUCCERSSSSSSSSS")
  }
}

// draws all the shapes that are supposed to be on canvas
function renderAllShapes(){

  //start timer
  var startTime = performance.now();

  var projMat = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_pos[0]*100, 0,1,0);
  globalRotMat.rotate(g_pos[1]*100, 1,0,0);
  //console.log(g_pos);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // NECK
  var neck = new Cube();
  neck.color = [.15*.9,.75*.9,.45*.9,1.0];
  neck.textureNum = -2;
  neck.matrix.translate(-0.05,.2,-0.0);
  neck.matrix.rotate(g_neck,1,0,0); //for slider
  neckCoord = new Matrix4(neck.matrix)
  neck.matrix.scale(0.1,0.3,0.1);
  neck.render();

  // HEAD
  var head = new Cube();
  head.color = [.15,.75,.45,1.0];
  head.textureNum = -2;
  head.matrix = new Matrix4(neckCoord);
  head.matrix.rotate(-g_headSlide,0,0,1);  //z:1  x-up down, y:left, right, z: rotate left, right
  var headCoord = new Matrix4(head.matrix)
  head.matrix.translate(-0.1,0.2,-0.2);      // 0.0 is default position y:.3 origion so to adjust back, change by .15
  head.matrix.scale(0.3,0.3,0.4);
  head.render();

  // EYES
  var eyeL = new Cube();
  eyeL.color = [0.2,0.2,0.2,1.0];
  eyeL.textureNum = -2;
  eyeL.matrix = new Matrix4(headCoord); //headCoord;
  eyeL.matrix.translate(0.2,0.35,-0.15);
  eyeL.matrix.scale(0.1,0.1,0.1);
  eyeL.render();

  var eyeR = new Cube();
  eyeR.color = [0.2,0.2,0.2,1.0];
  eyeR.textureNum = -2;
  eyeR.matrix = new Matrix4(headCoord);//headCoord2;
  eyeR.matrix.translate(-0.2,0.35,-0.15);
  eyeR.matrix.scale(0.1,0.1,0.1);
  eyeR.render();

  // BEAK
  var beakT = new Cube();
  beakT.color = [.18,.25,.18,1.0];
  beakT.textureNum = -2;
  beakT.matrix = new Matrix4(headCoord);
  beakT.matrix.rotate(g_beak,1,0,0);
  beakT.matrix.translate(-0.02,0.3,-0.6); 
  beakT.matrix.scale(0.13,0.05,0.4);
  beakT.render();

  var beakB = new Cube();
  beakB.color = [.18,.25,.18,1.0];
  beakB.textureNum = -2;
  beakB.matrix = new Matrix4(headCoord);
  beakB.matrix.rotate(-g_beak,1,0,0);
  beakB.matrix.translate(-0.02,0.248,-0.6); 
  beakB.matrix.scale(0.13,0.05,0.6);
  beakB.render();

  // TONGUE
  var tongue = new Cube();
  tongue.color = [.85,.58,.56,1.0];
  tongue.textureNum = -2;
  tongue.matrix = new Matrix4(headCoord);
  tongue.matrix.translate(0.02,0.25,-0.5999); 
  tongue.matrix.scale(0.05,0.05,0.4);
  tongue.render();

  // BODY
  var body = new Cube();
  body.color = [.15*.92,.75*.92,.45*.92,1.0];
  body.textureNum = -2;
  body.matrix.translate(-0.15,-0.48,0.3);
  body.matrix.rotate(-30,1,0,0);
  body.matrix.scale(0.32,0.8,0.4);
  body.render();

  // WINGS
  var wingL = new Cube();
  wingL.color = [.12,.65,.6,1.0];
  wingL.textureNum = -2;
  wingL.matrix.translate(-0.14,0.13,-0.07);//z n y
  wingL.matrix.rotate(180,0,0,1);
  wingL.matrix.rotate(30,1,0,0);
  wingL.matrix.rotate(g_wingL,0,0,1); 
  wingL.matrix.scale(0.15,0.85,0.4);
  wingL.render();

  var wingR = new Cube();
  wingR.color = [.12,.65,.6,1.0];
  wingR.textureNum = -2;
  wingR.matrix.translate(0.17,0.13,-0.075);
  wingR.matrix.scale(-1,1,1);
  wingR.matrix.rotate(180,0,0,1);
  wingR.matrix.rotate(30,1,0,0);   
  wingR.matrix.rotate(g_wingR,0,0,1);
  wingR.matrix.scale(0.15,0.85,0.4);
  wingR.render();

  // TAIL
  var tail = new Cube();
  tail.color = [.12,.65,.6,1.0];
  tail.textureNum = -2;
  tail.matrix.rotate(30,-30,0,1);  
  tail.matrix.translate(-.12,-0.9,0.35);
  tail.matrix.scale(0.25,0.5,0.1);
  tail.render();

  //Block World
  var block1 = new Cube();
  block1.textureNum = 0;
  block1.matrix.scale(0.3,0.3,0.3);
  block1.matrix.translate(1.8,.3, -.2);
  block1.render();

  var block2 = new Cube();
  block2.textureNum = 1;
  block2.matrix.scale(0.3,0.3,0.3);
  block2.matrix.translate(-2.5,.3, -.2);
  block2.render();

  // check time and show on website
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}