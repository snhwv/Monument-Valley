import { unitWidth } from "@constants";
import { CylinderGeometry, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Cylinder extends Component {
  constructor() {
    super();
  }
  generateElement() {
    this.generateCylinder();
  }
  generateCylinder() {
    const geometry = new CylinderGeometry(unitWidth / 2, unitWidth / 2, unitWidth, 32);
    const material = new MeshLambertMaterial({ color: 0xb6ae71 });
    this.add(new Mesh(geometry, material));
  }
}
(Cylinder as any).cnName = "圆柱";
export default Cylinder;
