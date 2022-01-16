import { scene } from "@env";
import { Plane, PlaneHelper, Vector3 } from "three";
import Component from "./recordable";
abstract class Rotable extends Component {
  constructor(...args: any) {
    super(...args);
    this.generateRotablePlane();
  }
  worldPosition!: Vector3;
  generateRotablePlane() {
    const p = new Vector3().copy(this.up);
    this.updateMatrixWorld(true);

    this.localToWorld(p);
    const plane = new Plane();
    const worldP1 = new Vector3();
    const worldP2 = new Vector3(1, 0, 0);
    const worldP3 = new Vector3(0, 0, 1);
    this.localToWorld(worldP1);
    this.localToWorld(worldP2);
    this.localToWorld(worldP3);
    this.worldPosition = worldP1;
    plane.setFromCoplanarPoints(worldP1, worldP3, worldP2);
    this.userData.rotablePlane = plane;
  }
  onRotate(axis: Vector3, angle: number) {}
  onRotated(totalangle: number) {}
  abstract onRotateBegin(): void;
  abstract onRotateEnd(): void;
}
export default Rotable;
