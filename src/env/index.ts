import { Object3D } from "three";

import { sceneInit } from "./initScene";
import { transformInit } from "./transformControl";

export * from "./initScene";
export * from "./transformControl";
export * from "./light";
export * from "./helper";
const flatedComponents: Object3D[] = [];

const init = () => {
  sceneInit();
  transformInit();
};
export { init, flatedComponents };
