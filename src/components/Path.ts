import { unitWidth } from "@constants";
import { Paths } from "@env";
import {
  BoxGeometry,
  Color,
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
        isStatic: 1,
        isJump: 0,
        isTrigger: 0,
        isStop: 0,
        isStair: 0,
      },
    ];
  }
  onTrigger() {}
  generateElement() {
    this.userData.connectPointList = new Set();
    this.userData.pointPositionList = [];
    this.userData.sphereArr = [];

    const obj = this.userData.props?.[0];

    const width = obj?.width;

    const top = obj?.top;
    const bottom = obj?.bottom;
    const left = obj?.left;
    const right = obj?.right;
    const isStatic = obj?.isStatic;

    this.userData.isStatic = isStatic;
    const stairHalfWidth = Math.sqrt(Math.pow(width / 2, 2) * 2);

    const isStair = obj?.isStair;
    right && this.generateConnectPoint(new Vector3(width / 2, 0, 0));
    left && this.generateConnectPoint(new Vector3(-width / 2, 0, 0));
    top &&
      this.generateConnectPoint(
        new Vector3(0, 0, isStair ? -stairHalfWidth : -unitWidth / 2)
      );
    bottom &&
      this.generateConnectPoint(
        new Vector3(0, 0, isStair ? stairHalfWidth : unitWidth / 2)
      );
    this.generatePath();
    this.updatePointPositionList();
  }

  setColor(color?: number) {
    const { material } = this.userData.pathCenter;
    material.color = new Color(color || 0xff0000);
  }

  showMaterial(isShow: boolean) {
    const { connectMaterial, mainMaterial } = this.userData || {};
    if (connectMaterial) {
      connectMaterial.opacity = Number(isShow);
    }
    if (mainMaterial) {
      mainMaterial.opacity = Number(isShow);
    }
  }

  generateConnectPoint(offset: Vector3) {
    const obj = this.userData.props?.[0];

    const pointR = obj?.pointR;
    const height = obj?.height;

    const isStatic = obj?.isStatic;

    const geometry = new SphereGeometry(pointR, 32, 32);

    const material = new MeshLambertMaterial({
      color: isStatic ? 0xffff00 : 0x0000ff,
      // transparent: true,
      // opacity: 0,
    });

    // this.userData.connectMaterial = this.userData.connectMaterial || material;

    const sphere = new Mesh(geometry, material);

    sphere.position.add(offset).add(new Vector3(0, 0, 0));

    this.add(sphere);

    this.userData.sphereArr.push(sphere);
  }

  getCenterWorldPosition(target: Vector3) {
    return (this.userData.pathCenter as Mesh).getWorldPosition(target);
  }

  updatePointPositionList() {
    this.userData.pointPositionList = [];
    this.userData.sphereArr.forEach((item: Mesh) => {
      item.updateMatrixWorld(true);

      const p = new Vector3();
      item.getWorldPosition(p);

      this.userData.pointPositionList.push(p);
    });
  }
  clearConnectPointList() {
    this.userData.connectPointList = new Set();
  }

  generatePath() {
    const obj = this.userData.props?.[0];

    const height = obj?.height;
    const isStatic = obj?.isStatic;

    const geometry = new SphereGeometry(unitWidth / 4, 32, 32);
    // const geometry = new BoxGeometry(unitWidth, 4, unitWidth);
    const material = new MeshLambertMaterial({
      color: isStatic ? 0xffff00 : 0x0000ff,
      // transparent: true,
      // opacity: 0,
    });
    // this.userData.mainMaterial = material;
    const sphere = new Mesh(geometry, material);
    sphere.position.add(new Vector3(0, 0, 0));

    this.userData.pathCenter = sphere;
    this.add(sphere);
  }
}
(Path as any).cnName = "路径";
export default Path;
