import Path from "@components/Path";
import { camera, Paths } from "@env";
import { createMGraph, Floyd, getPath, MGraph } from "@utils/floyd";
import { Vector3 } from "three";
import { IpinterdownHander } from "./store";

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

export const setPaths: IpinterdownHander = ({ mainGroupIntersect, next }) => {
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

    Paths.forEach((item) => {
      item.setColor(0xffff00);
    });

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
