import { unitWidth } from "@constants";
import { Paths } from "@env";
import {
  ArrowHelper,
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
        R: 0,
        index: 0,
        circleDivide: 16,
        upInvert: 0,
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

    const R = obj?.R;
    const circleDivide = obj?.circleDivide;
    const index = obj?.index;

    this.userData.isStatic = isStatic;
    const stairHalfWidth = Math.sqrt(Math.pow(width / 2, 2) * 2);

    const isStair = obj?.isStair;

    if (R) {
      const rightPosition = new Vector3().setFromCylindricalCoords(
        R,
        (index * Math.PI * 2) / circleDivide +
          (Math.PI * 2) / (circleDivide * 2),
        0
      );
      const leftPosition = new Vector3().setFromCylindricalCoords(
        R,
        (index * Math.PI * 2) / circleDivide -
          (Math.PI * 2) / (circleDivide * 2),
        0
      );
      right && this.generateConnectPoint(rightPosition);
      left && this.generateConnectPoint(leftPosition);
    } else {
      right && this.generateConnectPoint(new Vector3(width / 2, 0, 0));
      left && this.generateConnectPoint(new Vector3(-width / 2, 0, 0));
    }

    top &&
      this.generateConnectPoint(
        new Vector3(0, 0, isStair ? -stairHalfWidth : -unitWidth / 2)
      );
    bottom &&
      this.generateConnectPoint(
        new Vector3(0, 0, isStair ? stairHalfWidth : unitWidth / 2)
      );

    const pathPosition = new Vector3().setFromCylindricalCoords(
      R,
      (index * Math.PI * 2) / circleDivide,
      0
    );
    this.generatePath(pathPosition);
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
      transparent: true,
      opacity: 0,
    });

    this.userData.connectMaterial = this.userData.connectMaterial || material;

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

  generatePath(offset: Vector3 = new Vector3(0, 0, 0)) {
    const obj = this.userData.props?.[0];

    const height = obj?.height;
    const isStatic = obj?.isStatic;

    const upInvert = obj?.upInvert;

    // const geometry = new SphereGeometry(unitWidth / 4, 32, 32);
    const geometry = new BoxGeometry(unitWidth, 4, unitWidth);
    const material = new MeshLambertMaterial({
      color: isStatic ? 0xffff00 : 0x0000ff,
      transparent: true,
      opacity: 0,
    });
    this.userData.mainMaterial = material;
    const sphere = new Mesh(geometry, material);
    sphere.position.add(offset);

    this.userData.pathCenter = sphere;

    let up = new Vector3(0, 1, 0);
    if (offset.lengthSq()) {
      up = offset.negate().normalize();
    }
    if (upInvert) {
      up = up.negate();
    }

    const dir = up;
    sphere.up.copy(up);

    dir.normalize();

    const origin = new Vector3(0, 0, 0);
    const length = 40;
    const hex = 0xffff00;

    // 编辑辅助线
    const arrowHelper = new ArrowHelper(dir, origin, length, hex);
    // sphere.add(arrowHelper);

    this.add(sphere);
  }

  getPathPointerCenter() {
    const pathCenter = this.userData.pathCenter;
    console.log(pathCenter.position);
    return pathCenter.position;
  }
}
(Path as any).cnName = "路径";
(Path as any).constName = "Path";
export default Path;
