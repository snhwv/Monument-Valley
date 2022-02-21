import { unitWidth } from "@constants";
import { CylinderGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

class Annulus extends Component {
  constructor();

  constructor(obj: { r0?: number; r1?: number; height?: number });

  constructor(
    obj?: { r0?: number; r1?: number; height?: number },
    ...rest: any
  ) {
    super(obj, ...rest);
  }

  getDefaultProps() {
    return [
      {
        r0: unitWidth / 2,
        r1: unitWidth / 4,
        height: unitWidth,
      },
    ];
  }

  generateElement() {
    this.generateCylinder();
  }
  generateCylinder() {
    const obj = this.userData.props?.[0];

    const r0 = obj?.r0;
    const r1 = obj?.r1;
    const height = obj?.height;

    const geometry = new CylinderGeometry(r0, r0, height, 32);
    const geometry1 = new CylinderGeometry(r1, r1, height, 32);
    const material = this.getDefaultMaterial();

    const cubem = new Matrix4();
    cubem.makeTranslation(0, -unitWidth / 2 + height / 2, 0);
    geometry.applyMatrix4(cubem);
    geometry1.applyMatrix4(cubem);

    const outMesh = new Mesh(geometry, material);

    let subRes: Mesh = outMesh;

    subRes = CSG.subtract(subRes, new Mesh(geometry1, material));

    this.add(subRes);
  }
}
(Annulus as any).cnName = "圆柱环";
(Annulus as any).constName = "Annulus";
export default Annulus;
