import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import {
  BoxGeometry,
  ExtrudeGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector3,
} from "three";
import { v4 } from "uuid";

// 屋檐
class Eave extends Group {
  key: string;
  title: string;

  depth: number;

  eaveWidth: number;
  eaveHeight: number;
  eaveWidth1: number;
  eaveHeight1: number;

  constructor();

  constructor(obj: {
    depth?: number;
    eaveWidth?: number;
    eaveHeight?: number;
    eaveWidth1?: number;
    eaveHeight1?: number;
  });

  constructor(obj?: {
    depth?: number;
    eaveWidth?: number;
    eaveHeight?: number;
    eaveWidth1?: number;
    eaveHeight1?: number;
  }) {
    super();

    this.depth = obj?.depth || unitWidth / 6;

    this.eaveWidth = obj?.eaveWidth || unitWidth / 6;
    this.eaveHeight = obj?.eaveHeight || unitWidth / 6;
    this.eaveWidth1 = obj?.eaveWidth1 || unitWidth / 6;
    this.eaveHeight1 = obj?.eaveHeight1 || unitWidth / 6;

    mainGroup.add(this);
    this.userData.type = "eave";
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();
    this.generateEave();
  }

  generateEave() {
    var rod = new Group();
    const heartShape = new Shape();

    const eaveWidth = this.eaveWidth;
    const eaveHeight = this.eaveWidth;

    const eaveWidth1 = this.eaveWidth;
    const eaveHeight1 = this.eaveWidth;

    heartShape.moveTo(-unitWidth / 2, unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2, -unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2 + eaveWidth, -unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2 + eaveWidth, -unitWidth / 2 + eaveHeight);

    heartShape.lineTo(
      -unitWidth / 2 + eaveWidth + eaveWidth1,
      -unitWidth / 2 + eaveHeight + eaveHeight1
    );
    heartShape.lineTo(
      unitWidth / 2 - eaveWidth - eaveWidth1,
      -unitWidth / 2 + eaveHeight + eaveHeight1
    );

    heartShape.lineTo(unitWidth / 2 - eaveWidth, -unitWidth / 2 + eaveHeight);

    heartShape.lineTo(unitWidth / 2 - eaveWidth, -unitWidth / 2);

    heartShape.lineTo(unitWidth / 2, -unitWidth / 2);

    heartShape.lineTo(unitWidth / 2, unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2, unitWidth / 2);

    const extrudeSettings = {
      depth: this.depth,
      bevelEnabled: false,
    };

    const cubeGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, unitWidth / 2 - this.depth);
    cubeGeometry.applyMatrix4(cubem);

    var endCylinder = new Mesh(cubeGeometry, cubeMaterial);

    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();

      const meshm = new Matrix4();
      meshm.makeRotationAxis(new Vector3(0, 1, 0), (i * Math.PI) / 2);
      mesh.applyMatrix4(meshm);

      rod.add(mesh);
    }
    this.add(rod);
  }
}
export default Eave;
