import { componentMap } from "@components";
import { unitWidth } from "@constants";
import debounce from "lodash.debounce";
import { updateSceneTree } from "../layout/SceneTree";
import * as THREE from "three";
import { Group, Matrix4, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass";

import data from "../data";
// import { gui } from "./dat";

export let canvas: HTMLCanvasElement;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let composer: any;

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
  100,
  10000
);
camera.position.set(200, 200, 200);
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
  // composer.setSize(sizes.width, sizes.height);
};

export let orbitControls!: OrbitControls;

export let renderer!: WebGLRenderer;

export const sceneInit = () => {
  canvas = document.querySelector("[data-canvas]") as HTMLCanvasElement;
  orbitControls = new OrbitControls(camera, canvas);
  orbitControls.enableDamping = true;
  orbitControls.enabled = false;

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  // var torusKnot = new THREE.Mesh(
  //         new THREE.TorusKnotBufferGeometry( 1.5, 0.5, 100, 100),
  //         new THREE.MeshStandardMaterial( { color: 0xff8800 } ),
  // )
  // torusKnot.scale.set( 20, 20, 20 )
  // torusKnot.position.set( 0, 0, 0 )
  // scene.add( torusKnot )
  // scene.add( new THREE.DirectionalLight() );
  // scene.add( new THREE.HemisphereLight() );

  // composer = new EffectComposer( renderer );
  // const renderPass = new RenderPass( scene, camera );
  // composer.addPass( renderPass );
  // const saoPass = new SAOPass( scene, camera, false, true );
  // composer.addPass( saoPass );

  // gui.add( saoPass.params, 'output', {
  //   'Beauty': SAOPass.OUTPUT.Beauty,
  //   'Beauty+SAO': SAOPass.OUTPUT.Default,
  //   'SAO': SAOPass.OUTPUT.SAO,
  //   'Depth': SAOPass.OUTPUT.Depth,
  //   'Normal': SAOPass.OUTPUT.Normal
  // } ).onChange( function ( value ) {

  //   saoPass.params.output = parseInt( value );

  // } );
  // gui.add( saoPass.params, 'saoBias', - 1, 1 );
  // gui.add( saoPass.params, 'saoIntensity', 0, 1 );
  // gui.add( saoPass.params, 'saoScale', 0, 10 );
  // gui.add( saoPass.params, 'saoKernelRadius', 1, 100 );
  // gui.add( saoPass.params, 'saoMinResolution', 0, 1 );
  // gui.add( saoPass.params, 'saoBlur' );
  // gui.add( saoPass.params, 'saoBlurRadius', 0, 200 );
  // gui.add( saoPass.params, 'saoBlurStdDev', 0.5, 150 );
  // gui.add( saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1 );

  // composer = new EffectComposer(renderer);
  // const ssaoPass = new SSAOPass(
  //   scene,
  //   camera,
  //   sizes.width,
  //   sizes.height
  // );
  // ssaoPass.kernelRadius = 16;
  // composer.addPass(ssaoPass);

  // gui.add( ssaoPass, 'output', {
  //   'Default': SSAOPass.OUTPUT.Default,
  //   'SSAO Only': SSAOPass.OUTPUT.SSAO,
  //   'SSAO Only + Blur': SSAOPass.OUTPUT.Blur,
  //   'Beauty': SSAOPass.OUTPUT.Beauty,
  //   'Depth': SSAOPass.OUTPUT.Depth,
  //   'Normal': SSAOPass.OUTPUT.Normal
  // } ).onChange( function ( value ) {

  //   ssaoPass.output = parseInt( value );

  // } );
  // gui.add( ssaoPass, 'kernelRadius' ).min( 0 ).max( 32 );
  // gui.add( ssaoPass, 'minDistance' ).min( 0.001 ).max( 0.02 );
  // gui.add( ssaoPass, 'maxDistance' ).min( 0.01 ).max( 0.3 );
  
  canvasResizeHandler();

  // const mainGroupChildren = localStorage.getItem("mainGroupChildren");
  // const mainGroupChildren = data;
  const mainGroupChildren = '';
  if (mainGroupChildren) {
    const parsedMainGroupChildren = JSON.parse(mainGroupChildren);
    const generateObj = (arr: any[], parent: any) => {
      arr.map((item: any) => {
        const onCreate = (comp: Group) => {
          comp.parent?.remove(comp);
          parent.add(comp);

          const matrix = new Matrix4();
          matrix.elements = item.matrix.elements;
          comp.applyMatrix4(matrix);
        };

        const component: Group = new (componentMap as any)[item.type](
          item.userData.props[0],
          item.userData.props[1],
          onCreate
        );

        if (item.children?.length) {
          generateObj(item.children, component);
        }
      });
    };
    generateObj(parsedMainGroupChildren, mainGroup);
    updateSceneTree();
  }
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
  // composer.render();
  window.requestAnimationFrame(tick);
};

window.addEventListener("resize", debounce(canvasResizeHandler, 100));
