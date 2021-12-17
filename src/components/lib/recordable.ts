import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";
import { v4 } from "uuid";

class Component extends Group {
  key: string;
  title: string;
  args: any;
  constructor(...args: any) {
    super();
    this.args = args;
    mainGroup.add(this);
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();
  }
}
export default Component;
