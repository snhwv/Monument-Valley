import { Plane, Vector3 } from "three";
import Component from "./recordable";
abstract class Moveable extends Component {
  constructor(...args: any) {
    super(...args);
    this.generateMovePlane();
  }
  worldPosition!: Vector3;
  generateMovePlane() {
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
    this.userData.movePlane = plane;
  }
  onMove(axis: Vector3, angle: number) {}
  onMoved(totalangle: number) {}
  abstract onMoveBegin(): void;
  abstract onMoveEnd(): void;
}
export default Moveable;
