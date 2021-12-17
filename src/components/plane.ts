import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import { BoxGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import { v4 } from "uuid";
import Component from "./lib/recordable";

class Plane extends Component {
  constructor() {
    super();
    this.userData.type = "plane";

    this.generatePlane();
  }
  generatePlane() {
    const height = unitWidth / 6;
    const cubeGeometry = new BoxGeometry(unitWidth, height, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, (unitWidth - height) / 2, 0);
    cubeGeometry.applyMatrix4(cubem);
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
export default Plane;
