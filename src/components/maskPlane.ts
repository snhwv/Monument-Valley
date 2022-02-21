import { unitWidth } from "@constants";
import { Matrix4, Mesh, PlaneGeometry } from "three";
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
        width: unitWidth,
        height: unitWidth,
        offsetWidth: 0,
        offsetHeight: 0,
        offsetZ: 0,
      },
    ];
  }

  generatePlane() {
    const obj = this.userData.props?.[0];
    const {
      width = unitWidth,
      height = unitWidth,
      offsetWidth = 0,
      offsetHeight = 0,
      offsetZ = 0.01,
    } = obj;
    const geometry = new PlaneGeometry(width, height);
    const cubeMaterial = this.getDefaultMaterial();

    const cubem = new Matrix4();
    cubem.makeTranslation(
      unitWidth - width / 2 + offsetWidth + 0.0001,
      unitWidth - height / 2 + offsetHeight + 0.0001,
      offsetZ
    );
    geometry.applyMatrix4(cubem);

    const mesh = new Mesh(geometry, cubeMaterial);
    this.userData.planeMesh = mesh;
    this.add(mesh);
  }
}
(MaskPlane as any).cnName = "遮罩";
(MaskPlane as any).constName = "MaskPlane";
export default MaskPlane;
