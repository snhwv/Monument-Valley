import { unitWidth } from "@constants";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Cube extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateCube();
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = this.getDefaultMaterial();
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
(Cube as any).cnName = "正方体";
export default Cube;
