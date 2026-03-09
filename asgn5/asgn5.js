import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const drag_control = new OrbitControls(camera, renderer.domElement);
// drag_control.enablePan = false;  // prevents right-click sliding
// // drag_control.enableZoom = true;  // optional
// drag_control.enableDamping = true;

const drag_controls = new PointerLockControls(camera, document.body);
scene.add(drag_controls.object);
document.addEventListener('click', () => {
  drag_controls.lock();
});

// Primary Shapes
const cube_geometry = new THREE.BoxGeometry( 1, 1, 1 );
const sphere_geometry = new THREE.SphereGeometry(1, 32, 16);
const triangle_geometry = new THREE.TetrahedronGeometry(1);

// Main Textures
const loader = new THREE.TextureLoader();
// [BRICK - START]
const brick_texture = loader.load( 'brick.png' );
brick_texture.colorSpace = THREE.SRGBColorSpace;
const brick_material = new THREE.MeshPhongMaterial({map:brick_texture});


const repeat_brick_texture = loader.load( 'brick.png' );
repeat_brick_texture.wrapS = THREE.RepeatWrapping;
repeat_brick_texture.wrapT = THREE.RepeatWrapping;
repeat_brick_texture.magFilter = THREE.NearestFilter;
repeat_brick_texture.colorSpace = THREE.SRGBColorSpace;
repeat_brick_texture.repeat.set(2, 4);
const repeat_brick_material = new THREE.MeshPhongMaterial({map:repeat_brick_texture});
// [BRICK - END]

// [CHECKERS - START]
const planeSize = 20;
const check_texture = loader.load('checker.png');
check_texture.wrapS = THREE.RepeatWrapping;
check_texture.wrapT = THREE.RepeatWrapping;
check_texture.magFilter = THREE.NearestFilter;
check_texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
check_texture.repeat.set(repeats, repeats);
const checkers_material = new THREE.MeshPhongMaterial({map:check_texture});
// [CHECKERS - END]

// [STONE - START]
const sPlane = 20;
const stone_texture = loader.load( 'stone.png' );
stone_texture.wrapS = THREE.RepeatWrapping;
stone_texture.wrapT = THREE.RepeatWrapping;
stone_texture.magFilter = THREE.NearestFilter;
stone_texture.colorSpace = THREE.SRGBColorSpace;
stone_texture.repeat.set(sPlane/2, sPlane/2);
const stone_material = new THREE.MeshPhongMaterial({map:stone_texture});
// [STONE - END]

// [SKYBOX - START]
// const sky = loader.load('sky.png');
const cubeLoader = new THREE.CubeTextureLoader();
const skyTexture = cubeLoader.load([
    'sky_right.png', 'sky_left.png', // px, nx
    'sky_top.png', 'sky_bottom.png', // py, ny
    'sky_front.png', 'sky_back.png', // pz, nz
]);
scene.background = skyTexture;
// [SKYBOX - END]

// SIGN
const controlsTexture = loader.load('controls.png');
controlsTexture.colorSpace = THREE.SRGBColorSpace;
const controlsMaterial = new THREE.MeshPhongMaterial({
  map: controlsTexture,
  transparent: true
});
const controlsGeo = new THREE.PlaneGeometry(3, 3);
const controlsPlane = new THREE.Mesh(controlsGeo, controlsMaterial);
controlsPlane.position.set(0, 0.5, 6);
scene.add(controlsPlane);
// SIGN

// Special Object Loading
let vaseOBJ;
let vase2;
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
mtlLoader.load('Vase.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
objLoader.load('Vase.obj', (root) => {
    vaseOBJ = root;
    vaseOBJ.position.set(-2, -2, 0);
    scene.add(vaseOBJ);
    vase2 = root.clone();
    vase2.position.set(-5, -2, 5);
    scene.add(vase2);
    //scene.add(root);
});
});

