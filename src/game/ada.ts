import Path from "@components/Path";
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
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const material = new MeshLambertMaterial({
      color: 0xffae71,
      depthTest: true,
    });

    this.add(new Mesh(cubeGeometry, material));
  }
}

export default Ada;
