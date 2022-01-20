import Path from "@components/Path";
import { camera, Paths } from "@env";
import { movingPath } from "@game";
import { createMGraph, Floyd, getPath, MGraph } from "@utils/floyd";
import { Object3D, Vector3 } from "three";
import { IpinterdownHander } from "./store";

function generateMGraph(Paths: Path[]) {
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

const POSITION_PRECISION = 1;

export const generateStaticMap = () => {
  staticPathPointMap.clear();
  Paths.filter((item) => item.userData.isStatic).forEach((item) => {
    item.userData.connectPointList = new Set();
    item.userData.connectMap = new Map();
    item.userData.pointPositionList.forEach((v: Vector3) => {
      const key = v
        .toArray()
        .map((item) => Number(item.toFixed(POSITION_PRECISION)))
        .toString();
      if (!staticPathPointMap.has(key)) {
        staticPathPointMap.set(key, [item]);
      } else {
        staticPathPointMap.get(key).push(item);
      }
    });
  });
  // connectPath(PathArrList);

  staticPathPointMap.forEach((pathList: Path[], key: string) => {
    pathList.forEach((path: Path) => {
      pathList.forEach((path1: Path) => {
        (path.userData.connectPointList as Set<Path>).add(path1);
        if (path !== path1) {
          const tar = new Vector3().fromArray(
            key.split(",").map((item) => Number(item))
          );
          path.worldToLocal(tar);
          (path.userData.connectMap as Map<Path, Vector3>).set(path1, tar);
        }
      });
    });
  });
};

const connectPath = (PathArrList: Path[][]) => {
  PathArrList.forEach((pathArr) => {
    pathArr.forEach((path: Path) => {
      // 不能这样使用，因为同节点会存在PathArrList不同的子数组中，前面设置过的会被重置
      // path.userData.connectPointList = new Set([...pathArr])
      pathArr.forEach((path1: Path) => {
        (path.userData.connectPointList as Set<Path>).add(path1);
      });
    });
  });
};

const isVisible = (obj: Object3D | null) => {
  let visible = true;
  while (obj) {
    visible = visible && obj.visible;
    obj = obj.parent;
  }
  return visible;
};

export const setPaths: IpinterdownHander = ({ mainGroupIntersect, next }) => {
  let obj = mainGroupIntersect as Object3D | null;
  let visible = isVisible(obj);

  if (
    mainGroupIntersect &&
    (mainGroupIntersect as Path).constructor.name === "Path" &&
    visible
  ) {
    pathPointMap = new Map([...staticPathPointMap.entries()]);

    const dynamicPointArrList: Path[][] = [];

    const filteredPaths = Paths.filter((item) => {
      return !item.userData.isStatic && isVisible(obj);
    });

    filteredPaths.forEach((item) => {
      item.updatePointPositionList();
    });
    // 静态节点与动态节点的连接（采用硬性位置），要兼容静态节点连接方式（连接点所在世界三维空间位置）
    filteredPaths.forEach((item) => {
      item.userData.connectPointList = new Set();
      item.userData.pointPositionList.forEach((v: Vector3) => {
        const key = v
          .toArray()
          .map((item) => Number(item.toFixed(POSITION_PRECISION)))
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
    // connectPath(dynamicPointArrList);

    pathPointMap.forEach((pathList: Path[], key: string) => {
      pathList.forEach((path: Path) => {
        pathList.forEach((path1: Path) => {
          (path.userData.connectPointList as Set<Path>).add(path1);

          if (path !== path1) {
            const tar = new Vector3().fromArray(
              key.split(",").map((item) => Number(item))
            );
            path.worldToLocal(tar);
            if (path.userData.connectMap) {
              (path.userData.connectMap as Map<Path, Vector3>).set(path1, tar);
            } else {
              path.userData.connectMap = new Map();
              (path.userData.connectMap as Map<Path, Vector3>).set(path1, tar);
            }
          }
        });
      });
    });

    const projectPlaneNormal = new Vector3().copy(camera.position).normalize();

    // 动态节点与动态节点的连接（采用相机投影位置），视差连接
    dynamicPathPointMap.clear();
    filteredPaths.forEach((item) => {
      item.userData.pointPositionList.forEach((v: Vector3) => {
        const projectV = new Vector3()
          .copy(v)
          .projectOnPlane(projectPlaneNormal);
        const key = projectV
          .toArray()
          .map((item) => Number(item.toFixed(POSITION_PRECISION)))
          .toString();
        if (!dynamicPathPointMap.has(key)) {
          const mapv = [item];
          dynamicPathPointMap.set(key, mapv);
        } else {
          const mapv = dynamicPathPointMap.get(key);
          mapv.push(item);
          mapv.map((path: Path) => {
            mapv.map((path1: Path) => {
              if (path !== path1) {
                const v: Vector3 | null = path.userData.pointPositionList.find(
                  (vect: Vector3) => {
                    const projectV = new Vector3()
                      .copy(vect)
                      .projectOnPlane(projectPlaneNormal);
                    const pkey = projectV
                      .toArray()
                      .map((item) => Number(item.toFixed(POSITION_PRECISION)))
                      .toString();
                    return pkey === key;
                  }
                );
                if (v) {
                  path.worldToLocal(v);
                  if (path.userData.connectMap) {
                    (path.userData.connectMap as Map<Path, Vector3>).set(
                      path1,
                      v
                    );
                  } else {
                    path.userData.connectMap = new Map();
                    (path.userData.connectMap as Map<Path, Vector3>).set(
                      path1,
                      v
                    );
                  }
                }
              }
            });
          });
        }
      });
    });

    dynamicPathPointMap.forEach((pathList: Path[], key: string) => {
      pathList.forEach((path: Path) => {
        pathList.forEach((path1: Path) => {
          (path.userData.connectPointList as Set<Path>).add(path1);
        });
      });
    });

    const G = new MGraph(Paths.length);
    createMGraph(generateMGraph(Paths), G);
    Floyd(G);
    let index = 0;
    if (!movingPath.isMoving) {
      index = Paths.indexOf(movingPath.getAdaOn());
    } else if (movingPath.nextPath) {
      index = Paths.indexOf(movingPath.nextPath);
    }
    const wayPath = getPath(index, Paths.indexOf(mainGroupIntersect as Path));
    // console.log(wayPath);

    Paths.forEach((item) => {
      item.setColor(0xffff00);
    });
    if (wayPath.weight < 9999) {
      movingPath.setPathIndexList(wayPath.path);
      !movingPath.isMoving && movingPath.move();

      wayPath.path.forEach((item) => {
        // console.log(Paths[item].userData.connectMap);
        Paths[item].setColor();
      });
    }
  }
  next();
};
