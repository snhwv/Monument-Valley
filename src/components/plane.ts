import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import { BoxGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import { v4 } from "uuid";

class Plane extends Mesh {
  key: string;
  title: string;
  constructor() {
    const height = unitWidth / 6;

    const cubeGeometry = new BoxGeometry(unitWidth, height, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });

    const cubem = new Matrix4();
    cubem.makeTranslation(0, (unitWidth - height) / 2, 0);
    cubeGeometry.applyMatrix4(cubem);

    super(cubeGeometry, cubeMaterial);
    mainGroup.add(this);
    this.userData.type = "plane";
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();
  }
}
export default Plane;
