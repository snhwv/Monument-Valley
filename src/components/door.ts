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
import { CSG } from "three-csg-ts";

// 门/窗
class Door extends Group {
  key: string;
  title: string;
  doorNumber: number;
  curveSegments: number;

  constructor();

  constructor(obj: { doorNumber: number; curveSegments: number });

  constructor(obj?: { doorNumber: number; curveSegments: number }) {
    super();
    this.doorNumber = obj?.doorNumber || 4;
    this.curveSegments = obj?.curveSegments || 1;
    mainGroup.add(this);
    this.userData.type = "door";
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();

    this.generateDoor();
  }

  generateDoor() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    const cube = new Mesh(cubeGeometry, cubeMaterial);

    const heartShape = new Shape();

    const doorDepth = unitWidth / 4;

    const doorWidth = unitWidth / 4;
    const doorTop = unitWidth / 4;

    heartShape.moveTo(-doorWidth / 2, unitWidth / 2 - doorTop);

    heartShape.absarc(
      0,
      unitWidth / 2 - doorTop,
      doorWidth / 2,
      (2 * Math.PI) / 2,
      0,
      true
    );

    heartShape.lineTo(doorWidth / 2, unitWidth / 2 - doorTop);
    heartShape.lineTo(doorWidth / 2, -unitWidth / 2);
    heartShape.lineTo(-doorWidth / 2, -unitWidth / 2);

    heartShape.lineTo(-doorWidth / 2, unitWidth / 2 - doorTop);

    const extrudeSettings = {
      depth: doorDepth,
      bevelEnabled: false,
      curveSegments: this.curveSegments,
    };

    const doorGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, unitWidth / 2 - doorDepth);
    doorGeometry.applyMatrix4(cubem);

    let subRes: Mesh = cube;
    for (let i = 0; i < this.doorNumber; i++) {
      const geo = doorGeometry.clone();

      const cubem = new Matrix4();
      cubem.makeRotationAxis(new Vector3(0, 1, 0), (i * Math.PI) / 2);
      geo.applyMatrix4(cubem);

      const doorItem = new Mesh(geo, cubeMaterial);

        subRes = CSG.subtract(subRes, doorItem);
    }
    this.add(subRes);
  }
}
export default Door;
