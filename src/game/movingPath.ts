import { ArrowHelper, Plane, PlaneHelper, Ray, Vector3 } from "three";
import Path from "@components/Path";
import { camera, Paths, scene } from "@env";
import { ada } from "@game";
import { animate, keyframes, easeInOut, linear } from "popmotion";

class MovingPath {
  currentPath!: Path;
  adaOnPath!: Path;
  pathIndexList!: number[];
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
  }
  move() {
    this.moveNext();
  }
  moveNext() {
    const nextIndex = this.pathIndexList.shift();
    if (typeof nextIndex === "number") {
      const nextPath = Paths[nextIndex];
      const adaPath = this.getAdaOn();
      if (adaPath.getFirstProps()?.isJump && nextPath.getFirstProps()?.isJump) {
        ada.setZIndex(100);
      }

      const adaPathPointArrStr = adaPath.userData.connectMap.get(
        nextPath
      ) as string;
      const adaPathPoint = new Vector3().fromArray(
        adaPathPointArrStr.split(",").map((item) => Number(item))
      );

      const nextPathPointArrStr = nextPath.userData.connectMap.get(
        adaPath
      ) as string;
      const nextPathPoint = new Vector3().fromArray(
        nextPathPointArrStr.split(",").map((item) => Number(item))
      );

      console.log(adaPathPointArrStr, nextPathPointArrStr);

      const currentPosition = new Vector3();
      adaPath.getCenterWorldPosition(currentPosition);

      const p1 = new Vector3();
      nextPath.getCenterWorldPosition(p1);

      const ways = [adaPathPoint, nextPathPoint, p1];

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
          this.setAdaOn(nextPath);
          if (nextPath.getProps()?.[0]?.isTrigger) {
            nextPath?.onTrigger();
          } else {
            this.moveNext();
          }
          return;
        }
        ada.lookAt(nextPosition);

        animate({
          from: currentPosition,
          to: nextPosition,
          duration: 300,
          ease: linear,
          onUpdate: (latest: any) => {
            ada.position.copy(latest);
          },
          onComplete: () => {
            if (nextPosition === adaPathPoint) {
              const nextPathP = ways.shift();
              nextPathP && currentPosition.copy(nextPathP);
              nextPathP && ada.position.copy(nextPathP);
            } else {
              currentPosition.copy(nextPosition);
            }
            moveAdaToPoint();
          },
        });
      };

      if (nextPath !== adaPath) {
        moveAdaToPoint();
      }
      // const adaPathPoint = new Vector3().fromArray(a.split(",").map((item) => Number(item)));

      // const projectPlaneNormal = new Vector3()
      //   .copy(camera.position)
      //   .normalize();

      // const p1 = new Vector3();
      // nextPath.getCenterWorldPosition(p1);
      // const p2 = new Vector3();
      // adaPath.getCenterWorldPosition(p2);

      // const project1 = new Vector3()
      //   .copy(p1)
      //   .projectOnPlane(projectPlaneNormal);

      // const ray1 = new Ray(p1, new Vector3().subVectors(project1, p1));

      // const n = new Vector3().copy(adaPath.up);
      // adaPath.localToWorld(n);
      // n.sub(p2);

      // const plane = new Plane();
      // plane.setFromNormalAndCoplanarPoint(n, p2);

      // const v1 = new Vector3();
      // ray1.intersectPlane(plane, v1);

      // const a = new Vector3();
      // a.subVectors(p2, v1).negate().add(p2);

      // ada.lookAt(a);
      // if (nextPath !== adaPath) {
      //   this.moveAdaToPath(nextPath);
      // }
    }
  }
  moveAdaToPath(path: Path) {
    const fromPostion = new Vector3();
    const toPostion = new Vector3();
    ada.getWorldPosition(fromPostion);
    path.getCenterWorldPosition(toPostion);

    animate({
      from: fromPostion,
      to: toPostion,
      duration: 300,
      onUpdate: (latest: any) => {
        ada.position.copy(latest);
      },
      onComplete: () => {
        const adaPath = this.getAdaOn();
        if (adaPath.getFirstProps()?.isJump && path.getFirstProps()?.isJump) {
          ada.setZIndex(0);
        }
        this.setAdaOn(path);
        if (path.getProps()?.[0]?.isTrigger) {
          path?.onTrigger();
        } else {
          this.moveNext();
        }
      },
    });
  }
}

export default MovingPath;
