import { Object3D } from "three";
import { sceneInit } from "./initScene";
import { transformInit } from "./transformControl";

export * from "./initScene";
export * from "./transformControl";
export * from "./light";
export * from "./helper";

const init = () => {
  sceneInit();
  transformInit();
};

const flatedComponents: Object3D[] = [];
export { init, flatedComponents };
