import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import {
  BoxBufferGeometry,
  BoxGeometry,
  ExtrudeGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Shape,
  Vector2,
  Vector3,
} from "three";
import { v4 } from "uuid";
import { CSG } from "three-csg-ts";

// 顶
class Roof extends Group {
  key: string;
  title: string;
  hatHeight = unitWidth * 2;
  constructor();

  constructor(obj: { doorNumber: number });

  constructor(obj?: { doorNumber: number }) {
    super();
    // this.doorNumber = obj?.doorNumber || 4;
    mainGroup.add(this);
    this.userData.type = "roof";
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();

    this.generateRoof();
  }

  generatePedestal() {
    const thickness = 1;
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    var geometry = new BoxBufferGeometry(
      unitWidth + 4,
      thickness,
      unitWidth + 4
    );

    const cubem = new Matrix4();
    cubem.makeTranslation(0, thickness / 2 - unitWidth / 2, 0);
    geometry.applyMatrix4(cubem);

    var cube = new Mesh(geometry, cubeMaterial);

    this.add(cube);
  }

  generateHat() {
    var shape = new Shape();
    const p1 = new Vector2(-unitWidth, 18);
    const p2 = new Vector2(0, 14);
    const p3 = new Vector2(0, this.hatHeight);

    shape.moveTo(-unitWidth / 2, 0);
    shape.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    const reflectP1 = new Vector2().copy(p1).multiply(new Vector2(-1, 1));
    const reflectP2 = new Vector2().copy(p2).multiply(new Vector2(-1, 1));

    shape.bezierCurveTo(
      reflectP2.x,
      reflectP2.y,
      reflectP1.x,
      reflectP1.y,
      unitWidth / 2,
      0
    );

    shape.lineTo(-unitWidth / 2, 0);

    const depth = unitWidth * 2;
    var extrudeSettings = {
      depth,
      bevelEnabled: false,
      curveSegments: 30,
    };

    var verticalGeometry = new ExtrudeGeometry(shape, extrudeSettings);

    const cubem = new Matrix4();
    cubem.makeTranslation(0, -unitWidth / 2, -unitWidth);
    verticalGeometry.applyMatrix4(cubem);

    var horizontalGeometry = verticalGeometry.clone();

    const hm = new Matrix4();
    hm.makeRotationY(Math.PI / 2);
    verticalGeometry.applyMatrix4(hm);

    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    const result = CSG.intersect(
      new Mesh(verticalGeometry, cubeMaterial),
      new Mesh(horizontalGeometry, cubeMaterial)
    );
    this.add(result);
  }

  generateRoof() {
    this.generateHat();
    this.generatePedestal();
  }
}
export default Roof;
