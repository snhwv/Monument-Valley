import { unitWidth } from "@constants";
import debounce from "lodash.debounce";
import * as THREE from "three";
import { Group, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export let canvas: HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const getCanvasRect = () => {
  return canvas.getBoundingClientRect();
};

export const getGlobalEnv = () => {
  return {
    scene,
    camera,
    renderer,
  };
};

export const scene = new THREE.Scene();

export const camera = new THREE.OrthographicCamera(
  sizes.width / -2,
  sizes.width / 2,
  sizes.height / 2,
  sizes.height / -2,
  1,
  10000
);
camera.position.set(400, 400, 400);
scene.add(camera);

export const canvasResizeHandler = () => {
  const rects = getCanvasRect();

  sizes.height = rects.height;
  sizes.width = rects.width;

  camera.left = sizes.width / -2;
  camera.right = sizes.width / 2;
  camera.top = sizes.height / 2;
  camera.bottom = sizes.height / -2;

  camera.left *= 0.5;
  camera.right *= 0.5;
  camera.top *= 0.5;
  camera.bottom *= 0.5;

  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
};

export let orbitControls!: OrbitControls;

export let renderer!: WebGLRenderer;

export const sceneInit = () => {
  canvas = document.querySelector("[data-canvas]") as HTMLCanvasElement;
  orbitControls = new OrbitControls(camera, canvas);
  orbitControls.enableDamping = true;

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  canvasResizeHandler();
};

const floorGeometry = new THREE.BoxGeometry(300, 2, 300);
const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xfaebd7 });

export const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.position.set(0, -1 - unitWidth / 2, 0);
export const mainGroup = new Group();

// scene.add(floor);
scene.add(mainGroup);
export const tick = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

window.addEventListener("resize", debounce(canvasResizeHandler, 100));
