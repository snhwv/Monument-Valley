import { unitWidth } from "@constants";
import { Paths } from "@env";
import {
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import Component from "./lib/recordable";

class Path extends Component {
  constructor(obj: any, ...args: any) {
    super(obj, ...args);
    Paths.push(this);
  }
  getDefaultProps() {
    return [
      {
        width: unitWidth,
        height: unitWidth,
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
        pointR: 1,
      },
    ];
  }
  generateElement() {
    this.userData.connectPointList = [];
    this.userData.pointMatrixList = [];

    const obj = this.userData.props?.[0];

    const width = obj?.width;

    const top = obj?.top;
    const bottom = obj?.bottom;
    const left = obj?.left;
    const right = obj?.right;

    right && this.generateConnectPoint(new Vector3(width / 2, 0, 0));
    left && this.generateConnectPoint(new Vector3(-width / 2, 0, 0));
    top && this.generateConnectPoint(new Vector3(0, 0, -width / 2));
    bottom && this.generateConnectPoint(new Vector3(0, 0, width / 2));
    this.generatePath();
  }

  setColor() {
    const { material } = this.userData.pathCenter;
    material.color = 0xff0000;
  }

  generateConnectPoint(offset: Vector3) {
    const obj = this.userData.props?.[0];

    const pointR = obj?.pointR;
    const height = obj?.height;

    const geometry = new SphereGeometry(pointR, 32, 32);
    const material = new MeshLambertMaterial({ color: 0xffff00 });
    const sphere = new Mesh(geometry, material);

    sphere.position.add(offset).add(new Vector3(0, -height / 2, 0));

    sphere.updateWorldMatrix(false, false);
    this.userData.pointMatrixList.push(sphere.matrixWorld);
    this.add(sphere);
  }
  generatePath() {
    const obj = this.userData.props?.[0];

    const height = obj?.height;

    const geometry = new SphereGeometry(3, 32, 32);
    const material = new MeshLambertMaterial({ color: 0xffff00 });
    const sphere = new Mesh(geometry, material);
    sphere.position.add(new Vector3(0, -height / 2, 0));

    this.userData.pathCenter = sphere;
    this.add(sphere);
  }
}
(Path as any).cnName = "路径";
export default Path;
