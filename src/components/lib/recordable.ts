import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { Group } from "three";
import { v4 } from "uuid";
import merge from "lodash.merge";

abstract class Component extends Group {
  key: string;
  title: string;
  args: any;
  constructor(...args: any) {
    super();
    this.args = [];
    mainGroup.add(this);
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    this.changeArgs(...args);
    updateSceneTree();
  }

  changeArgs(...args: any) {
    this.children.map((item) => {
      item.removeFromParent();
    });
    const defaultProps = this?.getDefaultProps?.();
    if (defaultProps) {
      merge(this.args, defaultProps, args);
    }
    this.generateElement();
  }
  getDefaultProps(): any[] {
    return [];
  }

  abstract generateElement(): void;
}
export default Component;
