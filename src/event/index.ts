import { componentTypes } from "@components";
import {
  camera,
  canvas,
  flatedComponents,
  getCanvasRect,
  orbitControls,
  setMode,
} from "@env";
import { saveScene } from "../layout/SceneTree";
import { Object3D, Raycaster, Vector2 } from "three";
import { setPaths } from "./getPath";
import { IpinterdownHander, store } from "./store";
import { crudComponents } from "./crudComponent";
import { setTransformControl } from "./setTransformControl";
import { rotated, setRotation, setRotationPrevPoint } from "./rotateComponent";
import { moved, setMove, setMovePrevPoint } from "./moveComponent";

const setPointer = (event: any) => {
  const rect = getCanvasRect();
  pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
};

export const eventInit = () => {
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointermove", onPointerMove);
  document.addEventListener("keydown", onDocumentKeyDown);
  document.addEventListener("keyup", onDocumentKeyUp);
};

function onPointerUp(event: any) {
  event.preventDefault();
  setPointer(event);
  raycaster.setFromCamera(pointer, camera);
  let intersects = raycaster.intersectObjects(flatedComponents, true);
  let intersect = null;
  if (intersects.length > 0) {
    intersect = intersects[0];
    const currentComponent = getComponentParent(intersect.object);
    intersect = currentComponent;
  }

  let next: any = pointerupHandlerArr[0];
  let i = 0;
  while (next) {
    i++;
    const handler = next;
    next = null;
    handler({
      mainGroupIntersect: intersect,
      next: () => {
        next = pointerupHandlerArr[i];
      },
      raycaster,
    });
  }
}
function onPointerMove(event: any) {
  event.preventDefault();
  setPointer(event);
  raycaster.setFromCamera(pointer, camera);
  let intersects = raycaster.intersectObjects(flatedComponents, true);
  let intersect = null;
  if (intersects.length > 0) {
    intersect = intersects[0];
    const currentComponent = getComponentParent(intersect.object);
    intersect = currentComponent;
  }

  let next: any = pointermoveHandlerArr[0];
  let i = 0;
  while (next) {
    i++;
    const handler = next;
    next = null;
    handler({
      mainGroupIntersect: intersect,
      next: () => {
        next = pointermoveHandlerArr[i];
      },
      raycaster,
    });
  }
}
const pointer = new Vector2();
const raycaster = new Raycaster();

let pointerdownHandlerArr: IpinterdownHander[] = [
  setRotationPrevPoint,
  setMovePrevPoint,
  crudComponents,
  setTransformControl,
  setPaths,
];

const pointermoveHandlerArr: IpinterdownHander[] = [setRotation, setMove];

const pointerupHandlerArr: IpinterdownHander[] = [rotated, moved];

const getComponentParent = (object: Object3D): any => {
  if (componentTypes.includes(object?.constructor?.name)) {
    return object;
  } else if (object.parent) {
    return getComponentParent(object.parent);
  } else {
    return null;
  }
};

function onPointerDown(event: any) {
  event.preventDefault();
  setPointer(event);
  raycaster.setFromCamera(pointer, camera);
  let intersects = raycaster.intersectObjects(flatedComponents, true);
  let intersect = null;
  if (intersects.length > 0) {
    intersect = intersects[0];
    const currentComponent = getComponentParent(intersect.object);
    intersect = currentComponent;
  }

  let next: any = pointerdownHandlerArr[0];
  let i = 0;
  while (next) {
    i++;
    const handler = next;
    next = null;
    handler({
      mainGroupIntersect: intersect,
      next: () => {
        next = pointerdownHandlerArr[i];
      },
      raycaster,
    });
  }
}

const onSaveScene = () => {
  saveScene();
};

function onDocumentKeyDown(event: any) {
  switch (event.keyCode) {
    // shift
    case 16:
      store.isShiftDown = true;
      break;

    // ctrl
    case 17:
      store.isCtrlDown = true;
      break;
    // s
    case 83:
      if (event.ctrlKey) {
        event.preventDefault();
        onSaveScene();
        return;
      }
      setMode("scale");
      break;
    // t
    case 84:
      setMode("translate");
      break;
    // r
    case 82:
      setMode("rotate");
      break;
  }
}

function onDocumentKeyUp(event: any) {
  switch (event.keyCode) {
    case 16:
      store.isShiftDown = false;
      break;
    case 17:
      store.isCtrlDown = false;
      break;
  }
}
