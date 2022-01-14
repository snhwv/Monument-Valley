import { unitWidth } from "@constants";
import {
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
} from "three";
import Component from "./lib/recordable";

// 楼梯
class Stair extends Component {
  constructor(...args: any) {
    super(...args);
  }
  stairNumPerCube = 8;
  stairWidth = unitWidth / this.stairNumPerCube;
  size = 1;
  hasPedestal = 1;
  generateElement() {
    const obj = this.userData.props?.[0];
    this.hasPedestal = obj?.hasPedestal;
    this.size = 1;
    this.stairNumPerCube = 8;
    this.stairWidth = unitWidth / this.stairNumPerCube;
    this.generateStair();
  }

  getDefaultProps() {
    return [
      {
        hasPedestal: 1,
      },
    ];
  }

  line(x: number) {
    return -x + unitWidth * this.size + this.stairWidth;
  }

  generateStair() {
    var shape = new Shape();
    if (!this.hasPedestal) {
      shape.moveTo(0, unitWidth * this.size - this.stairWidth);
    }
    for (
      let i = this.stairWidth;
      i < unitWidth * this.size + this.stairWidth;
      i += this.stairWidth
    ) {
      // i => x
      shape.lineTo(i - this.stairWidth, this.line(i));
      shape.lineTo(i, this.line(i));
    }
    shape.lineTo(unitWidth * this.size, this.hasPedestal ? 0 : -this.size * 2);
    if (!this.hasPedestal) {
      shape.lineTo(unitWidth * this.size - this.stairWidth, 0);
    }

    var extrudeSettings = {
      depth: unitWidth,
      bevelEnabled: false,
    };

    var geometry = new ExtrudeGeometry(shape, extrudeSettings);

    const cubem = new Matrix4();
    cubem.makeTranslation(-unitWidth / 2, 0, -unitWidth / 2);
    geometry.applyMatrix4(cubem);

    var mesh = new Mesh(geometry, this.getDefaultMaterial());
    this.add(mesh);
  }
}
(Stair as any).cnName = "楼梯";
export default Stair;
