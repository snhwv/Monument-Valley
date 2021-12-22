import { unitWidth } from "@constants";
import {
  BoxGeometry,
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector3,
} from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

// 门/窗
class Door extends Component {
  constructor();

  constructor(obj: {
    doorNumber?: number;
    curveSegments?: number;
    width?: number;
    doorTop?: number;
    doorBottom?: number;
    doorWidth?: number;
  });

  constructor(
    obj?: {
      doorNumber?: number;
      curveSegments?: number;
      width?: number;
      doorTop?: number;
      doorBottom?: number;
      doorWidth?: number;
    },
    ...rest: any
  ) {
    super(obj, ...rest);
  }

  getDefaultProps() {
    return [
      {
        doorNumber: 1,
        curveSegments: 1,
        width: unitWidth,
        doorTop: unitWidth / 4,
        doorBottom: 0,
        doorWidth: unitWidth / 4,
      },
    ];
  }

  generateElement() {
    this.generateDoor();
  }
  generateDoor() {
    const obj = this.userData.props?.[0];

    const width = obj?.width;
    const doorWidth = obj?.doorWidth;
    const doorTop = obj?.doorTop;
    const doorBottom = obj?.doorBottom;
    const curveSegments = obj?.curveSegments;
    const doorNumber = obj?.doorNumber;

    const cubeGeometry = new BoxGeometry(width, unitWidth, width);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    const cube = new Mesh(cubeGeometry, cubeMaterial);

    const heartShape = new Shape();

    const doorDepth = unitWidth / 4;

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

    heartShape.lineTo(doorWidth / 2, -unitWidth / 2 + doorBottom);
    heartShape.lineTo(-doorWidth / 2, -unitWidth / 2 + doorBottom);

    heartShape.lineTo(-doorWidth / 2, unitWidth / 2 - doorTop);

    const extrudeSettings = {
      depth: doorDepth,
      bevelEnabled: false,
      curveSegments,
    };

    const doorGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, unitWidth / 2 - doorDepth);
    doorGeometry.applyMatrix4(cubem);

    let subRes: Mesh = cube;
    for (let i = 0; i < doorNumber; i++) {
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
(Door as any).cnName = "门窗";
export default Door;
