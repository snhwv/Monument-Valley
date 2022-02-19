import { unitWidth } from "@constants";
import {
  ArrowHelper,
  BoxGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Vector3,
} from "three";

class Ada extends Group {
  material!: Material;
  constructor() {
    super();
    this.generateElement();
  }
  generateElement() {
    const dir = new Vector3(0,1,0);

    dir.normalize();

    const origin = new Vector3(0, 0, 0);
    const length = 40;
    const hex = 0xffff00;

    const arrowHelper = new ArrowHelper(dir, origin, length, hex);
    this.add(arrowHelper);
    this.generateCube();
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(
      unitWidth * 1,
      unitWidth * 1,
      unitWidth * 0.2
    );
    const material = new MeshLambertMaterial({
      color: 0xffae71,
      depthTest: false,
    });
    this.material = material;
    this.setZIndex(0);

    cubeGeometry.translate(0, (unitWidth * 1) / 2, 0);

    // const cubem = new Matrix4();
    // cubem.makeRotationY(Math.PI / 2);
    // cubeGeometry.applyMatrix4(cubem);

    this.add(new Mesh(cubeGeometry, material));
  }
  setZIndex(zIndex: number) {
    this.renderOrder = zIndex;
    this.material.depthTest = !zIndex;
  }
}

export default Ada;
