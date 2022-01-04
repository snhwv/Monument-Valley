import { unitWidth } from "@constants";
import {
  Matrix4,
  Mesh,
  PlaneGeometry,
} from "three";
import Component from "./lib/recordable";

class MaskPlane extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement(): void {
    this.generatePlane();
  }

  generatePlane() {

    const geometry = new PlaneGeometry(unitWidth, unitWidth);
    const cubeMaterial = this.getDefaultMaterial();

    const cubem = new Matrix4();
    cubem.makeTranslation(0, unitWidth / 2, 0);
    geometry.applyMatrix4(cubem);

    const mesh = new Mesh(geometry, cubeMaterial);
    this.add(mesh);
  }
}
(MaskPlane as any).cnName = "遮罩";
export default MaskPlane;
