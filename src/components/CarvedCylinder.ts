import { unitWidth } from "@constants";
import {
  CylinderGeometry,
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector3,
} from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

class CarvedCylinder extends Component {
  doorNumber!: number;
  curveSegments!: number;
  doorTop!: number;
  doorBottom!: number;
  doorWidth!: number;
  r!: number;

  constructor();

  constructor(obj: {
    doorNumber?: number;
    curveSegments?: number;
    doorTop?: number;
    doorBottom?: number;
    doorWidth?: number;
    r?: number;
  });

  constructor(obj?: {
    doorNumber?: number;
    curveSegments?: number;
    doorTop?: number;
    doorBottom?: number;
    doorWidth?: number;
    r?: number;
  }) {
    super(obj);
  }

  generateElement() {
    const obj = this.args?.[0];

    this.doorNumber = obj?.doorNumber;
    this.curveSegments = obj?.curveSegments;
    this.doorTop = obj?.doorTop;
    this.doorBottom = obj?.doorBottom;
    this.doorWidth = obj?.doorWidth;
    this.r = obj?.r;

    this.generateCarvedCylinder();
  }

  getDefaultProps() {
    return [
      {
        doorNumber: 5,
        curveSegments: 2,
        doorTop: unitWidth / 4,
        doorBottom: 0,
        doorWidth: unitWidth / 4,
        r: unitWidth,
      },
    ];
  }

  generateCarvedCylinder() {
    const r = this.r;
    const geometry = new CylinderGeometry(r, r, unitWidth, 32);
    const material = new MeshLambertMaterial({ color: 0xb6ae71 });

    const heartShape = new Shape();

    const doorDepth = unitWidth / 4;

    const doorWidth = this.doorWidth;
    const doorTop = this.doorTop;
    const doorBottom = this.doorBottom;

    heartShape.moveTo(-doorWidth / 2, unitWidth / 2 - doorTop);

    heartShape.absarc(
      0,
      unitWidth / 2 - doorTop,
      doorWidth / 2,
      (2 * Math.PI) / 2,
      0,
      true
    );

    heartShape.lineTo(doorWidth / 2, -unitWidth / 2 + doorBottom);
    heartShape.lineTo(-doorWidth / 2, -unitWidth / 2 + doorBottom);

    heartShape.lineTo(-doorWidth / 2, unitWidth / 2 - doorTop);

    const extrudeSettings = {
      depth: doorDepth,
      bevelEnabled: false,
      curveSegments: this.curveSegments,
    };

    const doorGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const doorm = new Matrix4();
    doorm.makeTranslation(0, 0, r - doorDepth / 2);
    doorGeometry.applyMatrix4(doorm);

    let subRes: Mesh = new Mesh(geometry, material);
    for (let i = 0; i < this.doorNumber; i++) {
      const geo = doorGeometry.clone();

      const cubem = new Matrix4();
      cubem.makeRotationAxis(
        new Vector3(0, 1, 0),
        (i * 2 * Math.PI) / this.doorNumber
      );
      geo.applyMatrix4(cubem);

      const doorItem = new Mesh(geo, material);

      subRes = CSG.subtract(subRes, doorItem);
    }

    this.add(subRes);
  }
}
(CarvedCylinder as any).cnName = "镂空圆柱";
export default CarvedCylinder;
