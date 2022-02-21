import { unitWidth } from "@constants";
import {
  BoxGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Vector3,
} from "three";
import Component from "./lib/recordable";

// 支柱
class Pillar extends Component {
  pillarWidth!: number;
  width!: number;

  constructor();

  constructor(obj: { width?: number; pillarWidth?: number });

  constructor(obj?: { width?: number; pillarWidth?: number }, ...rest: any) {
    super(obj, ...rest);
  }

  getDefaultProps() {
    return [
      {
        width: unitWidth,
        pillarWidth: 1.6,
        number: 4,
      },
    ];
  }

  generateElement() {
    const obj = this.userData.props?.[0];

    this.width = obj?.width || unitWidth;
    this.pillarWidth = obj?.pillarWidth || unitWidth / 10;

    this.generatePillar();
  }

  generatePillar() {
    const cubeMaterial = this.getDefaultMaterial();

    const obj = this.userData.props?.[0];
    const number = obj?.number;
    const cubeGeometry = new BoxGeometry(
      this.pillarWidth,
      unitWidth,
      this.pillarWidth
    );

    const cubem = new Matrix4();
    cubem.makeTranslation(
      (this.width - this.pillarWidth) / 2,
      0,
      (this.width - this.pillarWidth) / 2
    );
    cubeGeometry.applyMatrix4(cubem);

    var endCylinder = new Mesh(cubeGeometry, cubeMaterial);

    for (let i = 0; i < number; i++) {
      const mesh = endCylinder.clone();

      const meshm = new Matrix4();
      meshm.makeRotationAxis(new Vector3(0, 1, 0), (i * Math.PI) / 2);
      mesh.applyMatrix4(meshm);

      this.add(mesh);
    }
  }
}
(Pillar as any).cnName = "支柱";
(Pillar as any).constName = "Pillar";
export default Pillar;
