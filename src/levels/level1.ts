import { Color, MeshBasicMaterial, Object3D, Quaternion, Vector3 } from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Site from "@components/site";
import { unitWidth } from "@constants";
import Component from "@components/lib/recordable";
import ValveControl from "@components/valveControl";
import levelData1 from "../levelData/levelData1";
import Level from "./lib/level";
import matcap1 from "../assets/matcap/matcap1.png";
export default class Level1 extends Level {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;

  init() {
    Component.defaultMatcap = matcap1;
    this.loadDataScene(levelData1);
    this.initAda();
    this.setSceneLook();

    this.hiddenMaskComponents();
    this.configAnimation();
    this.triggerAnimation();
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
    scene.background = new Color(0xfeffbd);
    // 设置中间草地颜色
    const center_grass = getCompFromFlatedArrByName("center_grass");
    const material1 = new MeshBasicMaterial({ color: 0xc4d449 });
    center_grass.userData.planeMesh.material = material1;
    const floor = getCompFromFlatedArrByName("floor");
    const material2 = material1.clone();
    material2.color = new Color(0xc4d449);
    floor.userData.planeMesh.material = material2;
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
          .add(new Vector3(0, unitWidth * 3.5, 0));
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
    const center_tree: any = getCompFromFlatedArrByName("center_tree");
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

      const centerMove = getCompFromFlatedArrByName("centerMove") as Component;

      const movePositionOffsetList = [unitWidth * 3, unitWidth * 3];
      const move = () => {
        const next = movePositionOffsetList.shift();
        if (!next) {
          return;
        }

        const fromP = new Vector3().copy(centerMove.position);
        const toP = new Vector3()
          .copy(centerMove.position)
          .add(new Vector3(0, next, 0));
        animate({
          from: fromP,
          to: toP,
          duration: 200,
          onUpdate: (latest: any) => {
            centerMove.position.copy(latest);
          },
          onComplete: () => {
            if (movePositionOffsetList.length) {
              center_tree && centerMove && centerMove.attach(center_tree);
            }
            move();
          },
        });
      };
      move();
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
