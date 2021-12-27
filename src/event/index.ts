import { componentTypes } from "@components";
import Cube from "@components/cube";
import { unitWidth } from "@constants";
import {
  camera,
  canvas,
  flatedComponents,
  getCanvasRect,
  mainGroup,
  Paths,
  scene,
  setMode,
  transformControls,
} from "@env";
import { saveScene, setTreeExpandedKeys } from "../layout/SceneTree";
import {
  BoxGeometry,
  Intersection,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Vector2,
} from "three";
import Path from "@components/Path";

const setPointer = (event: any) => {
  const rect = getCanvasRect();
  pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
};

export const eventInit = () => {
  canvas.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onDocumentKeyDown);
  document.addEventListener("keyup", onDocumentKeyUp);
};

const pointer = new Vector2();
const raycaster = new Raycaster();

let isShiftDown = false;
let isCtrlDown = false;

type IpinterdownHander = (event: {
  mainGroupIntersect?: Object3D;
  next: () => void;
  raycaster: Raycaster;
}) => void | undefined;

const crudComponents: IpinterdownHander = ({ mainGroupIntersect, next }) => {
  const intersect = mainGroupIntersect;
  if (!(intersect && (isShiftDown || isCtrlDown))) {
    next();
    return;
  }
  if (isShiftDown) {
    intersect.parent?.remove(intersect);
  } else if (isCtrlDown) {
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
  if (mainGroupIntersect) {
    const intersect = mainGroupIntersect;
    if (intersect !== transformControls.object) {
      transformControls.detach();
      transformControls.attach(intersect);

      setTreeExpandedKeys([intersect.id]);
    }
  }
  next();
};
const pathPointMap = new Map();
const setPaths: IpinterdownHander = ({ mainGroupIntersect, next }) => {
  Paths.forEach((item) => {
    item.userData.pointMatrixList.forEach((matrix: Matrix4) => {
      const key = matrix.elements.toString();
      if (!pathPointMap.has(key)) {
        pathPointMap.set(key, [item]);
      } else {
        pathPointMap.get(key).push(item);
      }
    });
  });
  const PathArrList = [...pathPointMap.values()].filter(
    (item) => item.length > 1
  );
  PathArrList.forEach((pathArr) => {
    pathArr.forEach((path: Path) => {
      path.userData.connectPointList.push(...pathArr);
    });
  });

  if (mainGroupIntersect) {
    const intersect = mainGroupIntersect;
    if (intersect !== transformControls.object) {
      transformControls.detach();
      transformControls.attach(intersect);

      setTreeExpandedKeys([intersect.id]);
    }
  }

  console.log(Paths);
  console.log(mainGroupIntersect);
  // console.log(pathPointMap);
  next();
};
const pointerdownHandlerArr: IpinterdownHander[] = [
  crudComponents,
  setTransformControl,
  setPaths,
];

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
      isShiftDown = true;
      break;

    // ctrl
    case 17:
      isCtrlDown = true;
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
      isShiftDown = false;
      break;
    case 17:
      isCtrlDown = false;
      break;
  }
}
