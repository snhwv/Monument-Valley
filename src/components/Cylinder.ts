import { unitWidth } from "@constants";
import { CylinderGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Cylinder extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateCylinder();
  }

  getDefaultProps() {
    return [
      {
        r: unitWidth / 2,
        height: unitWidth,
      },
    ];
  }

  generateCylinder() {
    const obj = this.userData.props?.[0];
    const r = obj?.r;
    const height = obj?.height;

    const geometry = new CylinderGeometry(r, r, height, 32);
    const material = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, -unitWidth / 2 + height / 2, 0);
    geometry.applyMatrix4(cubem);

    this.add(new Mesh(geometry, material));
  }
}
(Cylinder as any).cnName = "圆柱";
export default Cylinder;
