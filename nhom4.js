import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// ** 1. Chung

//    - Scene
let scene = new THREE.Scene();

//    - Camera
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 10, -15);
camera.lookAt(0, 2, 0);

//    - Renderer
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled = false;               // đoạn này tắt tạm test thôi
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//    - OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// ** 2. Khung hình

//   - Light (nhớ sửa bổ sung)
// test thì để light nhẹ toàn bộ trước đã
let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

//   - Mặt đất
let ground = new THREE.Mesh(
  new THREE.PlaneGeometry(800, 800),
  new THREE.MeshStandardMaterial({ color: 0x808080 }) // màu xám
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

//    - Background
scene.background = new THREE.CubeTextureLoader().load([
  //theo thứ tự: right, left, top, bottom, back, front
  "./asset/textures/Skybox/Right.bmp",
  "./asset/textures/Skybox/Left.bmp",
  "./asset/textures/Skybox/Top.bmp",
  "./asset/textures/Skybox/Bottom.bmp",
  "./asset/textures/Skybox/Back.bmp",
  "./asset/textures/Skybox/Front.bmp",
]);

//    - Sương mù
// scene.fog = new THREE.Fog(0x000000, 1, 500);
//    - Âm thanh (bổ sung sau)

// ** 3. Đối tượng trong không gian
//    - Map
/*
let manager = new THREE.LoadingManager();
let loader = new FBXLoader(manager);
loader.load( './asset/3D/hanoi.fbx', function ( object ) {
  object.scale.set(0.01, 0.01, 0.01);
  scene.add( object );
});
*/
