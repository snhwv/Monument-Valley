import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { Group, MeshLambertMaterial } from "three";
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

    const defaultProps = this?._getDefaultProps?.();
    if (defaultProps) {
      merge(this.userData.props, defaultProps, args);
    }
    const obj = this.userData.props?.[0];
    const zIndex = obj?.zIndex;

    if (zIndex) {
      this.renderOrder = zIndex;
    }

    this.generateElement();
  }

  getDefaultMaterial() {
    const material = new MeshLambertMaterial({
      color: 0xb6ae71,
      depthTest: this.getZIndex() ? false : true,
    });
    return material;
  }

  getZIndex(): number {
    const obj = this.userData.props?.[0];
    return obj?.zIndex || 0;
  }
  _getDefaultProps(): any[] {
    return merge(this.getDefaultProps(), [{ zIndex: 0 }]);
  }
  getDefaultProps(): any[] {
    return [];
  }

  abstract generateElement(): void;
}
export default Component;
