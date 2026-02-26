// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;
  uniform vec3 u_color;
  void main() {
    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    } else if (u_whichTexture == -2) {
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

    //vec3 lightVector = vec3(v_VertPos) - u_lightPos;
    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r=length(lightVector);
    //if (r < 1.0) {
    //  gl_FragColor = vec4(1,0,0,1);
    //} else if (r < 2.0){
    //  gl_FragColor = vec4(0,1,0,1); 
    //}
    //gl_FragColor= vec4(vec3(gl_FragColor)/(r*r),1);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0), 60.0);

    // vec3 color = vec3(1,0,0);
    // uniform vec3 u_color;


    // vec3 diffuse = (vec3(gl_FragColor)) * nDotL;
    vec3 diffuse = (vec3(gl_FragColor)+u_color) * nDotL;
    // just add color to frag in diffuse for color change to light?
    //vec3 ambient = vec3(gl_FragColor) * 0.3;
    vec3 ambient = (vec3(gl_FragColor)) * 0.3;
    //gl_FragColor = gl_FragColor * nDotL;
    //gl_FragColor.a = 1.0;
    //vec3 color = vec3(1,0,0);
    if (u_lightOn){
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }
  }`

// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_color;

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_color = gl.getUniformLocation(gl.program, 'u_color');
  if (!u_color) {
    console.log('Failed to get the storage location of u_color');
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
let g_selectedColor=[0.0, 0.0, 0.0, 1.0];
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
let g_normalOn=false;
let g_lightPos=[0,1.5,-.5];
let g_lightOn=true;
let g_lightanimOn=true;

// setup actions for HTML UI elements
function addActionsForHtmlUI(){

  //attemp at rotating by dragging on canvas
  //document.getElementById('webgl').addEventListener('mousedown', function() {g_click_down = true;});
  document.getElementById('webgl').addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_pos = convertCoordinatesEventToGL(ev)} else {g_pos = [0,0]}});
  document.getElementById('webgl').addEventListener('click', function(ev) {if(ev.shiftKey){g_shift_click = true;}else{g_shift_click = false;}});

  // size slider event
  //document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value;});
  //document.getElementById('segmentSlide').addEventListener('mouseup', function() {g_selectedSegment = this.value;});

  // normal on/off
  document.getElementById('normalOn').onclick = function() {g_normalOn = true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn = false;};

  // light on/off
  document.getElementById('lightOn').onclick = function() {g_lightOn = true;};
  document.getElementById('lightOff').onclick = function() {g_lightOn = false;};

  // ligh animation on/off
  document.getElementById('light_anim_on').onclick = function() {g_lightanimOn = true;};
  document.getElementById('light_anim_off').onclick = function() {g_lightanimOn = false;};

  // light positions
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if(ev.buttons == 1){g_lightPos[2] = this.value/100; renderAllShapes();}});

  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100;});
  // animation on/off
  // document.getElementById('animationON').onclick = function() {g_animation = true;};
  // document.getElementById('animationOFF').onclick = function() {g_animation = false;};
  // //beak
  // document.getElementById('beakSlide').addEventListener('mousemove', function() {g_beak = this.value; renderAllShapes();});
  // //test (aka: neck)
  // document.getElementById('testSlide').addEventListener('mousemove', function() {g_neck = this.value; renderAllShapes();});
  // //head
  // document.getElementById('headSlide').addEventListener('mousemove', function() {g_headSlide = this.value; renderAllShapes();});
  //camera
  ////////////////===///////document.getElementById('angleSlide').addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes();});
  //
  //RIGHT WING
  // document.getElementById('wingRSlide').addEventListener('mousemove', function() {g_wingR = this.value; renderAllShapes();});
  // document.getElementById('wingLSlide').addEventListener('mousemove', function() {g_wingL = this.value; renderAllShapes();});
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
  document.onkeydown = keydown;

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
  var x = ev.movementX//ev.clientX; // x coordinate of a mouse pointer
  var y = ev.movementY//ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  //x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  //y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  //console.log(x,y)

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
  if(g_lightanimOn){
    g_lightPos[0] = Math.cos(g_seconds);
  }
}

var player_camera = new Camera()
console.log("player camera eye: " + player_camera.eye.elements);
var g_eye= [0,0,3];//player_camera.eye //[0,0,3];
var g_at= [0,0,-100];//player_camera.at //[0,0,-100];
var g_up= [0,1,0]//player_camera.up //[0,1,0];
function keydown(ev){

  if (ev.keyCode == 87) {
    // W
    //console.log("W PRESSED");

    player_camera.forward();
    //console.log(player_camera.eye.elements);
  } else if (ev.keyCode == 65) {
    // A
    //console.log("A PRESSED");
    player_camera.left();
    //g_eye[0] -= .2;
  } else if (ev.keyCode == 83) {
    // S
    //console.log("S PRESSED");
    player_camera.back();
  } else if (ev.keyCode == 68) {
    // D
    //console.log("D PRESSED");
    player_camera.right();
    //g_eye[0] += .2;
  } else if (ev.keyCode == 81) {
    // Q
    //console.log("Q PRESSED");
    player_camera.rotateLeft(duration); //duration for debugging
  } else if (ev.keyCode == 69) {
    // E
    //console.log("E PRESSED");
    player_camera.rotateRight();
  }

  renderAllShapes();
}

let duration;
var g_eye= [0,1,-2.5];//player_camera.eye //[0,0,3];
var g_at= [6,0,100];//player_camera.at //[0,0,-100];
var g_up= [0,1,0]//player_camera.up //[0,1,0];
// draws all the shapes that are supposed to be on canvas

//MAP 32x32
var g_map=[
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0, 2, 6, 2, 2, 6, 2, 2, 6, 2, 2, 6, 1, 2, 3, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 10, 2, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 10, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 9, 0, 2, 0, 0, 2, 0, 0, 10, 0, 0, 10, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2],
  [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 10, 0, 0, 10, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 9, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 2, 9, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 2, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 2, 2, 1, 1, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 6, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
];
// >0 :: block
// 1-4 :: height (number of blocks to stack)
// 5-8 :: use texture 1 instead of 0
// 9 :: stone + plank + plank + stone 
// 10 :: stone + plank + stone
function drawMap(){
  //var wall = new Cube();
  for (x=0; x<32; x++){
    for (y=0; y<32; y++){
      if (g_map[x][y] > 0 && g_map[x][y] < 5){
        for (i=0; i < g_map[x][y]; i++){
          var wall = new Cube();
          wall.color=[1,0,1,1];
          wall.textureNum=0;
          //wall.matrix.scale(.5,.5,.5)
          wall.matrix.translate(x-16,-.75+i,y-16);
          wall.render();
        }
      } else if (g_map[x][y] > 4 && g_map[x][y] < 9){
        for (i=0; i < (g_map[x][y]-4); i++){
          var wall = new Cube();
          wall.color=[1,0,1,1];
          wall.textureNum=1;
          //wall.matrix.scale(.5,.5,.5)
          wall.matrix.translate(x-16,-.75+i,y-16);
          wall.render();
        }
      } else if (g_map[x][y] == 9){
        for (i=0; i < 4; i++){
          var wall = new Cube();
          wall.color=[1,0,1,1];
          if (i == 0 || i == 3){
            wall.textureNum=0;
          }
          else{
            wall.textureNum=1;
          }
          //wall.matrix.scale(.5,.5,.5)
          wall.matrix.translate(x-16,-.75+i,y-16);
          wall.render();
        }
      } else if (g_map[x][y] == 10){
        for (i=0; i < 3; i++){
          var wall = new Cube();
          wall.color=[1,0,1,1];
          if (i == 0 || i == 2){
            wall.textureNum=0;
          }
          else{
            wall.textureNum=1;
          }
          wall.matrix.translate(x-16,-.75+i,y-16);
          wall.render();
        }
      }
    }
  }
}

function renderAllShapes(){

  //start timer
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width/canvas.height, .1, 100)  //fov 60
  //(fov, aspect ratio, near plane, ?)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  viewMat.setLookAt(player_camera.eye.elements[0],player_camera.eye.elements[1],player_camera.eye.elements[2],  player_camera.at.elements[0],player_camera.at.elements[1],player_camera.at.elements[2],  player_camera.up.elements[0],player_camera.up.elements[1],player_camera.up.elements[2]); //(eye pos,  look at,  up)
  // z: -1 is the front and 1 is back of bird
  // z: smaller number-> forward
  //    larger number-> backward
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat=new Matrix4().rotate(g_globalAngle,0,1,0);
  // globalRotMat.rotate(g_pos[0]*100, 0,1,0);
  // globalRotMat.rotate(g_pos[1]*100, 1,0,0);    drag mouse on canvas to move
  if (g_pos[0] > 0){
    player_camera.rotateRightMouse();
  }
  else if (g_pos[0] < 0){
    player_camera.rotateLeftMouse();
  }

  //console.log(g_pos);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //drawMap();
  // var wall = new Cube();
  // wall.color=[1,0,1,1];
  // wall.textureNum=0;
  // wall.matrix.translate(x-32,-.75,y-32);
  // wall.render();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_color, g_selectedColor[0], g_selectedColor[1], g_selectedColor[2]);

  //gl.uniform3f(u_cameraPos, g_eye[0], g_eye[1], g_eye[2]);
  //gl.uniform3f(u_cameraPos, g_globalAngle[0], g_globalAngle[1], g_globalAngle[2]);
  gl.uniform3f(u_cameraPos, player_camera.eye.elements[0], player_camera.eye.elements[1], player_camera.eye.elements[2]);

  gl.uniform1i(u_lightOn, g_lightOn);

  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.textureNum = -2;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();

  // NECK
  var neck = new Cube();
  neck.color = [.15*.9,.75*.9,.45*.9,1.0];
  neck.textureNum = -2;
  if (g_normalOn) neck.textureNum = -3;
  neck.matrix.translate(-1,.2,-0.0); //x:0.05
  neck.matrix.rotate(g_neck,1,0,0); //for slider
  neckCoord = new Matrix4(neck.matrix)
  neck.matrix.scale(0.1,0.3,0.1);
  neck.render();

  // HEAD
  var head = new Cube();
  head.color = [.15,.75,.45,1.0];
  head.textureNum = -2;
  if (g_normalOn) head.textureNum = -3;
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
  if (g_normalOn) eyeL.textureNum = -3;
  eyeL.matrix = new Matrix4(headCoord); //headCoord;
  eyeL.matrix.translate(0.2,0.35,-0.15);
  eyeL.matrix.scale(0.1,0.1,0.1);
  eyeL.render();

  var eyeR = new Cube();
  eyeR.color = [0.2,0.2,0.2,1.0];
  eyeR.textureNum = -2;
  if (g_normalOn) eyeR.textureNum = -3;
  eyeR.matrix = new Matrix4(headCoord);//headCoord2;
  eyeR.matrix.translate(-0.2,0.35,-0.15);
  eyeR.matrix.scale(0.1,0.1,0.1);
  eyeR.render();

  // BEAK
  var beakT = new Cube();
  beakT.color = [.18,.25,.18,1.0];
  beakT.textureNum = -2;
  if (g_normalOn) beakT.textureNum = -3;
  beakT.matrix = new Matrix4(headCoord);
  beakT.matrix.rotate(g_beak,1,0,0);
  beakT.matrix.translate(-0.02,0.3,-0.6); 
  beakT.matrix.scale(0.13,0.05,0.4);
  beakT.render();

  var beakB = new Cube();
  beakB.color = [.18,.25,.18,1.0];
  beakB.textureNum = -2;
  if (g_normalOn) beakB.textureNum = -3;
  beakB.matrix = new Matrix4(headCoord);
  beakB.matrix.rotate(-g_beak,1,0,0);
  beakB.matrix.translate(-0.02,0.248,-0.6); 
  beakB.matrix.scale(0.13,0.05,0.6);
  beakB.render();

  // TONGUE
  var tongue = new Cube();
  tongue.color = [.85,.58,.56,1.0];
  tongue.textureNum = -2;
  if (g_normalOn) tongue.textureNum = -3;
  tongue.matrix = new Matrix4(headCoord);
  tongue.matrix.translate(0.02,0.25,-0.5999); 
  tongue.matrix.scale(0.05,0.05,0.4);
  tongue.render();

  // BODY
  var body = new Cube();
  body.color = [.15*.92,.75*.92,.45*.92,1.0];
  body.textureNum = -2;
  if (g_normalOn) body.textureNum = -3;
  body.matrix.translate(-1.1,-0.48,0.3); //x:-.15
  body.matrix.rotate(-30,1,0,0);
  body.matrix.scale(0.32,0.8,0.4);
  body.render();

  // WINGS
  var wingL = new Cube();
  wingL.color = [.12,.65,.6,1.0];
  wingL.textureNum = -2;
  if (g_normalOn) wingL.textureNum = -3;
  //wingL.matrix.translate(-0.14,0.13,-0.07);//z n y
  //wingL.matrix.rotate(180,0,0,1);
  //wingL.matrix.rotate(30,0,1,0);
  wingL.matrix.rotate(-30,1,0,0);
  wingL.matrix.translate(-0.78,-0.67,-0.0); //x:.17
  wingL.matrix.rotate(g_wingL,0,0,1); 
  wingL.matrix.scale(0.15,0.85,0.4);
  wingL.render();

  var wingR = new Cube();
  wingR.color = [.12,.65,.6,1.0];
  wingR.textureNum = -2;
  if (g_normalOn) wingR.textureNum = -3;
  //wingR.matrix.translate(0.17,0.13,-0.075);
  //wingR.matrix.scale(-1,1,1);
  //wingR.matrix.rotate(180,0,0,1);
  wingR.matrix.rotate(-30,1,0,0);   
  wingR.matrix.translate(-1.25,-0.66,0.0); //x:-.3
  wingR.matrix.rotate(g_wingR,0,0,1);
  wingR.matrix.scale(0.15,0.85,0.4);
  wingR.render();

  // TAIL
  var tail = new Cube();
  tail.color = [.12,.65,.6,1.0];
  tail.textureNum = -2;
  if (g_normalOn) tail.textureNum = -3;
  tail.matrix.rotate(30,-30,0,1);  
  tail.matrix.translate(-1.07,-0.9,0.35); //x:-.12
  tail.matrix.scale(0.25,0.5,0.1);
  tail.render();

  //Block World
  //var block1 = new Cube();
  //block1.textureNum = 0;
  //block1.matrix.scale(0.3,0.3,0.3);
  //block1.matrix.translate(1.8,.3, -.2);
  //block1.render();

  //var block2 = new Cube();
  //block2.textureNum = 1;
  //block2.matrix.scale(0.3,0.3,0.3);
  //block2.matrix.translate(-2.5,.3, -.2);
  //block2.render();

  //var block3 = new Cube();
  //block3.textureNum = -1;
  //block3.matrix.scale(0.3,0.3,0.3);
  //block3.matrix.translate(-0.5, 2.8, -.2);
  //block3.render();

  //floor
  // var floor = new Cube();
  // floor.color=[0.8,0.8,0.8,1];
  // floor.textureNum = -2;
  // floor.matrix.translate(0, -.75, 0);
  // //floor.matrix.scale(32,0,32);
  // floor.matrix.scale(10,0,10);
  // floor.matrix.translate(-.5, 0, -.5);
  // floor.render();

  //sky
  var sky = new Cube();
  sky.color=[.7,.7,.7,1];
  sky.textureNum = -2;
  if (g_normalOn) sky.textureNum = -3;
  //sky.matrix.scale(50,50,50);
  sky.matrix.scale(-5,-5,-5); //all -8
  sky.matrix.translate(-.5, -.5, -.5);
  sky.render();

  var ex_sphere = new Sphere();
  if (g_normalOn) ex_sphere.textureNum = -3;
  ex_sphere.matrix.translate(.8, .5, .7);
  ex_sphere.render();



  // check time and show on website
  duration = performance.now() - startTime;
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