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
  constructor() {
    super();
  }
  generateElement() {
    this.generatePier();
  }

  generatePier() {
    const heartShape = new Shape();

    const pillarWidth = unitWidth / 6;

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
      curveSegments: 6,
    };

    const cubeGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, -unitWidth / 2);
    cubeGeometry.applyMatrix4(cubem);

    var endCylinder = new Mesh(cubeGeometry, cubeMaterial);

    this.add(endCylinder);
  }
}
export default Pier;