//FLOOR?
const floorGeo = new THREE.PlaneGeometry(planeSize, planeSize); //floor 40x40
const floorMat = new THREE.MeshPhongMaterial({
  map: check_texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(floorGeo, floorMat);
mesh.rotation.x = Math.PI * -.5;
mesh.position.y = -3;
scene.add(mesh);

const mazeFloorGeo = new THREE.PlaneGeometry(30, 30);
const mazeFloorMat = new THREE.MeshPhongMaterial({
  map: stone_texture,
  side: THREE.DoubleSide,
});
const stoneMesh = new THREE.Mesh(mazeFloorGeo, mazeFloorMat);
stoneMesh.rotation.x = Math.PI * -.5;
stoneMesh.position.z = -25
stoneMesh.position.y = -3;
scene.add(stoneMesh);

const mazeEndGeo = new THREE.PlaneGeometry(8, 8);
const mazeEnd = new THREE.Mesh(mazeEndGeo, floorMat);
mazeEnd.rotation.x = Math.PI * -.5;
mazeEnd.position.x = -2
mazeEnd.position.z = -44
mazeEnd.position.y = -3;
scene.add(mazeEnd);
//FLOOR?

//WALLS
const wallGeo = new THREE.BoxGeometry(5, 5, 2);
const wallMat = new THREE.MeshPhongMaterial({
  map: repeat_brick_texture,
  side: THREE.DoubleSide,
});
const wallF1 = new THREE.Mesh(wallGeo, wallMat);
wallF1.position.y = -0.5
wallF1.position.z = -10
wallF1.position.x = 12
scene.add(wallF1)

const wallF2 = new THREE.Mesh(wallGeo, wallMat);
wallF2.position.y = -0.5
wallF2.position.z = -10
wallF2.position.x = 7
scene.add(wallF2)

const wallF3 = new THREE.Mesh(wallGeo, wallMat);
wallF3.position.y = -0.5
wallF3.position.z = -10
wallF3.position.x = 2
scene.add(wallF3)

const wallF4 = new THREE.Mesh(wallGeo, wallMat);
wallF4.position.y = -0.5
wallF4.position.z = -10
wallF4.position.x = -12
scene.add(wallF4)

const wallF5 = new THREE.Mesh(wallGeo, wallMat);
wallF5.position.y = -0.5
wallF5.position.z = -10
wallF5.position.x = -7
scene.add(wallF5)

const wallB1 = new THREE.Mesh(wallGeo, wallMat);
wallB1.position.y = -0.5
wallB1.position.z = -40
wallB1.position.x = 12
scene.add(wallB1)

const wallB2 = new THREE.Mesh(wallGeo, wallMat);
wallB2.position.y = -0.5
wallB2.position.z = -40
wallB2.position.x = 7
scene.add(wallB2)

const wallB3 = new THREE.Mesh(wallGeo, wallMat);
wallB3.position.y = -0.5
wallB3.position.z = -40
wallB3.position.x = 2
scene.add(wallB3)

const wallB4 = new THREE.Mesh(wallGeo, wallMat);
wallB4.position.y = -0.5
wallB4.position.z = -40
wallB4.position.x = -12
scene.add(wallB4)

const wallB5 = new THREE.Mesh(wallGeo, wallMat);
wallB5.position.y = -0.5
wallB5.position.z = -40
wallB5.position.x = -7
scene.add(wallB5)

const planewallGeo = new THREE.PlaneGeometry(5, 5);
const planewallMat = new THREE.MeshPhongMaterial({
  map: repeat_brick_texture,
  side: THREE.DoubleSide,
});
const wallR1 = new THREE.Mesh(planewallGeo, planewallMat);
wallR1.position.y = -0.5
wallR1.rotation.y = Math.PI / 2
wallR1.position.z = -13
wallR1.position.x = 14
scene.add(wallR1)

const wallR2 = new THREE.Mesh(planewallGeo, planewallMat);
wallR2.position.y = -0.5
wallR2.rotation.y = Math.PI / 2
wallR2.position.z = -18
wallR2.position.x = 14
scene.add(wallR2)

const wallR3 = new THREE.Mesh(planewallGeo, planewallMat);
wallR3.position.y = -0.5
wallR3.rotation.y = Math.PI / 2
wallR3.position.z = -23
wallR3.position.x = 14
scene.add(wallR3)

const wallR4 = new THREE.Mesh(planewallGeo, planewallMat);
wallR4.position.y = -0.5
wallR4.rotation.y = Math.PI / 2
wallR4.position.z = -28
wallR4.position.x = 14
scene.add(wallR4)

const wallR5 = new THREE.Mesh(planewallGeo, planewallMat);
wallR5.position.y = -0.5
wallR5.rotation.y = Math.PI / 2
wallR5.position.z = -33
wallR5.position.x = 14
scene.add(wallR5)

const wallR6 = new THREE.Mesh(planewallGeo, planewallMat);
wallR6.position.y = -0.5
wallR6.rotation.y = Math.PI / 2
wallR6.position.z = -38
wallR6.position.x = 14
scene.add(wallR6)

const wallL1 = new THREE.Mesh(planewallGeo, planewallMat);
wallL1.position.y = -0.5
wallL1.rotation.y = Math.PI / 2
wallL1.position.z = -13
wallL1.position.x = -14
scene.add(wallL1)

const wallL2 = new THREE.Mesh(planewallGeo, planewallMat);
wallL2.position.y = -0.5
wallL2.rotation.y = Math.PI / 2
wallL2.position.z = -18
wallL2.position.x = -14
scene.add(wallL2)

const wallL3 = new THREE.Mesh(planewallGeo, planewallMat);
wallL3.position.y = -0.5
wallL3.rotation.y = Math.PI / 2
wallL3.position.z = -23
wallL3.position.x = -14
scene.add(wallL3)

const wallL4 = new THREE.Mesh(planewallGeo, planewallMat);
wallL4.position.y = -0.5
wallL4.rotation.y = Math.PI / 2
wallL4.position.z = -28
wallL4.position.x = -14
scene.add(wallL4)

const wallL5 = new THREE.Mesh(planewallGeo, planewallMat);
wallL5.position.y = -0.5
wallL5.rotation.y = Math.PI / 2
wallL5.position.z = -33
wallL5.position.x = -14
scene.add(wallL5)

const wallL6 = new THREE.Mesh(planewallGeo, planewallMat);
wallL6.position.y = -0.5
wallL6.rotation.y = Math.PI / 2
wallL6.position.z = -38
wallL6.position.x = -14
scene.add(wallL6)

const wall1 = new THREE.Mesh(planewallGeo, planewallMat);
wall1.position.y = -0.5
wall1.rotation.y = Math.PI / 2
wall1.position.z = -13
wall1.position.x = -4.6
scene.add(wall1)

const wall2 = new THREE.Mesh(planewallGeo, planewallMat);
wall2.position.y = -0.5
wall2.rotation.y = Math.PI / 2
wall2.position.z = -18
wall2.position.x = -4.6
scene.add(wall2)

const wall3 = new THREE.Mesh(planewallGeo, planewallMat);
wall3.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall3.position.z = -20.5
wall3.position.x = -7.1
scene.add(wall3)

const wall4 = new THREE.Mesh(planewallGeo, planewallMat);
wall4.position.y = -0.5
wall4.rotation.y = Math.PI / 2
wall4.position.z = -18
wall4.position.x = -9.6
scene.add(wall4)

const wall5 = new THREE.Mesh(planewallGeo, planewallMat);
wall5.position.y = -0.5
wall5.rotation.y = Math.PI / 2
wall5.position.z = -36.5
wall5.position.x = -4.6
scene.add(wall5)

const wall6 = new THREE.Mesh(planewallGeo, planewallMat);
wall6.position.y = -0.5
wall6.rotation.y = Math.PI / 2
wall6.position.z = -26.5
wall6.position.x = -4.6
scene.add(wall6)

const wall7 = new THREE.Mesh(planewallGeo, planewallMat);
wall7.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall7.position.z = -24
wall7.position.x = -7.1
scene.add(wall7)

const wall8 = new THREE.Mesh(planewallGeo, planewallMat);
wall8.position.y = -0.5
wall8.rotation.y = Math.PI / 2
wall8.position.z = -26.5
wall8.position.x = -9.6
scene.add(wall8)

const wall9 = new THREE.Mesh(planewallGeo, planewallMat);
wall9.position.y = -0.5
wall9.rotation.y = Math.PI / 2
wall9.position.z = -31.5
wall9.position.x = -9.6
scene.add(wall9)

const wall10 = new THREE.Mesh(planewallGeo, planewallMat);
wall10.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall10.position.z = -34
wall10.position.x = -7.1
scene.add(wall10)

const wall11 = new THREE.Mesh(planewallGeo, planewallMat);
wall11.position.y = -0.5
wall11.rotation.y = Math.PI / 2
wall11.position.z = -17.5
wall11.position.x = 1
scene.add(wall11)

const wall12 = new THREE.Mesh(planewallGeo, planewallMat);
wall12.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall12.position.z = -15
wall12.position.x = 3.5
scene.add(wall12)

const wall13 = new THREE.Mesh(planewallGeo, planewallMat);
wall13.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall13.position.z = -15
wall13.position.x = 8.5
scene.add(wall13)

const wall14 = new THREE.Mesh(planewallGeo, planewallMat);
wall14.position.y = -0.5
wall14.rotation.y = Math.PI / 2
wall14.position.z = -17.5
wall14.position.x = 11
scene.add(wall14)

const wall15 = new THREE.Mesh(planewallGeo, planewallMat);
wall15.position.y = -0.5
wall15.rotation.y = Math.PI / 2
wall15.position.z = -22.5
wall15.position.x = 11
scene.add(wall15)

const wall16 = new THREE.Mesh(planewallGeo, planewallMat);
wall16.position.y = -0.5
wall16.rotation.y = Math.PI / 2
wall16.position.z = -27.5
wall16.position.x = 11
scene.add(wall16)

const wall17 = new THREE.Mesh(planewallGeo, planewallMat);
wall17.position.y = -0.5
wall17.rotation.y = Math.PI / 2
wall17.position.z = -32.5
wall17.position.x = 11
scene.add(wall17)

const wall18 = new THREE.Mesh(planewallGeo, planewallMat);
wall18.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall18.position.z = -35
wall18.position.x = 8.5
scene.add(wall18)

const wall19 = new THREE.Mesh(planewallGeo, planewallMat);
wall19.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall19.position.z = -35
wall19.position.x = 3.5
scene.add(wall19)

const wall20 = new THREE.Mesh(planewallGeo, planewallMat);
wall20.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall20.position.z = -35
wall20.position.x = -2.1
scene.add(wall20)

const wall21 = new THREE.Mesh(planewallGeo, planewallMat);
wall21.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall21.position.z = -35.001
wall21.position.x = 0
scene.add(wall21)

const wall22 = new THREE.Mesh(planewallGeo, planewallMat);
wall22.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall22.position.z = -29
wall22.position.x = -2.1
scene.add(wall22)

const wall23 = new THREE.Mesh(planewallGeo, planewallMat);
wall23.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall23.position.z = -20
wall23.position.x = 3.5
scene.add(wall23)

const wall24 = new THREE.Mesh(planewallGeo, planewallMat);
wall24.position.y = -0.5
wall24.rotation.y = Math.PI / 2
wall24.position.z = -22.5
wall24.position.x = 6
scene.add(wall24)

const wall25 = new THREE.Mesh(planewallGeo, planewallMat);
wall25.position.y = -0.5
//wall3.rotation.y = Math.PI / 2
wall25.position.z = -25
wall25.position.x = 3.5
scene.add(wall25)

const wall26 = new THREE.Mesh(planewallGeo, planewallMat);
wall26.position.y = -0.5
wall26.rotation.y = Math.PI / 2
wall26.position.z = -32.5
wall26.position.x = 6
scene.add(wall26)
//WALLS

// Lights  FOR DEBUGGING
// const Color = 0xFFFFFF;
// const Intensity = 3;
// const directLight = new THREE.DirectionalLight(Color, Intensity);
// directLight.position.set(-1, 2, 4);
// scene.add(directLight);

// const directMarkerGeo = new THREE.SphereGeometry(0.2, 12, 12); // small sphere
// const directMarkerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // bright color
// const direct_marker = new THREE.Mesh(directMarkerGeo, directMarkerMat);
// direct_marker.position.copy(directLight.position); // match the light
// scene.add(direct_marker);
// Light FOR DEBUGGING

// SPOTLIGHT
const color = 0xFFFFFF;
const intensity = 30;
const spotLight = new THREE.SpotLight(color, intensity);
spotLight.position.set(-1, 2, 4);
spotLight.angle = Math.PI / 4;    // cone angle in radians (~30 degrees)
spotLight.penumbra = 0.2;         // soft edge of the cone
spotLight.decay = 2;               // light falloff
spotLight.distance = 20;           // maximum distance the light reaches
scene.add(spotLight);

const spotMarkerGeo = new THREE.SphereGeometry(0.2, 12, 12); // small sphere
const spotMarkerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // bright color
const spot_marker = new THREE.Mesh(spotMarkerGeo, spotMarkerMat);
spot_marker.position.copy(spotLight.position); // match the light
scene.add(spot_marker);

// AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0x404040, 2.0);
scene.add(ambientLight);

// POINT LIGHT
const pointLight = new THREE.PointLight(0xffffff, 10, 10, 1); //color, intensity, distance, decay
pointLight.position.set(-6.5, -1.5, 6.5);
scene.add(pointLight);

const pointMarkerGeo = new THREE.SphereGeometry(0.2, 12, 12); // small sphere
const pointMarkerMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // bright color
const point_marker = new THREE.Mesh(pointMarkerGeo, pointMarkerMat);
point_marker.position.copy(pointLight.position); // match the light
scene.add(point_marker);


// FLASHLIGHT (new spotlight)
//let flashlightOn = false;
const flashlight = new THREE.SpotLight(0xffffff, 35);

flashlight.angle = Math.PI / 7;   // cone width
flashlight.penumbra = 0.4;        // soft edge
flashlight.decay = 2;
flashlight.distance = 50;

// position relative to camera
flashlight.position.set(0, 0, 0);

// attach to player (VERY IMPORTANT)
drag_controls.object.add(flashlight);

// target must also be attached
flashlight.target.position.set(0, 0, -1);
drag_controls.object.add(flashlight.target);

// PLAYER START LOCATION
camera.position.z = 9;
// camera.position.z = -9;
// camera.position.x = -2

// const cubes = [
//     makeInstance(cube_geometry, 0x44aa88,  0),
//     makeInstance(sphere_geometry, 0x8844aa, -2),
//     makeInstance(triangle_geometry, 0xaa8844,  2),
// ]

// renderer.setAnimationLoop( animate );

// function makeInstance(geometry, color, x) {
//   const material = new THREE.MeshPhongMaterial({color});
 
//   const cube = new THREE.Mesh(geometry, brick_material);
//   scene.add(cube);
 
//   cube.position.x += x;
 
//   return cube;
// }

// SCARY IMAGE
const scaryTexture = loader.load('scary.png');
scaryTexture.colorSpace = THREE.SRGBColorSpace;

const scaryMat = new THREE.MeshBasicMaterial({
  map: scaryTexture,
  transparent: true
});

const scaryGeo = new THREE.PlaneGeometry(4,4);
const scaryPlane = new THREE.Mesh(scaryGeo, scaryMat);

// SCARY SOUND
const listener = new THREE.AudioListener();
camera.add(listener);

const ghostSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

// audioLoader.load('ghost.wav', function(buffer) {
//     ghostSound.setBuffer(buffer);
//     ghostSound.setLoop(false);      // one-time sound
//     ghostSound.setVolume(1.0);      // adjust volume (0.0 - 1.0)
// });

// Preload on startup
audioLoader.load('ghost.wav', (buffer) => {
    ghostSound.setBuffer(buffer);
    ghostSound.setLoop(false);    // one-time playback
    ghostSound.setVolume(1.0);    // adjust volume
});

// start hidden
scaryPlane.visible = false;

// position where it will appear
scaryPlane.rotation.y = Math.PI / 2
scaryPlane.position.set(5, 0, -37);

scene.add(scaryPlane);


const cubes = [
    makeInstance(cube_geometry, new THREE.MeshPhongMaterial({color:0x44aa88}),  0, 0, 0),
    makeInstance(sphere_geometry, new THREE.MeshPhongMaterial({color:0x8844aa}), -2, 0, 0),
    makeInstance(triangle_geometry, new THREE.MeshPhongMaterial({color:0xaa8844}), 2, 0, 0),
    makeInstance(cube_geometry, brick_material, 0, -2, 1),
    makeInstance(cube_geometry, brick_material, -6.5, 1, 6.5),
    makeInstance(cube_geometry, checkers_material, -8, -2, 8),
    makeInstance(triangle_geometry, new THREE.MeshPhongMaterial({color:0xaa0044}), -8, -2, 5),
    makeInstance(triangle_geometry, new THREE.MeshPhongMaterial({color:0x00aa44}), -5, -2, 8),
]

renderer.setAnimationLoop( animate );

function makeInstance(geometry, material, x, y, z) {
  //const material = new THREE.MeshPhongMaterial({color});
 
  const shape = new THREE.Mesh(geometry, material);
  scene.add(shape);
 
  shape.position.x += x;
  shape.position.y += y;
  shape.position.z += z;
 
  return shape;
}


// WASD Movement
// const keys = { w:false, a:false, s:false, d:false };

// document.addEventListener('keydown', (e) => {
//   if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
// });

// document.addEventListener('keyup', (e) => {
//   if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
// });

// WASD + Flashlight
const keys = { w:false, a:false, s:false, d:false };

let flashlightOn = false;
flashlight.visible = false;
let fPressed = false;

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  if (key in keys) keys[key] = true;

  if (key === 'f' && !fPressed) {
    flashlightOn = !flashlightOn;
    flashlight.visible = flashlightOn;
    fPressed = true;
  }
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();

  if (key in keys) keys[key] = false;

  if (key === 'f') {
    fPressed = false;
  }
});

