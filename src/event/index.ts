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
  ArrowHelper,
  BoxGeometry,
  Intersection,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Plane,
  PlaneHelper,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import Path from "@components/Path";
import { createMGraph, Floyd, getPath, MGraph } from "@utils/floyd";

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
function generateMGraph() {
  const nodes = Paths;
  const graph: any[][] = [];
  const nodesLength = nodes.length;

  for (let i = 0; i < nodesLength; i++) {
    graph[i] = [];
    for (let j = 0; j < nodesLength; j++) {
      graph[i][j] = Infinity;
    }
  }
  for (let i = 0; i < nodesLength; i++) {
    const node = nodes[i];
    node.userData.connectPointList.forEach((connectNode: Path) => {
      if (connectNode !== node) {
        const indexOfNodes = nodes.indexOf(connectNode);
        graph[i][indexOfNodes] = 1;
      }
    });
  }
  return graph;
}
const staticPathPointMap = new Map();
let pathPointMap = new Map();
let dynamicPathPointMap = new Map();

export const generateStaticMap = () => {
  staticPathPointMap.clear();
  Paths.filter((item) => item.userData.isStatic).forEach((item) => {
    item.userData.connectPointList = new Set();
    item.userData.pointPositionList.forEach((v: Vector3) => {
      const key = v
        .toArray()
        .map((item) => Number(item.toFixed(3)))
        .toString();
      if (!staticPathPointMap.has(key)) {
        staticPathPointMap.set(key, [item]);
      } else {
        staticPathPointMap.get(key).push(item);
      }
    });
  });
  const PathArrList = [...staticPathPointMap.values()];
  connectPath(PathArrList);
};

const connectPath = (PathArrList: Path[][]) => {
  PathArrList.forEach((pathArr) => {
    pathArr.forEach((path: Path) => {
      pathArr.forEach((path1: Path) => {
        (path.userData.connectPointList as Set<Path>).add(path1);
      });
    });
  });
};

const setPaths: IpinterdownHander = ({ mainGroupIntersect, next }) => {
  if (
    mainGroupIntersect &&
    (mainGroupIntersect as Path).constructor.name === "Path"
  ) {
    pathPointMap = new Map([...staticPathPointMap.entries()]);

    const dynamicPointArrList: Path[][] = [];
    Paths.filter((item) => !item.userData.isStatic).forEach((item) => {
      item.updatePointPositionList();
    });
    Paths.filter((item) => !item.userData.isStatic).forEach((item) => {
      item.userData.connectPointList = new Set();
      item.userData.pointPositionList.forEach((v: Vector3) => {
        const key = v
          .toArray()
          .map((item) => Number(item.toFixed(3)))
          .toString();
        if (!pathPointMap.has(key)) {
          const mapv = [item];
          dynamicPointArrList.push(mapv);
          pathPointMap.set(key, mapv);
        } else {
          const mapv = pathPointMap.get(key);
          dynamicPointArrList.push(mapv);
          mapv.push(item);
        }
      });
    });
    connectPath(dynamicPointArrList);

    const projectPlaneNormal = new Vector3().copy(camera.position).normalize();

    dynamicPathPointMap.clear();
    Paths.filter((item) => !item.userData.isStatic).forEach((item) => {
      item.userData.pointPositionList.forEach((v: Vector3) => {
        const projectV = new Vector3()
          .copy(v)
          .projectOnPlane(projectPlaneNormal);
        const key = projectV
          .toArray()
          .map((item) => Number(item.toFixed(3)))
          .toString();
        if (!dynamicPathPointMap.has(key)) {
          const mapv = [item];
          dynamicPathPointMap.set(key, mapv);
        } else {
          const mapv = dynamicPathPointMap.get(key);
          mapv.push(item);
        }
      });
    });
    connectPath([...dynamicPathPointMap.values()]);

    const G = new MGraph(Paths.length);
    createMGraph(generateMGraph(), G);
    Floyd(G);
    const wayPath = getPath(19, Paths.indexOf(mainGroupIntersect as Path));
    console.log(wayPath);

    if (wayPath.weight < 9999) {
      wayPath.path.forEach((item) => {
        Paths[item].setColor();
      });
    }

    // console.log(mainGroupIntersect);
    // (mainGroupIntersect.userData.connectPointList as Set<Path>).forEach(
    //   (item) => {
    //     item.setColor();
    //   }
    // );
  }
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
