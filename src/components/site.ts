import { unitWidth } from "@constants";
import { animate } from "popmotion";
import {
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector3,
} from "three";
import Component from "./lib/recordable";

class Site extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement(): void {
    this.generateSite();
  }
  getDefaultProps() {
    return [
      {
        siteHeight: unitWidth / 10,
      },
    ];
  }
  onTrigger() {
    const fromP = new Vector3().copy(this.position);
    const toP = new Vector3()
      .copy(this.position)
      .add(new Vector3(0, -(this.getFirstProps()?.siteHeight || 0), 0));
    animate({
      from: fromP,
      to: toP,
      duration: 200,
      onUpdate: (latest: any) => {
        this.position.copy(latest);
      },
    });
  }

  generateSite() {
    const obj = this.userData.props?.[0];

    const siteHeight = obj?.siteHeight;
    const cubeMaterial = this.getDefaultMaterial();

    const heartShape = new Shape();

    const width = unitWidth * 0.8;
    const radius = unitWidth / 8;

    heartShape.moveTo(-width / 2 + radius, width / 2);

    heartShape.lineTo(-width / 2, width / 2 - radius);

    heartShape.lineTo(-width / 2, -width / 2 + radius);

    heartShape.lineTo(-width / 2 + radius, -width / 2);

    heartShape.lineTo(width / 2 - radius, -width / 2);

    heartShape.lineTo(width / 2, -width / 2 + radius);

    heartShape.lineTo(width / 2, width / 2 - radius);

    heartShape.lineTo(width / 2 - radius, width / 2);

    heartShape.lineTo(-width / 2 + radius, width / 2);

    const extrudeSettings = {
      depth: siteHeight,
      bevelEnabled: false,
    };

    const doorGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubem = new Matrix4();
    cubem
      .makeTranslation(0, -unitWidth / 2 + siteHeight, 0)
      .multiply(new Matrix4().makeRotationX(Math.PI / 2));
    doorGeometry.applyMatrix4(cubem);

    const doorItem = new Mesh(doorGeometry, cubeMaterial);
    this.add(doorItem);
  }
}
(Site as any).cnName = "站点";
export default Site;
