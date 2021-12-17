import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import { v4 } from "uuid";

class Site extends Mesh {
  key: string;
  title: string;
  constructor() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    super(cubeGeometry, cubeMaterial);
    mainGroup.add(this);
    this.userData.type = "site";
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();
  }
}
export default Site;
