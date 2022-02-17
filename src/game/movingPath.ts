import {
  ArrowHelper,
  Plane,
  PlaneHelper,
  Quaternion,
  Ray,
  Vector3,
} from "three";
import Path from "@components/Path";
import { camera, Paths, scene } from "@env";
import { ada } from "@game";
import { animate, keyframes, easeInOut, linear } from "popmotion";
import Component from "@components/lib/recordable";
import { unitWidth } from "@constants";

const POSITION_PRECISION = 1;

class MovingPath {
  currentPath!: Path;
  adaOnPath!: Path;
  pathIndexList!: number[];
  nextPath?: Path | null;
  isMoving = false;
  constructor() {
    this.generateElement();
  }
  generateElement() {}
  setCurrentPath(path: Path) {
    this.currentPath = path;
  }
  getCurrentPath() {
    return this.currentPath;
  }
  setPathIndexList(pathIndexList: number[]) {
    this.pathIndexList = pathIndexList;
  }
  getPathIndexList() {
    return this.pathIndexList;
  }
  getAdaOn() {
    return this.adaOnPath;
  }
  setAdaOn(path: Path) {
    this.adaOnPath = path;
    path.attach(ada);
  }
  move() {
    this.moveNext();
  }
  reset() {
    this.isMoving = false;
    this.nextPath = null;
  }
  moveNext() {
    const nextIndex = this.pathIndexList.shift();
    if (typeof nextIndex === "number") {
      this.isMoving = true;
      const nextPath = Paths[nextIndex];
      this.nextPath = nextPath;
      const adaPath = this.getAdaOn();
      if (adaPath.getFirstProps()?.isJump && nextPath.getFirstProps()?.isJump) {
        ada.setZIndex(100);
      }

      const adaPathPoint = adaPath.userData.connectMap.get(nextPath) as Vector3;

      const nextPathPoint = nextPath.userData.connectMap.get(
        adaPath
      ) as Vector3;

      const isConnected = this.isConnect(adaPath, nextPath);
      if (!isConnected) {
        this.reset();
        return;
      }

      const nextPathCenter = nextPath.getPathPointerCenter();
      console.log(nextPathCenter);
      const ways = [adaPathPoint, nextPathPoint, nextPathCenter];

      const moveAdaToPoint = () => {
        const nextPosition = ways.shift();
        if (!nextPosition) {
          const adaPath = this.getAdaOn();
          if (
            adaPath.getFirstProps()?.isJump &&
            nextPath.getFirstProps()?.isJump
          ) {
            ada.setZIndex(0);
          }
          this.reset();
          this.setAdaOn(nextPath);
          if (nextPath.getProps()?.[0]?.isTrigger) {
            nextPath?.onTrigger();
            if (!nextPath.getProps()?.[0]?.isStop) {
              this.moveNext();
            }
          } else {
            this.moveNext();
          }
          return;
        }

        const lookat = new Vector3().copy(nextPosition);
        ada.parent?.localToWorld(lookat);
        ada.lookAt(lookat);

        const originPosition = new Vector3().copy(ada.position);

        const subVector = new Vector3().copy(nextPosition).sub(originPosition);

        animate({
          from: 0,
          to: 1,
          duration: 100,
          ease: linear,
          onUpdate: (latest: any) => {
            const p = new Vector3().copy(subVector);

            ada.position.copy(
              new Vector3().copy(originPosition).add(p.multiplyScalar(latest))
            );
          },
          onComplete: () => {
            if (nextPosition === adaPathPoint) {
              const isConnect = this.isConnect(adaPath, nextPath);
              if (isConnect) {
                const nextWay = ways.shift();
                nextPath.attach(ada);
                ada.position.copy(nextWay!);
                moveAdaToPoint();
              } else {
                this.reset();
                ada.position.copy(originPosition);
              }
            } else {
              moveAdaToPoint();
            }
          },
        });
      };
      if (nextPath !== adaPath) {
        moveAdaToPoint();
      }
    }
  }
  isConnect(path0: Path, path1: Path) {
    if (!(path0.getFirstProps()?.isJump && path1.getFirstProps()?.isJump)) {
      return true;
    }

    const projectPlaneNormal = new Vector3().copy(camera.position).normalize();

    const pathPoint0 = (
      path0.userData.connectMap.get(path1) as Vector3
    )?.clone();
    const pathPoint1 = (
      path1.userData.connectMap.get(path0) as Vector3
    )?.clone();
    if (!(pathPoint0 && pathPoint1)) {
      return false;
    }

    path0.localToWorld(pathPoint0);
    path1.localToWorld(pathPoint1);

    const projectV0 = new Vector3()
      .copy(pathPoint0)
      .projectOnPlane(projectPlaneNormal)
      .toArray()
      .map((item) => Number(item.toFixed(POSITION_PRECISION)))
      .toString();
    const projectV1 = new Vector3()
      .copy(pathPoint1)
      .projectOnPlane(projectPlaneNormal)
      .toArray()
      .map((item) => Number(item.toFixed(POSITION_PRECISION)))
      .toString();

    // 判断两点是否连接
    return projectV0 === projectV1;
  }
}

export default MovingPath;
