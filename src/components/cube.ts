import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";

class Cube extends Mesh {
  constructor() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    super(cubeGeometry, cubeMaterial);
    mainGroup.add(this);
    this.userData.type = "cube";
    flatedComponents.push(this);
  }
}
export default Cube as typeof Mesh;
