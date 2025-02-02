import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ** 1. Chung

//    - Scene
const scene = new THREE.Scene();

//    - Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: false,
  canvas: document.querySelector("#bg"),});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled = true;            // test thì để true
document.body.appendChild(renderer.domElement);

//    - Camera orbit
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 2, 0);

//    - OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2, 0);
controls.update();

// ** 2. Khung hình

//   - Light
// test thì để light nhẹ toàn bộ trước đã
const ambientLight = new THREE.AmbientLight( 0x404040 , 20 );
scene.add( ambientLight );

const DirectionalLight = new THREE.DirectionalLight( 0xffffff, 5.00 );
DirectionalLight.position.set( 3.524, 10.516, 10 );
scene.add( DirectionalLight );

//   - Mặt đất

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x808080 }) // màu xám
);
ground.rotation.x = Math.PI / 2;
ground.position.y = -0.5;
scene.add(ground);

// ** 3. Đối tượng trong không gian
// Test donut
/*
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xff6347 })
);
torus.position.set(0, 0, 0);
torus.rotation.set(0, 0, 0);
scene.add(torus);
*/

//    - Map GLTF
/* Note: Sau khi chỉnh sửa gì file map 3D, baked toàn bộ những cái cần render ra .obj xong đẩy lên 3dviewer.net convert về .glb, để .gltf hỏng hết */
const manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
  console.log( item, loaded, total );
};

const loader = new GLTFLoader(manager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
loader.setDRACOLoader( dracoLoader );

loader.load(
  './asset/3D/hanoi_circuit.glb',

  function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
  },

  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },

  function ( error ) {
    console.error( 'maps: An error happened, check the code or the fuckin 3D again' );
  }
);

// load xe vào, cho chạy animation loop khi hết, call 2 camera từ model này

const rb19 = new GLTFLoader( manager );
const rb19DracoLoader = new DRACOLoader();
rb19DracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
rb19.setDRACOLoader( rb19DracoLoader );

let mixer;


rb19.load(
  './asset/3D/rb19.glb',

  function ( gltf ) {
    const model = gltf.scene;

    const animation = gltf.animations;
    if (animation && animation.length){
      mixer = new THREE.AnimationMixer(model);
      animation.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
    gltf.cameras.forEach((cam, index) => {
      cameras[`rb19_${index+1}`] = cam;
    });
    
    scene.add(model);
  },

  function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },

  function ( error ) {
    console.error( 'rb19: An error happened, check the code or the fuckin 3D again' );
  }
);

// Tổng hợp camera
const cameras = {
  default: camera,
  // các cam model sẽ add vào đây
};

let currentCamera = camera;

// Ngày đêm (tạm thời bỏ, lag quá)
//let isDay = true;
const dground = new THREE.CubeTextureLoader()
  .setPath('./tex/Day_skybox/')
  .load([
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
  ]);
scene.background = dground; // temp 

/*
function toggleDayNight() {
  isDay = !isDay;
  if (isDay) {
    scene.background = dground;
    scene.fog = new THREE.Fog(0xaed6f1, 0.001, 500);
  } else {
    scene.background = nbackground;
    scene.fog = new THREE.Fog(0x000000, 0.001, 500);
  }
};
*/

// switch camera
document.getElementById('cameraSelect').addEventListener('change', (event) => {
  const selectedCamera = cameras[event.target.value];
  if (selectedCamera) {
    currentCamera = selectedCamera;
  }
});

function animate() {
  requestAnimationFrame(animate);
  if (mixer) {
    mixer.update(clock.getDelta())
  };
//  controls.update();
  render();
};

const clock = new THREE.Clock();
function render() {
  renderer.render( scene, currentCamera );
};

animate();