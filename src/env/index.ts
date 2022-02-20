import Component from "@components/lib/recordable";
import Path from "@components/Path";
import { Object3D, Vector3 } from "three";
import { camera, mainGroup, orbitControls, sceneInit } from "./initScene";
import { transformInit } from "./transformControl";

export * from "./initScene";
export * from "./transformControl";
export * from "./light";
export * from "./helper";
import "./dat";

const init = () => {
  sceneInit();
  transformInit();
};

const flatedComponents: Object3D[] = [];

const getCompFromFlatedArrByName = (name: string) => {
  return flatedComponents.find((item) => item.name === name) as Component;
};

const Paths: Path[] = [];
const clear = () => {
  Paths.length = 0;
  flatedComponents.length = 0;
  camera.position.set(200, 200, 200);
  mainGroup.clear();
  orbitControls.target.copy(new Vector3());
};

export { init, flatedComponents, Paths, getCompFromFlatedArrByName, clear };
