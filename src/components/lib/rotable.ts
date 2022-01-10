import { Plane, Vector3 } from "three";
import Component from "./recordable";
abstract class Rotable extends Component {
  constructor(...args: any) {
    super(...args);
    this.generateRotablePlane();
  }
  generateRotablePlane() {
    const p = new Vector3().copy(this.up);
    this.updateMatrixWorld(true);

    this.localToWorld(p);
    const length = p.length() - 1;
    this.userData.rotablePlane = new Plane(p.normalize(), -length);
  }
  onRotate(axis: Vector3, angle: number) {}
  onRotated(totalangle: number) {}
  abstract onRotateBegin(): void;
  abstract onRotateEnd(): void;
}
export default Rotable;
