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

  getDefaultProps() {
    return [
      {
        zIndex: 0,
      },
    ];
  }
  generatePlane() {
    const obj = this.userData.props?.[0];
    const zIndex = obj?.zIndex;

    const geometry = new PlaneGeometry(unitWidth, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({
      color: 0xb6ae71,
      depthTest: zIndex ? false : true,
    });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, unitWidth / 2, 0);
    geometry.applyMatrix4(cubem);

    const mesh = new Mesh(geometry, cubeMaterial);
    this.add(mesh);

    if (zIndex) {
      mesh.renderOrder = zIndex;
    }
  }
}
(MaskPlane as any).cnName = "遮罩";
export default MaskPlane;
