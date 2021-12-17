import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import {
  BoxGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Vector3,
} from "three";
import { v4 } from "uuid";
import Component from "./lib/recordable";

// 支柱
class Pillar extends Component {
  pillarWidth: number;
  width: number;

  constructor();

  constructor(obj: { width?: number; pillarWidth?: number });

  constructor(obj?: { width?: number; pillarWidth?: number }) {
    super(obj);

    this.width = obj?.width || unitWidth;
    this.pillarWidth = obj?.pillarWidth || unitWidth / 10;

    this.userData.type = "pillar";
    this.generatePillar();
  }

  generatePillar() {
    var rod = new Group();
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

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
export default Pillar;
