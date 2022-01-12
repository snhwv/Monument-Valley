import {
  BoxGeometry,
  CylinderGeometry,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  Object3D,
  Quaternion,
  TextureLoader,
  Vector2,
  Vector3,
} from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Site from "@components/site";
import { unitWidth } from "@constants";
import Component from "@components/lib/recordable";
import ValveControl from "@components/valveControl";
import matcap1 from "../assets/matcap/1.png";
import { skew } from "@utils/index";

const getDefaultMaterial = (params?: {
  textureSrc?: string;
  materialColor?: number | string;
}) => {
  const { textureSrc, materialColor } = params || {};
  const texture = new TextureLoader().load(textureSrc || matcap1);

  const material = new MeshMatcapMaterial({
    matcap: texture,
    flatShading: true,
  });

  return material;
};

export default class Level1 {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;

  init() {
    this.initAda();
    this.setSceneLook();

    // this.hiddenMaskComponents();
    // this.configAnimation();
    // this.triggerAnimation();
  }
  initAda() {
    const initPath = Paths.find(
      (item) => item.userData.props?.[0]?.name === "initPosition"
    );
    if (!initPath) {
      return;
    }
    initPath.getCenterWorldPosition(ada.position);

    scene.add(ada);

    movingPath.setAdaOn(initPath);
  }
  setSceneLook() {
    // 设置中间草地颜色
    // const center_grass = getCompFromFlatedArrByName("center_grass");
    // const material1 = new MeshBasicMaterial({ color: 0xc4d449 });
    // center_grass.userData.planeMesh.material = material1;

    // const geometry = new CylinderGeometry(5, 5, 20, 5, 4);
    // const material = new MeshBasicMaterial({
    //   color: 0xffff00,
    //   wireframe: true,
    // });
    // const positionAttr = geometry.getAttribute("position");
    // console.log(positionAttr.count);

    // for (let i = 0; i < 40; i++) {
    //   const x = positionAttr.getX(i) + (Math.random() - 0.5) * 1;
    //   const y = positionAttr.getY(i) + (Math.random() - 0.5) * 1;
    //   const z = positionAttr.getZ(i) + (Math.random() - 0.5) * 1;
    //   if (!((i + 1) % 6)) {
    //     console.log(i)
    //     const x = positionAttr.getX(i - 5);
    //     const y = positionAttr.getY(i - 5);
    //     const z = positionAttr.getZ(i - 5);
    //     positionAttr.setXYZ(i, x, y, z);
    //   } else {
    //     positionAttr.setXYZ(i, x, y, z);
    //   }
    // }
    // positionAttr.needsUpdate = true;
    // geometry.computeVertexNormals();

    // const cylinder = new Mesh(geometry, material);
    // cylinder.scale.set(16, 16, 16);
    // console.log(geometry);
    // scene.add(cylinder);

    const pointsTrunc = [];

    var ty;
    ty = 0;
    let yDivideNumber = 4;

    const heightFactor = 0.5;
    for (let i = 0; i < yDivideNumber; i++) {
      const x = i;
      // const x = (i + 1) * Math.sin((i * Math.PI) / yDivideNumber);
      const scaleFactor = 0.2;
      const y = -Math.pow(2, x * scaleFactor) * (i + 1);
      ty = y;
      pointsTrunc.push(new Vector2(x, y + 1));
    }
    // pointsTrunc.push(new Vector2(0, ty));
    const pointsTruncLength = pointsTrunc.length;
    // yDivideNumber += 1;
    const geometry1 = new LatheGeometry(pointsTrunc, 6);
    const material1 = getDefaultMaterial();

    const positionAttr = geometry1.getAttribute("position");

    const positionArr = Array.from(positionAttr.array);
    console.log(pointsTrunc);
    console.log(positionAttr);
    console.log(pointsTruncLength);
    for (let i = 0; i < positionAttr.count; i++) {
      if (i % pointsTruncLength && (i + 1) % pointsTruncLength) {
        // const x = positionArr[i * 3] + (Math.random() - 0.5) * 0.5;
        // const y = positionArr[i * 3 + 1] + (Math.random() - 0.5) * 1;
        // const z = positionArr[i * 3 + 2] + (Math.random() - 0.5) * 0.5;
        // positionAttr.setXYZ(i, x, y, z);
      }
    }
    // for (
    //   let i = positionAttr.count - yDivideNumber - 1;
    //   i < positionAttr.count;
    //   i++
    // ) {
    //   const k = yDivideNumber + 1 - (positionAttr.count - i);
    //   const x = positionAttr.getX(k);
    //   const y = positionAttr.getY(k);
    //   const z = positionAttr.getZ(k);

    //   positionAttr.setXYZ(i, x, y, z);
    // }
    positionAttr.needsUpdate = true;
    geometry1.computeVertexNormals();

    console.log(geometry1.getAttribute("position"));

    const lathe = new Mesh(geometry1, material1);
    lathe.scale.set(1, 1, 1);
    scene.add(lathe);
  }
  hiddenMaskComponents() {
    const mask_1 = getCompFromFlatedArrByName("mask_1");
    const mask_2 = getCompFromFlatedArrByName("mask_2");
    mask_1.visible = false;
    mask_2.visible = false;
  }
  showMask1Components() {
    const mask_1 = getCompFromFlatedArrByName("mask_1");
    mask_1.visible = true;
  }
  showMask2Components() {
    const mask_2 = getCompFromFlatedArrByName("mask_2");
    mask_2.visible = true;
  }
  configAnimation() {
    const rotationControl: any = getCompFromFlatedArrByName("rotationControl");
    const centerRotable: Object3D | undefined =
      getCompFromFlatedArrByName("centerRotable");
    if (!(rotationControl && centerRotable)) {
      return;
    }
    rotationControl.onRotate = (axis: Vector3, angle: number) => {
      if (centerRotable) {
        centerRotable.rotateOnAxis(axis, angle);
      }
    };
    rotationControl.onRotated = (axis: Vector3, totalAngle: number) => {
      const left = totalAngle % (Math.PI / 2);
      let addonAngle = 0;
      if (centerRotable) {
        if (Math.abs(left) > Math.PI / 4) {
          addonAngle = Math.PI / 2 - Math.abs(left);
        } else {
          addonAngle = -Math.abs(left);
        }
        addonAngle *= totalAngle > 0 ? 1 : -1;

        const caliQuat = new Quaternion();
        caliQuat.setFromAxisAngle(axis, addonAngle);

        const endQuat = centerRotable.quaternion.clone();
        const startQuat = centerRotable.quaternion.clone();
        endQuat.premultiply(caliQuat);
        animate({
          from: startQuat,
          to: endQuat,
          duration: 200,
          onUpdate: (latest: any) => {
            centerRotable.quaternion.copy(
              new Quaternion().set(latest._x, latest._y, latest._z, latest._w)
            );
          },
        });
      }
    };
  }
  triggerAnimation() {
    this.trigger1Animation();
    this.trigger2Animation();
    this.trigger3Animation();
  }
  trigger1Animation() {
    const trigger_1: any = getCompFromFlatedArrByName("trigger_1");
    const site_1 = getCompFromFlatedArrByName("site_1") as Site;
    trigger_1.onTrigger = () => {
      if (this.isTrigger1Trigged) {
        return;
      }
      if (!site_1) {
        return;
      }
      this.isTrigger1Trigged = true;
      site_1.onTrigger();

      const movableCube_1: any = getCompFromFlatedArrByName("movableCube_1");
      const movableCube_2: any = getCompFromFlatedArrByName("movableCube_2");
      const movableCube_3: any = getCompFromFlatedArrByName("movableCube_3");
      const movableCube_4: any = getCompFromFlatedArrByName("movableCube_4");
      const movableCube_5: any = getCompFromFlatedArrByName("movableCube_5");
      const movableCube_6: any = getCompFromFlatedArrByName("movableCube_6");
      const cubes = [
        movableCube_1,
        movableCube_2,
        movableCube_3,
        movableCube_4,
        movableCube_5,
        movableCube_6,
      ];

      const moveCube = (cube: Component) => {
        const fromP = new Vector3().copy(cube.position);
        const toP = new Vector3()
          .copy(cube.position)
          .add(new Vector3(0, unitWidth * 3, 0));
        animate({
          from: fromP,
          to: toP,
          duration: 200,
          onUpdate: (latest: any) => {
            cube.position.copy(latest);
          },
          onComplete: moveNext,
        });
      };

      const moveNext = () => {
        const nextCube = cubes.shift();
        if (nextCube) {
          moveCube(nextCube);
        } else {
          this.showMask1Components();
        }
      };
      moveNext();
    };
  }
  trigger2Animation() {
    const trigger_2: any = getCompFromFlatedArrByName("trigger_2");
    const site_2 = getCompFromFlatedArrByName("site_2") as Site;
    trigger_2.onTrigger = () => {
      if (this.isTrigger2Trigged) {
        return;
      }
      if (!site_2) {
        return;
      }
      this.isTrigger2Trigged = true;

      site_2.onTrigger();

      const centerMove: any = getCompFromFlatedArrByName("centerMove");

      const fromP = new Vector3().copy(centerMove.position);
      const toP = new Vector3()
        .copy(centerMove.position)
        .add(new Vector3(0, unitWidth * 6, 0));
      animate({
        from: fromP,
        to: toP,
        duration: 200,
        onUpdate: (latest: any) => {
          centerMove.position.copy(latest);
        },
        // onComplete: moveNext,
      });

      this.showMask2Components();
    };
    // trigger_2.onTrigger = () => {};
  }
  trigger3Animation() {
    const rotationControl = getCompFromFlatedArrByName(
      "rotationControl"
    ) as ValveControl;
    const rotate_close: any = getCompFromFlatedArrByName("rotate_close");
    const rotate_close1: any = getCompFromFlatedArrByName("rotate_close1");
    const rotate_open: any = getCompFromFlatedArrByName("rotate_open");
    const rotate_open1: any = getCompFromFlatedArrByName("rotate_open1");
    const rotate_open2: any = getCompFromFlatedArrByName("rotate_open2");
    const rotate_open3: any = getCompFromFlatedArrByName("rotate_open3");
    const rotate_open4: any = getCompFromFlatedArrByName("rotate_open4");
    const rotate_open5: any = getCompFromFlatedArrByName("rotate_open5");
    if (
      !(
        rotationControl &&
        rotate_close &&
        rotate_close1 &&
        rotate_open &&
        rotate_open1 &&
        rotate_open2 &&
        rotate_open3 &&
        rotate_open4 &&
        rotate_open5
      )
    ) {
      return;
    }
    rotate_close.onTrigger = () => {
      rotationControl.disable();
    };
    rotate_close1.onTrigger = () => {
      rotationControl.disable();
    };
    rotate_open.onTrigger = () => {
      rotationControl.enable();
    };
    rotate_open1.onTrigger = () => {
      rotationControl.enable();
    };
    rotate_open2.onTrigger = () => {
      rotationControl.enable();
    };
    rotate_open3.onTrigger = () => {
      rotationControl.enable();
    };
    rotate_open4.onTrigger = () => {
      rotationControl.enable();
    };
    rotate_open5.onTrigger = () => {
      rotationControl.enable();
    };
  }
}
