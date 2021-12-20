import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { Group } from "three";
import { v4 } from "uuid";

abstract class Component extends Group {
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
    this.generateElement();
  }

  changeArgs(...args: any) {
    this.args = args;
    this.children.map((item) => {
      item.removeFromParent();
    });
    this.generateElement();
  }

  abstract generateElement(): void;
}
export default Component;
