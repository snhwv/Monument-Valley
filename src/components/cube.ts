import { unitWidth } from "@constants";
import { BoxGeometry, Mesh, MeshLambertMaterial } from "three";
import Component from "./lib/recordable";

class Cube extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateCube();
  }
  matcap?: string;
  setMatcap(matcap: string) {
    this.matcap = matcap;
    this.changeProps(...JSON.parse(JSON.stringify(this.userData.props)));
    // this.changeProps(...this.userData.props);
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = this.getDefaultMaterial({ textureSrc: this.matcap });
    this.add(new Mesh(cubeGeometry, cubeMaterial));
  }
}
(Cube as any).cnName = "正方体";
(Cube as any).constName = "Cube";
export default Cube;
