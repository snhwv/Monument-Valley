import { unitWidth } from "@constants";
import { CylinderGeometry, Mesh, MeshLambertMaterial } from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

class Annulus extends Component {
  r0!: number;
  r1!: number;

  constructor();

  constructor(obj: { r0?: number; r1?: number });

  constructor(obj?: { r0?: number; r1?: number }) {
    super(obj);
  }

  getDefaultProps() {
    return [
      {
        r0: unitWidth / 2,
        r1: unitWidth / 4,
      },
    ];
  }

  generateElement() {
    const obj = this.args?.[0];

    this.r0 = obj?.r0;
    this.r1 = obj?.r1;

    this.generateCylinder();
  }
  generateCylinder() {
    const r0 = this.r0;
    const r1 = this.r1;
    const geometry = new CylinderGeometry(r0, r0, unitWidth, 32);
    const geometry1 = new CylinderGeometry(r1, r1, unitWidth, 32);
    const material = new MeshLambertMaterial({ color: 0xb6ae71 });

    const outMesh = new Mesh(geometry, material);

    let subRes: Mesh = outMesh;

    subRes = CSG.subtract(subRes, new Mesh(geometry1, material));

    this.add(subRes);
  }
}
(Annulus as any).cnName = "圆柱环";
export default Annulus;
