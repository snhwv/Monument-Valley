import Cube from "@components/cube";
import { unitWidth } from "@constants";
import {
  camera,
  flatedComponents,
  mainGroup,
  scene,
  setMode,
  transformControls,
} from "@env";
import {
  BoxGeometry,
  Intersection,
  Mesh,
  MeshBasicMaterial,
  Raycaster,
  Vector2,
} from "three";

export const eventInit = () => {
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onDocumentKeyDown);
  document.addEventListener("keyup", onDocumentKeyUp);
};

const pointer = new Vector2();
const raycaster = new Raycaster();

let isShiftDown = false;
let isCtrlDown = false;

type IpinterdownHander = (event: {
  mainGroupIntersect: Intersection<Mesh>[];
  next: () => void;
  raycaster: Raycaster;
}) => void | undefined;

const crudComponents: IpinterdownHander = ({ mainGroupIntersect, next }) => {
  const intersect = mainGroupIntersect?.[0];
  if (!(intersect && (isShiftDown || isCtrlDown))) {
    next();
    return;
  }
  if (isShiftDown) {
    intersect.object.parent?.remove(intersect.object);
  } else if (isCtrlDown) {
    const cube = new Cube();
    cube.position.copy(rollOverMesh.position);
  }
};
const setTransformControl: IpinterdownHander = ({
  mainGroupIntersect,
  next,
}) => {
  if (transformControls.dragging) {
    next();
    return;
  }
  if (mainGroupIntersect.length > 0) {
    const intersect = mainGroupIntersect[0];
    if (intersect.object !== transformControls.object) {
      transformControls.detach();
      transformControls.attach(intersect.object);
    }
  }
  next();
};
const pointerdownHandlerArr: IpinterdownHander[] = [
  crudComponents,
  setTransformControl,
];

const rollOverGeo = new BoxGeometry(unitWidth, unitWidth, unitWidth);
const rollOverMaterial = new MeshBasicMaterial({
  color: 0xff0000,
  opacity: 0.5,
  transparent: true,
});
const rollOverMesh = new Mesh(rollOverGeo, rollOverMaterial);
scene.add(rollOverMesh);
rollOverMesh.visible = false;

function onPointerMove(event: any) {
  console.log("move");
  if (!isCtrlDown) {
    return;
  }

  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObject(mainGroup, true);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    if (!intersect.face?.normal) {
      return;
    }

    rollOverMesh.position
      .copy(intersect.object.position)
      .add(intersect.face.normal.multiplyScalar(unitWidth));
  }
}

function onPointerDown(event: any) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(flatedComponents, false);

  let next: any = pointerdownHandlerArr[0];
  let i = 0;
  while (next) {
    i++;
    const handler = next;
    next = null;
    handler({
      mainGroupIntersect: intersects,
      next: () => {
        next = pointerdownHandlerArr[i];
      },
      raycaster,
    });
  }
}

const saveScene = () => {
  console.log(mainGroup);
};

function onDocumentKeyDown(event: any) {
  switch (event.keyCode) {
    // shift
    case 16:
      isShiftDown = true;
      break;

    // ctrl
    case 17:
      isCtrlDown = true;
      rollOverMesh.visible = isCtrlDown;
      document.addEventListener("pointermove", onPointerMove);
      break;
    // s
    case 83:
      if (event.ctrlKey) {
        event.preventDefault();
        saveScene();
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
      isShiftDown = false;
      break;
    case 17:
      isCtrlDown = false;
      rollOverMesh.visible = isCtrlDown;
      document.removeEventListener("pointermove", onPointerMove);
      break;
  }
}
