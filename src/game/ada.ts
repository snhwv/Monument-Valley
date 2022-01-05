import { unitWidth } from "@constants";
import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";

class Ada extends Group {
  constructor() {
    super();
    this.generateElement();
  }
  generateElement() {
    this.generateCube();
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(unitWidth * 0.5, unitWidth * 0.5, unitWidth * 0.5);
    const material = new MeshLambertMaterial({
      color: 0xffae71,
      depthTest: true,
    });

    // this.renderOrder = 1;

    this.add(new Mesh(cubeGeometry, material));
  }
}

export default Ada;
