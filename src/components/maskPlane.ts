import { unitWidth } from "@constants";
import {
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
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
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, unitWidth / 2, 0);
    geometry.applyMatrix4(cubem);
    this.add(new Mesh(geometry, cubeMaterial));
  }
}
(MaskPlane as any).cnName = "遮罩";
export default MaskPlane;
