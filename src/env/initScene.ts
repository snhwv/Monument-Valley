import debounce from "lodash.debounce";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("[data-canvas]") as HTMLCanvasElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const getGlobalEnv = () => {
  return {
    scene,
    camera,
    renderer,
  };
};

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(100, 100, 100);
scene.add(camera);

const onResize = () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
};

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

export const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

export const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

window.addEventListener("resize", debounce(onResize, 100));
