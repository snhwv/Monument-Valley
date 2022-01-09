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

      const ways = [
        adaPathPoint,
        nextPathPoint,
        new Vector3(0, -unitWidth / 2, 0),
      ];

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
          this.isMoving = false;
          this.nextPath = null;
          this.setAdaOn(nextPath);
          if (nextPath.getProps()?.[0]?.isTrigger) {
            nextPath?.onTrigger();
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
              ways.shift();
              nextPath.attach(ada);
            }
            moveAdaToPoint();
          },
        });
      };
      if (nextPath !== adaPath) {
        moveAdaToPoint();
      }
    }
  }
}

export default MovingPath;
