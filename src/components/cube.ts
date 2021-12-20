import { unitWidth } from "@constants";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Cube extends Component {
  constructor() {
    super();
  }
  generateElement() {
    this.generateCube();
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
export default Cube;
