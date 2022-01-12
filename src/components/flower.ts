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
    // heartShape.
    heartShape.bezierCurveTo(
      -12 - width / 2,
      height,
      12 + width / 2,
      height,
      width / 2,
      y
    );

    // heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    // heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    // heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    // heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    // heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geometry = new ShapeGeometry(heartShape);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    // const mesh = new Mesh(geometry, material);
    // this.add(mesh);
    const size = 5;
    const scale = 0.5;
    for (let i = 0; i < size; i++) {
      const geometry1 = geometry.clone();
      geometry1.rotateZ((Math.PI * 2 * i) / size);
      const mesh = new Mesh(geometry1, material);
      mesh.scale.set(scale, scale, scale);
      this.add(mesh);
    }
    // const geometry = new PlaneGeometry(unitWidth, unitWidth);
    // const texture = new TextureLoader().load(texture2);

    // const material = new MeshMatcapMaterial({
    //   // depthTest: this.getZIndex() ? false : true,
    //   map: texture,
    //   transparent: true,
    // });
    // this.add(new Mesh(geometry, material));
  }
}
(Flower as any).cnName = "花";
export default Flower;
