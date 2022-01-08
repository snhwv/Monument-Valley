import { unitWidth } from "@constants";
import {
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
} from "three";
import Component from "./lib/recordable";

// 桥墩
class Pier extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generatePier();
  }

  generatePier() {
    const heartShape = new Shape();

    const pillarWidth = 4;

    heartShape.moveTo(-unitWidth / 2, unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2, -unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2 + pillarWidth, -unitWidth / 2);

    heartShape.absarc(
      unitWidth / 2,
      -unitWidth / 2,
      unitWidth - pillarWidth,
      (2 * Math.PI) / 2,
      Math.PI / 2,
      true
    );

    heartShape.lineTo(unitWidth / 2, unitWidth / 2);

    heartShape.lineTo(-unitWidth / 4, unitWidth / 2);

    const extrudeSettings = {
      depth: unitWidth,
      bevelEnabled: false,
      curveSegments: 2,
    };

    const cubeGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubeMaterial = this.getDefaultMaterial();

    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, -unitWidth / 2);
    cubeGeometry.applyMatrix4(cubem);

    var endCylinder = new Mesh(cubeGeometry, cubeMaterial);

    this.add(endCylinder);
  }
}
(Pier as any).cnName = "桥墩";
export default Pier;
