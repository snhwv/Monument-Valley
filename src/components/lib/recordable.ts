import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { Group } from "three";
import { v4 } from "uuid";
import merge from "lodash.merge";
export function isFunction(val: unknown): val is Function {
  return typeof val === "function";
}
abstract class Component extends Group {
  key: string;
  title: string;
  constructor(...args: any) {
    super();
    this.userData.props = [];
    mainGroup.add(this);
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;

    if (isFunction(args?.[2])) {
      args?.[2](this);
    }

    if (args?.[1]) {
      this.changeProps(...args);
    }

    updateSceneTree();
  }

  changeProps(...args: any) {
    const childrenLength = this.children.length;

    for (let i = 0; i < childrenLength; i++) {
      this.children[0].removeFromParent();
    }

    const defaultProps = this?.getDefaultProps?.();
    if (defaultProps) {
      merge(this.userData.props, defaultProps, args);
    }
    this.generateElement();
  }
  getDefaultProps(): any[] {
    return [];
  }

  abstract generateElement(): void;
}
export default Component;
