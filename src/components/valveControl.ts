import { unitWidth } from "@constants";
import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../layout/SceneTree";
import {
  BoxGeometry,
  BufferGeometry,
  CylinderBufferGeometry,
  Group,
  Mesh,
  MeshLambertMaterial,
  Plane,
} from "three";
import { v4 } from "uuid";
import { animate } from "popmotion";

class ValveControl extends Group {
  key: string;
  title: string;
  constructor() {
    super();
    mainGroup.add(this);
    this.userData.type = "valveControl";
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;
    updateSceneTree();
    this.generatePlug();
    this.generateRod();
  }

  plugWidth = 14;
  plugR = 7;

  rodWidth = 30;
  rodR = 2.2;
  rodEndWidth = 8;
  rodEndR = 3.4;

  plane!: Plane;

  // 中间的阀塞
  generatePlug() {
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    var geometry = new CylinderBufferGeometry(
      this.plugR,
      this.plugR,
      this.plugWidth,
      32
    );
    var cylinder = new Mesh(geometry, cubeMaterial);
    this.add(cylinder);
  }
  // 阀杆
  verticalCylinder!: Mesh;
  horizontalCylinder!: Mesh;
  endGeometry!: BufferGeometry;

  generateRod() {
    var rod = new Group();
    var geometry = new CylinderBufferGeometry(
      this.rodR,
      this.rodR,
      this.rodWidth * 2,
      32
    );
    const cubeMaterial = new MeshLambertMaterial({ color: 0xb6ae71 });
    const verticalGeo = geometry.clone();
    var verticalCylinder = new Mesh(verticalGeo, cubeMaterial);

    const horizontalGeo = geometry.clone();
    var horizontalCylinder = new Mesh(horizontalGeo, cubeMaterial);

    this.verticalCylinder = verticalCylinder;
    this.horizontalCylinder = horizontalCylinder;

    rod.add(verticalCylinder);
    rod.add(horizontalCylinder);

    var endGeometry = new CylinderBufferGeometry(
      this.rodEndR,
      this.rodEndR,
      this.rodEndWidth,
      32
    );
    this.endGeometry = endGeometry;
    var endCylinder = new Mesh(endGeometry, cubeMaterial);

    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();
      rod.add(mesh);
    }
    this.add(rod);
  }

  isShow = true;
  ratio = 0.33;
  //   hide() {
  //     if (!this.isShow) {
  //       return;
  //     }
  //     const mutation = { x: 1 };
  //     let moveDistence = this.rodWidth;
  //     this.isShow = false;
  //     const tween = new TWEEN.Tween(mutation)
  //       .to({ x: this.ratio }, 220)
  //       .easing(TWEEN.Easing.Back.Out)
  //       .onUpdate(() => {
  //         this.verticalCylinder.scale.set(1, 1, mutation.x);
  //         this.horizontalCylinder.scale.set(mutation.x, 1, 1);

  //         this.endGeometry.translate(
  //           0,
  //           moveDistence - this.rodWidth * mutation.x,
  //           0
  //         );
  //         moveDistence = this.rodWidth * mutation.x;
  //       });
  //     tween.start();
  //   }

  //   show() {
  //     if (this.isShow) {
  //       return;
  //     }
  //     const mutation = { x: 1 };
  //     let moveDistence = this.rodWidth;
  //     this.isShow = true;
  //     const tween = new TWEEN.Tween(mutation)
  //       .to({ x: this.ratio }, 220)
  //       .easing(TWEEN.Easing.Back.Out)
  //       .onUpdate(() => {
  //         this.verticalCylinder.scale.set(1, 1, 1 + this.ratio - mutation.x);
  //         this.horizontalCylinder.scale.set(1 + this.ratio - mutation.x, 1, 1);

  //         this.endGeometry.translate(
  //           0,
  //           -(moveDistence - this.rodWidth * mutation.x),
  //           0
  //         );
  //         moveDistence = this.rodWidth * mutation.x;
  //       });
  //     tween.start();
  //   }
}
export default ValveControl;
