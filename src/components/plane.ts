import { unitWidth } from "@constants";
import { BoxGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Plane extends Component {
  constructor() {
    super();
  }

  generateElement(): void {
    this.generatePlane();
  }

  generatePlane() {
    const height = unitWidth / 6;
    const cubeGeometry = new BoxGeometry(unitWidth, height, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, (unitWidth - height) / 2, 0);
    cubeGeometry.applyMatrix4(cubem);
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
(Plane as any).cnName = "桥板";
export default Plane;
