import { Vector3 } from "three";
import Path from "@components/Path";
import { Paths } from "@env";
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
      if (nextPath !== this.getAdaOn()) {
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
      duration: 200,
      onUpdate: (latest: any) => {
        console.log(latest);
        ada.position.copy(latest);
      },
      onComplete: () => {
        this.setAdaOn(path);
        this.moveNext();
      },
    });
  }
}

export default MovingPath;
