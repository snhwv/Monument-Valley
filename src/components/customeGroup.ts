import merge from "lodash.merge";
import Component from "./lib/recordable";

class CustomeGroup extends Component {
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
}
(CustomeGroup as any).cnName = "组";
(CustomeGroup as any).constName = "CustomeGroup";
export default CustomeGroup;
