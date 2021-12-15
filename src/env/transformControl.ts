import { unitWidth } from "@constants";
import { camera, orbitControls, renderer, scene } from "@env";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

export const transformControls = new TransformControls(
  camera,
  renderer.domElement
);
transformControls.addEventListener("dragging-changed", function (event) {
  orbitControls.enabled = !event.value;
});
export const setMode = (mode: "translate" | "rotate" | "scale") => {
  transformControls.setMode(mode);
};
export const setTranslationSnap = (translationSnap: number | null) => {
  transformControls.setTranslationSnap(translationSnap);
};
export const setRotationSnap = (translationSnap: number | null) => {
  transformControls.setRotationSnap(translationSnap);
};
export const setScaleSnap = (translationSnap: number | null) => {
  transformControls.setScaleSnap(translationSnap);
};
setMode("translate");
setTranslationSnap(unitWidth);

setRotationSnap(Math.PI / 2);

setScaleSnap(1);

scene.add(transformControls);