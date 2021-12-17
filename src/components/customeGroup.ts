import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import { v4 } from "uuid";
import Component from "./lib/recordable";

class CustomeGroup extends Component {
  constructor() {
    super();
    this.userData.type = "customeGroup";
  }
}
export default CustomeGroup;
