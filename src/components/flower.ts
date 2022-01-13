import { unitWidth } from "@constants";
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
  TextureLoader,
} from "three";
import Component from "./lib/recordable";
import texture2 from "../assets/texture/texture2.png";

class Flower extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateCube();
  }
  generateCube() {
    const width = 1;
    const height = 18;
    const x = -width / 2,
      y = 0;

    const heartShape = new Shape();

    heartShape.moveTo(x, y);
    heartShape.bezierCurveTo(
      -12 - width / 2,
      height,
      12 + width / 2,
      height,
      width / 2,
      y
    );
    const geometry = new ShapeGeometry(heartShape);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const size = 5;
    const scale = 0.34;
    for (let i = 0; i < size; i++) {
      const geometry1 = geometry.clone();
      geometry1.rotateZ((Math.PI * 2 * i) / size);
      const mesh = new Mesh(geometry1, material);
      mesh.translateZ(2);
      mesh.scale.set(scale, scale, scale);
      this.add(mesh);
    }
  }
}
(Flower as any).cnName = "花";
export default Flower;