let scream = true
const moveSpeed = 0.09;

function animate( time ) {
    cubes.forEach((cube,  indx) => {
        //const speed = 1 + indx;
        cube.rotation.x = (time / 2000);
        cube.rotation.y = (time / 1000);
    });

    // [WASD MOVEMENT] //
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0,1,0)).normalize();

    if (keys.w) drag_controls.object.position.addScaledVector(forward, moveSpeed);
    if (keys.s) drag_controls.object.position.addScaledVector(forward, -moveSpeed);
    if (keys.a) drag_controls.object.position.addScaledVector(right, -moveSpeed);
    if (keys.d) drag_controls.object.position.addScaledVector(right, moveSpeed);

    //renderer.render(scene, camera);
    // [WASD MOVEMENT] //

    // PLAYER POSITION
    const playerPos = drag_controls.object.position;

    // trigger zone
    if (
        playerPos.z < -36 &&
        playerPos.z > -38 &&
        playerPos.x < 8 &&
        playerPos.x > 2
    ){
      scaryPlane.visible = true;
      // if (!ghostSound.isPlaying) ghostSound.play();  // play only once
    }

    if (
        playerPos.z < -36 &&
        playerPos.z > -38 &&
        playerPos.x < 10 &&
        playerPos.x > 2
    ){
      // scaryPlane.visible = true;
      if (!ghostSound.isPlaying && scream) {
        ghostSound.play();  // play only once
        scream = false
      }
    }

    if (
        playerPos.z < -36 &&
        playerPos.z > -38 &&
        Math.abs(playerPos.x) < 15
    ){
      scaryPlane.lookAt(camera.position);
    }


    //drag_control.update();
    renderer.render( scene, camera );
}
