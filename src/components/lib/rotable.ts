import { camera, renderer, scene } from "@env";
import { Plane, PlaneHelper, Vector3 } from "three";
import Component from "./recordable";
import SpinControls from "./spinControl";
abstract class Rotable extends Component {
  constructor(...args: any) {
    super(...args);
    this.generateRotablePlane();
  }
  generateRotablePlane() {
    const spinControlSmall = new SpinControls(
      this,
      100,
      camera,
      renderer.domElement
    );
    spinControlSmall.spinAxisConstraint = this.up;
    spinControlSmall.dampingFactor = 1.5; // Decreases to keep spinning longer after pointer release. Default is 1.0
    spinControlSmall.rotateSensitivity = 0.8; // Increase for faster spin. Multiplies pointer movement to ball rotation.

    // const p = new Vector3().copy(this.up);
    // this.updateMatrixWorld(true);

    // this.localToWorld(p);
    // const length = p.length() - 1;
    // this.userData.rotablePlane = new Plane(p.normalize(), -length);
    // const helper = new PlaneHelper(this.userData.rotablePlane, 200, 0x00ff00);
    // scene.add(helper);
  }
}
export default Rotable;
