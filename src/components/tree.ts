import {
  CubicBezierCurve,
  LatheGeometry,
  Mesh,
  MeshMatcapMaterial,
  TextureLoader,
  Vector2,
} from "three";
import Component from "./lib/recordable";
import matcap1 from "../assets/matcap/matcap4.png";

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
      new Vector2(width * 1, height * 0.5),
      new Vector2(width * bottomWidthFactor, height)
    );

    const pointArr = [];
    for (let i = 0; i < divide; i++) {
      pointArr.push(
        // Math.pow(2, i) / Math.pow(2, divide)
        curve.getPoint(i / (divide - 1)).multiplyScalar(10)
      );
    }
    console.log(height * 10);
    // const points = curve.getPoints(50);
    // const geometry = new BufferGeometry().setFromPoints(points);

    // const material = new LineBasicMaterial({ color: 0xff0000 });

    // Create the final object to add to the scene
    // const curveObject = new Line(geometry, material);
    // this.add(curveObject);
    const geometry1 = new LatheGeometry(pointArr, segments);
    geometry1.rotateX(Math.PI);
    const material1 = this.getDefaultMaterial();
    const positionAttr = geometry1.getAttribute("position");

    for (let i = 0; i < positionAttr.count; i++) {
      const offsetFactor = - positionAttr.getY(i) / (height * 10);
      let x = positionAttr.getX(i) + xoffset * offsetFactor;
      let y = positionAttr.getY(i) + yoffset * offsetFactor;
      let z = positionAttr.getZ(i) + zoffset * offsetFactor;
      console.log(offsetFactor);

      if (i % divide && (i + 1) % divide) {
        x = x + (Math.random() - 0.5) * 8;
        y = y + (Math.random() - 0.5) * 24;
        z = z + (Math.random() - 0.5) * 8;
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
    geometry1.computeVertexNormals();

    const lathe = new Mesh(geometry1, material1);
    lathe.scale.set(0.1, 0.1, 0.1);
    this.add(lathe);
  }

  getDefaultMaterial(params?: {
    textureSrc?: string;
    materialColor?: number | string;
  }) {
    const { textureSrc } = params || {};
    const texture = new TextureLoader().load(textureSrc || matcap1);

    const obj = this.userData.props?.[0];
    const material = new MeshMatcapMaterial({
      // depthTest: this.getZIndex() ? false : true,
      matcap: texture,
      flatShading: true,
    });

    return material;
  }
}
(Tree as any).cnName = "树";
export default Tree;
