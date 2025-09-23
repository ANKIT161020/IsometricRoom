import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//-----------------------------------//
//------------Window States----------//
const state = {
  width: window.innerWidth,
  height: window.innerHeight,
  light_1_intensity: 4,
};

//-------------------------------------//
//---------Constants Declarations-----//
const canvas = document.getElementById("myCanvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  state.width / state.height,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const gltfLoader = new GLTFLoader();
const iso_room = "./assets/Iso_Room.glb";
const light1 = new THREE.DirectionalLight(0xffffff, state.light_1_intensity);
const controls = new OrbitControls(camera, renderer.domElement);
const helper = new THREE.DirectionalLightHelper(light1, 2); // 5 is the size of the helper
scene.add(helper);

//----------------------------------------//
//---------Set Renderer Properties--------//
renderer.setSize(state.width, state.height);
renderer.shadowMap.enabled = true;
renderer.setAnimationLoop(animate);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//----------------------------------------//
//---------Set Camera Properties--------//
// {x: -2.6072037252312676, y: 1.3839327191911668, z: 2.1900276608888047}
camera.position.set(-2.2, 1.4, 2.2);

//----------------------------------------//
//----------Set Light1 Properties---------//
// light1.castShadow = true;
light1.position.set(-5, 5, 3);
light1.lookAt(0, 5, 0);

// Set up shadow properties for the light
// light1.shadow.mapSize.width = 512; // default
// light1.shadow.mapSize.height = 512; // default
// light1.shadow.camera.near = 0.5; // default
// light1.shadow.camera.far = 500; // default
// light1.shadow.normalBias = 0.1;

//----------------------------------------//
//----------Set Orbits Properties---------//
controls.enableDamping = true;
controls.maxDistance = 6;
controls.maxPolarAngle = 1.2;
controls.minDistance = 2.5;
controls.minAzimuthAngle = -1.7;
controls.maxAzimuthAngle = 0.16;
controls.panSpeed = 0.1;
controls.rotateSpeed = 0.35;
controls.zoomSpeed = 0.5;

//----------------------------------------//
//------------GLTF Loader----------------//
gltfLoader.load(iso_room, (glf) => {
  const room = glf.scene;
  room.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(room);
});

//--------------------------------------//
//----------Scene Additions-------------//
scene.add(light1);

//---------------------------------------//
//-------------Animate-------------------//
function animate() {
  controls.update();
  renderer.render(scene, camera);
}

//----------------------------------------//
//------------Responsive------------------//
window.addEventListener("resize", () => {
  state.width = window.innerWidth;
  state.height = window.innerHeight;

  camera.aspect = state.width / state.height;
  camera.updateProjectionMatrix();

  renderer.setSize(state.width, state.height);
});
