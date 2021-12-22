import { unitWidth } from "@constants";
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
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

// 屋檐
class Eave extends Component {
  width0!: number;
  height0!: number;
  width1!: number;
  height1!: number;
  width2!: number;
  height2!: number;

  constructor();

  constructor(obj: {
    width0?: number;
    height0?: number;
    width1?: number;
    height1?: number;
    width2?: number;
    height2?: number;
  });

  constructor(
    obj?: {
      width0?: number;
      height0?: number;
      width1?: number;
      height1?: number;
      width2?: number;
      height2?: number;
    },
    ...rest: any
  ) {
    super(obj, ...rest);
  }

  getDefaultProps() {
    return [
      {
        width0: unitWidth / 9,
        height0: unitWidth / 9,
        width1: unitWidth / 9,
        height1: unitWidth / 9,
        width2: unitWidth / 9,
        height2: unitWidth / 9,
      },
    ];
  }

  generateElement() {
    const obj = this.userData.props?.[0];

    this.width0 = obj?.width0;
    this.height0 = obj?.height0;
    this.width1 = obj?.width1;
    this.height1 = obj?.height1;
    this.width2 = obj?.width2;
    this.height2 = obj?.height2;

    this.generateEave();
  }

  generateEave() {
    var rod = new Group();
    const heartShape = new Shape();

    const width0 = this.width0;
    const height0 = this.height0;

    const width1 = this.width1;
    const height1 = this.height1;

    const width2 = this.width2;
    const height2 = this.height2;

    heartShape.moveTo(-unitWidth / 2 + width0, -unitWidth / 2);
    heartShape.lineTo(-unitWidth / 2 + width0, -unitWidth / 2 + height0);
    heartShape.lineTo(
      -unitWidth / 2 + width0 + width1,
      -unitWidth / 2 + height0
    );
    heartShape.lineTo(
      -unitWidth / 2 + width0 + width1,
      -unitWidth / 2 + height0 + height1
    );
    heartShape.lineTo(
      -unitWidth / 2 + width0 + width1 + width2,
      -unitWidth / 2 + height0 + height1 + height2
    );

    heartShape.lineTo(
      -(-unitWidth / 2 + width0 + width1 + width2),
      -unitWidth / 2 + height0 + height1 + height2
    );
    heartShape.lineTo(
      -(-unitWidth / 2 + width0 + width1),
      -unitWidth / 2 + height0 + height1
    );
    heartShape.lineTo(
      -(-unitWidth / 2 + width0 + width1),
      -unitWidth / 2 + height0
    );
    heartShape.lineTo(-(-unitWidth / 2 + width0), -unitWidth / 2 + height0);
    heartShape.lineTo(-(-unitWidth / 2 + width0), -unitWidth / 2);

    heartShape.lineTo(-unitWidth / 2 + width0, -unitWidth / 2);

    // heartShape.moveTo(-unitWidth / 2, unitWidth / 2);

    // heartShape.lineTo(-unitWidth / 2, -unitWidth / 2);

    // heartShape.lineTo(-unitWidth / 2 + eaveWidth, -unitWidth / 2);

    // heartShape.lineTo(-unitWidth / 2 + eaveWidth, -unitWidth / 2 + eaveHeight);

    // heartShape.lineTo(
    //   -unitWidth / 2 + eaveWidth + eaveWidth1,
    //   -unitWidth / 2 + eaveHeight + eaveHeight1
    // );
    // heartShape.lineTo(
    //   unitWidth / 2 - eaveWidth - eaveWidth1,
    //   -unitWidth / 2 + eaveHeight + eaveHeight1
    // );

    // heartShape.lineTo(unitWidth / 2 - eaveWidth, -unitWidth / 2 + eaveHeight);

    // heartShape.lineTo(unitWidth / 2 - eaveWidth, -unitWidth / 2);

    // heartShape.lineTo(unitWidth / 2, -unitWidth / 2);

    // heartShape.lineTo(unitWidth / 2, unitWidth / 2);

    // heartShape.lineTo(-unitWidth / 2, unitWidth / 2);

    const extrudeSettings = {
      depth: unitWidth,
      bevelEnabled: false,
    };

    const verticalGeometry = new ExtrudeGeometry(heartShape, extrudeSettings);

    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, -unitWidth / 2);
    verticalGeometry.applyMatrix4(cubem);

    var horizontalGeometry = verticalGeometry.clone();

    const hm = new Matrix4();
    hm.makeRotationY(Math.PI / 2);
    horizontalGeometry.applyMatrix4(hm);

    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cube = new Mesh(cubeGeometry, cubeMaterial);

    let subRes: Mesh = cube;

    subRes = CSG.subtract(subRes, new Mesh(verticalGeometry, cubeMaterial));
    subRes = CSG.subtract(subRes, new Mesh(horizontalGeometry, cubeMaterial));

    this.add(subRes);
  }
}
(Eave as any).cnName = "屋檐";
export default Eave;
