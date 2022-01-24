import merge from "lodash.merge";
import Activeable from "./lib/activeable";
import Rotable from "./lib/rotable";

// 控制杆
class RotatableGroup extends Rotable {
  constructor(...args: any) {
    super(...args);
  }
  changeProps(...args: any) {
    const defaultProps = this?._getDefaultProps?.();
    if (defaultProps) {
      merge(this.userData.props, defaultProps, args);
    }
    const obj = this.userData.props?.[0];
    const zIndex = obj?.zIndex;

    if (zIndex) {
      this.renderOrder = zIndex;
    }

    this.name = obj?.name || "";

    this.generateElement();
  }
  generateElement() {}

  onRotateBegin() {
    console.log(this.children);
    this.children?.forEach((item) => {
      if (item instanceof Activeable) {
        item.onActive();
      }
    });
  }
  onRotateEnd() {
    this.children?.forEach((item) => {
      if (item instanceof Activeable) {
        item.onDeActive();
      }
    });
  }
}
(RotatableGroup as any).cnName = "旋转组";
export default RotatableGroup;
