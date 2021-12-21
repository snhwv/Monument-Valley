import Component from "./lib/recordable";

class CustomeGroup extends Component {
  constructor() {
    super();
  }

  generateElement() {}
}
(CustomeGroup as any).cnName = "组";
export default CustomeGroup;
