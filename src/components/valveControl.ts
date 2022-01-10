import { unitWidth } from "@constants";
import {
  BufferGeometry,
  CircleGeometry,
  Color,
  CylinderBufferGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  Plane,
  TextureLoader,
  Vector3,
} from "three";
import Rotable from "./lib/rotable";
import matcap2 from "../assets/matcap/matcap2.png";
import matcap3 from "../assets/matcap/matcap3.png";
import texture1 from "../assets/texture/texture1.png";
import { animate, keyframes, easeInOut, linear } from "popmotion";

// 控制杆
class ValveControl extends Rotable {
  constructor(...args: any) {
    super(...args);
  }
  g!: Group;
  generateElement(): void {
    this.g = new Group();

    this.plugHeight = unitWidth * 0.7;
    this.plugR = 6.4;

    this.rodWidth = 22;
    this.rodR = 2.2;
    this.rodEndWidth = 6;
    this.rodEndR = 3.4;

    this.generatePlug();
    this.generateRod();
  }

  plugHeight = unitWidth * 0.6;
  plugR = 6;

  rodWidth = 30;
  rodR = 2.2;
  rodEndWidth = 8;
  rodEndR = 3.4;

  plane!: Plane;

  onRotateBegin() {
    const endMaterial = this.userData.endMaterial as MeshMatcapMaterial;
    const plugMaterial1 = this.userData.plugMaterial1 as MeshMatcapMaterial;
    const plugMaterial2 = this.userData.plugMaterial2 as MeshMatcapMaterial;
    animate({
      from: 1,
      to: 0,
      duration: 400,
      onUpdate: (latest) => {
        endMaterial.opacity = latest;
        plugMaterial1.opacity = latest;
        plugMaterial2.opacity = latest;
      },
    });
  }
  onRotateEnd() {
    const endMaterial = this.userData.endMaterial as MeshMatcapMaterial;
    const plugMaterial1 = this.userData.plugMaterial1 as MeshMatcapMaterial;
    const plugMaterial2 = this.userData.plugMaterial2 as MeshMatcapMaterial;
    animate({
      from: 0,
      to: 1,
      duration: 400,
      onUpdate: (latest) => {
        endMaterial.opacity = latest;
        plugMaterial1.opacity = latest;
        plugMaterial2.opacity = latest;
      },
    });
  }

  // 中间的阀塞
  generatePlug() {
    const texture = new TextureLoader().load(texture1);

    const material = new MeshMatcapMaterial({
      depthTest: this.getZIndex() ? false : true,
      map: texture,
    });

    const cubeMaterial = material;

    var geometry = new CylinderBufferGeometry(
      this.plugR,
      this.plugR,
      this.plugHeight,
      32
    );

    const geometry1 = new CircleGeometry(this.plugR, 32);
    const material1 = new MeshBasicMaterial({ color: 0xece4b2 });
    this.userData.plugMaterial1 = material1;
    const circle = new Mesh(geometry1, material1);

    const circleM = new Matrix4();
    circleM
      .makeTranslation(0, this.plugHeight / 2 + 0.01, 0)
      .multiply(
        new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), -Math.PI / 2)
      );
    geometry1.applyMatrix4(circleM);

    const geometry2 = geometry1.clone();
    geometry2.scale(0.5, 1, 0.5).translate(0, 0.01, 0);
    const material2 = new MeshBasicMaterial({ color: 0x6a6b39 });
    this.userData.plugMaterial2 = material2;
    const circle2 = new Mesh(geometry2, material2);
    this.g.add(circle);
    this.g.add(circle2);

    const cubem = new Matrix4();
    cubem.makeTranslation(0, this.plugHeight / 2 - unitWidth / 2, 0);
    this.g.applyMatrix4(cubem);

    var cylinder = new Mesh(geometry, cubeMaterial);
    this.g.add(cylinder);
  }
  // 阀杆
  generateRod() {
    var rod = new Group();
    var geometry = new CylinderBufferGeometry(
      this.rodR,
      this.rodR,
      this.rodWidth * 2,
      32
    );
    const cubeMaterial = this.getDefaultMaterial({ textureSrc: matcap2 });

    var verticalCylinder = new Mesh(geometry, cubeMaterial);

    const vm = new Matrix4();
    vm.makeRotationX(Math.PI / 2);
    verticalCylinder.applyMatrix4(vm);

    var horizontalCylinder = new Mesh(geometry, cubeMaterial);

    this.userData.verticalCylinder = verticalCylinder;
    this.userData.horizontalCylinder = horizontalCylinder;

    const hm = new Matrix4();
    hm.makeRotationZ(Math.PI / 2);
    horizontalCylinder.applyMatrix4(hm);

    rod.add(verticalCylinder);
    rod.add(horizontalCylinder);

    var endGeometry = new CylinderBufferGeometry(
      this.rodEndR,
      this.rodEndR,
      this.rodEndWidth,
      32
    );

    this.userData.endGeometry = endGeometry;

    const endm = new Matrix4();
    endGeometry.applyMatrix4(
      new Matrix4()
        .makeTranslation(this.rodWidth, 0, 0)
        .multiply(endm.makeRotationZ(Math.PI / 2))
    );
    const endMaterial = this.getDefaultMaterial({
      textureSrc: matcap3,
    });

    var endCylinder = new Mesh(endGeometry, endMaterial);
    endMaterial.transparent = false;
    this.userData.endMaterial = endMaterial;

    for (let i = 0; i < 4; i++) {
      const mesh = endCylinder.clone();
      const meshm = new Matrix4();
      meshm.makeRotationAxis(new Vector3(0, 1, 0), (i * Math.PI) / 2);
      mesh.applyMatrix4(meshm);

      rod.add(mesh);
    }
    this.g.add(rod);
    this.add(this.g);
  }

  disable() {
    if (this.userData.disabled) {
      return;
    }
    // 需要disabled掉点击旋转
    const verticalCylinder = this.userData.verticalCylinder as Mesh;
    const horizontalCylinder = this.userData.horizontalCylinder as Mesh;
    this.userData.disabled = true;
    let moveDistence = this.rodWidth;
    animate({
      from: 1,
      to: 0.5,
      duration: 200,
      onUpdate: (latest) => {
        verticalCylinder.scale.set(1, latest, 1);
        horizontalCylinder.scale.set(1, latest, 1);
        this.userData.endGeometry.translate(
          (this.rodWidth * latest - moveDistence) * 0.7,
          0,
          0
        );
        moveDistence = this.rodWidth * latest;
      },
    });
  }
  enable() {
    console.log("enable");
    if (!this.userData.disabled) {
      return;
    }
    const verticalCylinder = this.userData.verticalCylinder as Mesh;
    const horizontalCylinder = this.userData.horizontalCylinder as Mesh;

    this.userData.disabled = false;

    let moveDistence = this.rodWidth;
    animate({
      from: 1,
      to: 0.5,
      duration: 200,
      onUpdate: (latest) => {
        verticalCylinder.scale.set(1, 1 - latest + 0.5, 1);
        horizontalCylinder.scale.set(1, 1 - latest + 0.5, 1);
        this.userData.endGeometry.translate(
          -(this.rodWidth * latest - moveDistence) * 0.7,
          0,
          0
        );
        moveDistence = this.rodWidth * latest;
      },
    });
  }
}
(ValveControl as any).cnName = "控制点";
export default ValveControl;
