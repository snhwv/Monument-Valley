import { scene } from "@env";
import { Plane, PlaneHelper, Vector3 } from "three";
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
    const helper = new PlaneHelper(this.userData.rotablePlane, 200, 0x00ff00);
    scene.add(helper);
  }
}
export default Rotable;
