import { unitWidth } from "@constants";
import { BoxGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Plane extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement(): void {
    this.generatePlane();
  }
  getDefaultProps() {
    return [
      {
        height: 4,
      },
    ];
  }
  generatePlane() {
    const obj = this.userData.props?.[0];

    const height = obj?.height || 4;
    const cubeGeometry = new BoxGeometry(unitWidth, height, unitWidth);
    const cubeMaterial = this.getDefaultMaterial();

    const cubem = new Matrix4();
    cubem.makeTranslation(0, (unitWidth - height) / 2, 0);
    cubeGeometry.applyMatrix4(cubem);
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
(Plane as any).cnName = "桥板";
(Plane as any).constName = "Plane";
export default Plane;
