//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'panda';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    object.position.x = 0;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); //Alpha: true allows for the transparent background
const container3D = document.getElementById("container3D");
const width = container3D.clientWidth;
const height = container3D.clientHeight;

renderer.setSize(width, height);

//Add the renderer to the DOM
container3D.appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.aspect = width / height;
camera.updateProjectionMatrix();
camera.position.z = 5.5;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xdddddd, 0.5); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const backLight = new THREE.DirectionalLight(0xffffff, 0.25); // (color, intensity)
backLight.position.set(-500, 500, -500) //back-left-ish
backLight.castShadow = true;
scene.add(backLight);

const leftLight = new THREE.DirectionalLight(0xffffff, 0.25); // (color, intensity)
leftLight.position.set(500, 500, -500) //left-ish
leftLight.castShadow = true;
scene.add(leftLight);

const rightLight = new THREE.DirectionalLight(0xffffff, 0.25); // (color, intensity)
rightLight.position.set(-500, 500, 500) //right-ish
rightLight.castShadow = true;
scene.add(rightLight);

const ambientLight = new THREE.AmbientLight(0x808080, 2);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "panda") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
}

if (objToRender === "duck") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement
  if (object) {
    object.rotation.y -= 0.001;
  }

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  const width = container3D.clientWidth;
  const height = container3D.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();
