import { unitWidth } from "@constants";
import {
  BoxBufferGeometry,
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Vector3,
} from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

class Altar extends Component {
  constructor() {
    super();
  }
  generateElement() {
    this.generateAltar();
    this.generatePedestal();
  }

  generatePedestal() {
    const thickness = 1;
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    var geometry = new BoxBufferGeometry(
      unitWidth + 4,
      thickness,
      unitWidth + 4
    );

    const cubem = new Matrix4();
    cubem.makeTranslation(0, thickness / 2 - unitWidth / 2, 0);
    geometry.applyMatrix4(cubem);

    var cube = new Mesh(geometry, cubeMaterial);

    this.add(cube);
  }
  generateAltar() {
    const height = unitWidth / 8;
    const hcubeGeometry = new BoxGeometry(
      unitWidth * 0.8,
      height,
      unitWidth * 0.8
    );

    const hmeshm = new Matrix4().makeTranslation(
      0,
      -(unitWidth - height) / 2,
      0
    );
    hcubeGeometry.applyMatrix4(hmeshm);

    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    const hMesh = new Mesh(hcubeGeometry, cubeMaterial);

    const vcubeGeometry = hcubeGeometry.clone();

    const meshm = new Matrix4();
    meshm.makeRotationAxis(new Vector3(0, 1, 0), Math.PI / 4);
    vcubeGeometry.applyMatrix4(meshm);

    const vMesh = new Mesh(vcubeGeometry, cubeMaterial);
    const unionRes = CSG.union(hMesh, vMesh);
    this.add(unionRes);
  }
}
export default Altar;
