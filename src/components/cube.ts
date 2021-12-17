import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import { v4 } from "uuid";
import Component from "./lib/recordable";

class Cube extends Component {
  constructor() {
    super();
    this.userData.type = "cube";
    this.generateCube();
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
export default Cube;
