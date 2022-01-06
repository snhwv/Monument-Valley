import { Plane, Vector3 } from "three";
import Path from "@components/Path";
import { camera, Paths } from "@env";
import { ada } from "@game";
import { animate } from "popmotion";

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

      // const projectPlaneNormal = new Vector3()
      //   .copy(camera.position)
      //   .normalize();

      // const p1 = new Vector3();
      // nextPath.getWorldPosition(p1);
      // const p2 = new Vector3();
      // adaPath.getWorldPosition(p2);
      // const p3 = new Vector3();
      // ada.getWorldPosition(p3);

      // const v = new Vector3().subVectors(p1, p2);

      // const projectV = new Vector3().copy(v).projectOnPlane(projectPlaneNormal);
      // console.log(projectV);

      // const n = new Vector3().copy(adaPath.up);
      // projectV.projectOnPlane(n);
      // adaPath.localToWorld(n);
      // n.sub(p2);

      // v.projectOnPlane(n);
      // console.log(v);
      // v.add(p3);

      // ada.lookAt(v);
      if (nextPath !== adaPath) {
        this.moveAdaToPath(nextPath);
      }
    }
  }
  moveAdaToPath(path: Path) {
    const fromPostion = new Vector3();
    const toPostion = new Vector3();
    ada.getWorldPosition(fromPostion);
    path.getWorldPosition(toPostion);

    animate({
      from: fromPostion,
      to: toPostion,
      duration: 800,
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
