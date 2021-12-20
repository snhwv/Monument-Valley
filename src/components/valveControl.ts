import { unitWidth } from "@constants";
import {
  BufferGeometry,
  CylinderBufferGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Plane,
  Vector3,
} from "three";
import Component from "./lib/recordable";

// 控制杆
class ValveControl extends Component {
  constructor() {
    super();
  }
  generateElement(): void {
    this.generatePlug();
    this.generateRod();
  }

  plugHeight = unitWidth;
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
      this.plugHeight,
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

    const vm = new Matrix4();
    vm.makeRotationX(Math.PI / 2);
    verticalGeo.applyMatrix4(vm);

    var verticalCylinder = new Mesh(verticalGeo, cubeMaterial);

    const horizontalGeo = geometry.clone();

    const hm = new Matrix4();
    hm.makeRotationZ(Math.PI / 2);
    horizontalGeo.applyMatrix4(hm);

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

    const endm = new Matrix4();
    endGeometry.applyMatrix4(
      new Matrix4()
        .makeTranslation(this.rodWidth, 0, 0)
        .multiply(endm.makeRotationZ(Math.PI / 2))
    );

    var endCylinder = new Mesh(endGeometry, cubeMaterial);

    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();

      const meshm = new Matrix4();
      meshm.makeRotationAxis(new Vector3(0, 1, 0), (i * Math.PI) / 2);
      mesh.applyMatrix4(meshm);

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
