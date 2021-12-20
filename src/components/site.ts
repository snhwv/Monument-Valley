import { unitWidth } from "@constants";
import {
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
} from "three";
import Component from "./lib/recordable";

class Site extends Component {
  constructor() {
    super();
  }
  generateElement(): void {
    this.generateSite();
  }

  generateSite() {
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const heartShape = new Shape();

    const width = unitWidth * 0.8;
    const radius = unitWidth / 8;

    const siteHeight = unitWidth / 10;

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
export default Site;