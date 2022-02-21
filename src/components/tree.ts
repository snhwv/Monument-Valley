import { animate } from "popmotion";
import {
  CubicBezierCurve,
  DoubleSide,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshMatcapMaterial,
  TextureLoader,
  Vector2,
} from "three";
import Component from "./lib/recordable";
import matcap1 from "../assets/matcap/matcap4.png";
import { skew } from "@utils/index";

class Tree extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateCube();
  }
  getDefaultProps() {
    return [
      {
        segments: 6,
        divide: 5,
        width: 10,
        height: 30,
        xoffset: 0,
        yoffset: 0,
        zoffset: 0,
        bottomWidthFactor: 0.8,
      },
    ];
  }
  generateCube() {
    const obj = this.userData.props?.[0];

    const width = obj?.width;
    const height = obj?.height;
    const divide = obj?.divide;
    const segments = obj?.segments;
    const xoffset = obj?.xoffset;
    const yoffset = obj?.yoffset;
    const zoffset = obj?.zoffset;
    const bottomWidthFactor = obj?.bottomWidthFactor;

    const curve = new CubicBezierCurve(
      new Vector2(0, 0),
      new Vector2(width * 1, 0),
      new Vector2(width * 1, -height * 0.5),
      new Vector2(width * bottomWidthFactor, -height)
    );

    const pointArr = [];
    for (let i = 0; i < divide; i++) {
      pointArr.push(
        curve.getPoint(i / (divide - 1)).add(new Vector2(0, height))
      );
    }
    const geometry = new LatheGeometry(pointArr, segments);

    const material1 = this.getDefaultMaterial();
    const positionAttr = geometry.getAttribute("position");

    for (let i = 0; i < positionAttr.count; i++) {
      const offsetFactor = -positionAttr.getY(i) / height;
      let x = positionAttr.getX(i) + xoffset * offsetFactor;
      let y = positionAttr.getY(i) + yoffset * offsetFactor;
      let z = positionAttr.getZ(i) + zoffset * offsetFactor;

      if (i % divide && (i + 1) % divide) {
        x = x + (Math.random() - 0.5) * 0.8;
        y = y + (Math.random() - 0.5) * 2.4;
        z = z + (Math.random() - 0.5) * 0.8;
      }
      positionAttr.setXYZ(i, x, y, z);
    }
    for (let i = positionAttr.count - divide; i < positionAttr.count; i++) {
      const k = divide + 1 - (positionAttr.count - i);
      const x = positionAttr.getX(k);
      const y = positionAttr.getY(k);
      const z = positionAttr.getZ(k);

      positionAttr.setXYZ(i, x, y, z);
    }
    positionAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    const lathe = new Mesh(geometry, material1);
    this.userData.geometry = geometry;
    this.add(lathe);
    this.animateTree();
  }

  animateTree() {
    let total = 0.1;
    let lastMove = 0;
    animate({
      from: 0,
      to: 1,
      duration: 3000,
      repeat: Infinity,
      repeatType: "mirror",
      onUpdate: (latest: any) => {
        skew(total * latest - lastMove, this.userData.geometry);
        lastMove = total * latest;
      },
    });
  }

  getDefaultMaterial(params?: {
    textureSrc?: string;
    materialColor?: number | string;
  }) {
    const { textureSrc } = params || {};
    const texture = new TextureLoader().load(textureSrc || matcap1);

    const material = new MeshMatcapMaterial({
      matcap: texture,
      flatShading: true,
      side: DoubleSide,
    });

    return material;
  }
}
(Tree as any).cnName = "树";
(Tree as any).constName = "Tree";
export default Tree;
