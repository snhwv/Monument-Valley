import Component from "./lib/recordable";

class CustomeGroup extends Component {
  constructor(...args: any) {
    super(...args);
  }

  generateElement() {}
}
(CustomeGroup as any).cnName = "组";
export default CustomeGroup;
