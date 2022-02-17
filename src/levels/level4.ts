import {
  Color,
  Euler,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Site from "@components/site";
import { unitWidth } from "@constants";
import Component from "@components/lib/recordable";
import ValveControl from "@components/valveControl";
import levelData1 from "../levelData/levelData1";
import matcap_level0_2 from "../assets/matcap/matcap_level0_2.png";
import matcap_level2_0 from "../assets/matcap/matcap_level2_0.png";
import Level from "./lib/level";
import levelData4 from "../levelData/levelData4";
import MoveControl from "@components/moveControl";
export default class Level4 extends Level {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;
  isTrigger3Trigged = false;

  init() {
    Component.defaultMatcap = matcap_level2_0;
    Component.FOG_COLOR = undefined;
    this.loadDataScene(levelData4);
    this.initAda();
    this.setSceneLook();

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

    const stairRotablePathGroup0 = getCompFromFlatedArrByName(
      "stairRotablePathGroup0"
    );
    const triggerPathGroup0 = getCompFromFlatedArrByName("triggerPathGroup0");
    stairRotablePathGroup0.visible = false;
    triggerPathGroup0.visible = false;
    // const moveControl1 = getCompFromFlatedArrByName(
    //   "moveControl0"
    // ) as MoveControl;
    // const moveControl2 = getCompFromFlatedArrByName(
    //   "moveControl0"
    // ) as MoveControl;
    // matcap_level2_0
    // moveControl0.setProgramProps({
    //   plugMatcap: matcap_level0_2,
    // });
    // moveControl1.setProgramProps({
    //   plugMatcap: matcap_level0_2,
    // });
    // moveControl2.setProgramProps({
    //   plugMatcap: matcap_level0_2,
    // });
  }
  configAnimation() {
    this.configAnimation0();
    this.configAnimation1();
    this.configAnimation2();
    this.configAnimation3();
  }
  configAnimation0() {
    const rotationControl0: any =
      getCompFromFlatedArrByName("rotationControl0");
    const centerRotable0: Object3D | undefined =
      getCompFromFlatedArrByName("centerRotable0");
    if (!(rotationControl0 && centerRotable0)) {
      return;
    }
    rotationControl0.onRotate = (axis: Vector3, angle: number) => {
      if (centerRotable0) {
        centerRotable0.rotateOnAxis(axis, angle);
      }
    };
    rotationControl0.onRotated = (axis: Vector3, totalAngle: number) => {
      const left = totalAngle % (Math.PI / 2);
      let addonAngle = 0;
      if (centerRotable0) {
        if (Math.abs(left) > Math.PI / 4) {
          addonAngle = Math.PI / 2 - Math.abs(left);
        } else {
          addonAngle = -Math.abs(left);
        }
        addonAngle *= totalAngle > 0 ? 1 : -1;

        const caliQuat = new Quaternion();
        caliQuat.setFromAxisAngle(axis, addonAngle);

        const endQuat = centerRotable0.quaternion.clone();
        const startQuat = centerRotable0.quaternion.clone();
        endQuat.premultiply(caliQuat);
        animate({
          from: startQuat,
          to: endQuat,
          duration: 200,
          onUpdate: (latest: any) => {
            centerRotable0.quaternion.copy(
              new Quaternion().set(latest._x, latest._y, latest._z, latest._w)
            );
          },
        });
      }
    };
  }
  configAnimation1() {
    const rotationControl1: any =
      getCompFromFlatedArrByName("rotationControl1");
    const stairRotable: Object3D | undefined =
      getCompFromFlatedArrByName("stairRotable");
    if (!(rotationControl1 && stairRotable)) {
      return;
    }
    rotationControl1.onRotate = (axis: Vector3, angle: number) => {
      if (stairRotable) {
        stairRotable.rotateOnAxis(axis, angle);
      }
    };
    rotationControl1.onRotated = (axis: Vector3, totalAngle: number) => {
      const left = totalAngle % (Math.PI / 2);
      let addonAngle = 0;
      if (stairRotable) {
        if (Math.abs(left) > Math.PI / 4) {
          addonAngle = Math.PI / 2 - Math.abs(left);
        } else {
          addonAngle = -Math.abs(left);
        }
        addonAngle *= totalAngle > 0 ? 1 : -1;

        const caliQuat = new Quaternion();
        caliQuat.setFromAxisAngle(axis, addonAngle);

        const endQuat = stairRotable.quaternion.clone();
        const startQuat = stairRotable.quaternion.clone();
        endQuat.premultiply(caliQuat);
        animate({
          from: startQuat,
          to: endQuat,
          duration: 200,
          onUpdate: (latest: any) => {
            stairRotable.quaternion.copy(
              new Quaternion().set(latest._x, latest._y, latest._z, latest._w)
            );
          },
          onComplete: () => {
            const up = stairRotable.up.clone();
            stairRotable.localToWorld(up);
            up.sub(stairRotable.position);
            const stairRotablePathGroup0 = getCompFromFlatedArrByName(
              "stairRotablePathGroup0"
            );
            if (Number(up.y.toFixed(1)) === 1) {
              stairRotablePathGroup0.visible = true;
            } else {
              stairRotablePathGroup0.visible = false;
            }
          },
        });
      }
    };
  }
  configAnimation2() {
    const rotationControl2: any =
      getCompFromFlatedArrByName("rotationControl2");
    const centerRotable2: Object3D | undefined =
      getCompFromFlatedArrByName("centerRotable2");
    if (!(rotationControl2 && centerRotable2)) {
      return;
    }
    rotationControl2.onRotate = (axis: Vector3, angle: number) => {
      if (centerRotable2) {
        centerRotable2.rotateOnAxis(axis, angle);
      }
    };
    rotationControl2.onRotated = (axis: Vector3, totalAngle: number) => {
      const left = totalAngle % (Math.PI / 2);
      let addonAngle = 0;
      if (centerRotable2) {
        if (Math.abs(left) > Math.PI / 4) {
          addonAngle = Math.PI / 2 - Math.abs(left);
        } else {
          addonAngle = -Math.abs(left);
        }
        addonAngle *= totalAngle > 0 ? 1 : -1;

        const caliQuat = new Quaternion();
        caliQuat.setFromAxisAngle(axis, addonAngle);

        const endQuat = centerRotable2.quaternion.clone();
        const startQuat = centerRotable2.quaternion.clone();
        endQuat.premultiply(caliQuat);
        animate({
          from: startQuat,
          to: endQuat,
          duration: 200,
          onUpdate: (latest: any) => {
            centerRotable2.quaternion.copy(
              new Quaternion().set(latest._x, latest._y, latest._z, latest._w)
            );
          },
        });
      }
    };
  }
  configAnimation3() {
    const moveControl0: any = getCompFromFlatedArrByName("moveControl0");
    const moveGroup0 = getCompFromFlatedArrByName("moveGroup0") as MoveControl;

    if (!(moveControl0 && moveGroup0)) {
      return;
    }
    moveControl0.onMove = (axis: Vector3, dl: Vector3) => {
      if (moveGroup0) {
        dl.projectOnVector(new Vector3(1, 0, 0));
        const newP = new Vector3().copy(moveGroup0.position).add(dl);

        newP.clamp(
          new Vector3(-unitWidth * 3, newP.y, newP.z),
          new Vector3(0, newP.y, newP.z)
        );
        moveGroup0.position.copy(newP);
      }
    };
    moveControl0.onMoved = (axis: Vector3, totalMovement: Vector3) => {
      if (moveGroup0) {
        const moveInitWorldPosition = moveControl0.moveInitWorldPosition!;
        const newWorldP = new Vector3();
        moveControl0.getWorldPosition(newWorldP);
        const subVector = newWorldP.sub(moveInitWorldPosition);
        const newX = Math.round(subVector.x / unitWidth) * unitWidth;

        const targetV = new Vector3()
          .copy(moveGroup0.position)
          .sub(subVector)
          .add(new Vector3(newX, 0, 0));
        animate({
          from: moveGroup0.position,
          to: targetV,
          duration: 200,
          onUpdate: (latest) => {
            moveGroup0.position.copy(latest);
          },
        });
      }
    };
  }
  triggerAnimation() {
    this.trigger1Animation();
    this.trigger2Animation();
    this.trigger3Animation();
    this.trigger4Animation();
    this.trigger5Animation();
    this.trigger6Animation();
  }

  trigger1Animation() {
    const rotationControl1 = getCompFromFlatedArrByName(
      "rotationControl1"
    ) as ValveControl;
    const rotate_close: any = getCompFromFlatedArrByName("rotate_close");
    const rotate_close1: any = getCompFromFlatedArrByName("rotate_close1");
    const rotate_open: any = getCompFromFlatedArrByName("rotate_open");
    const rotate_open1: any = getCompFromFlatedArrByName("rotate_open1");
    if (
      !(
        rotationControl1 &&
        rotate_close &&
        rotate_close1 &&
        rotate_open &&
        rotate_open1
      )
    ) {
      return;
    }
    rotate_close.onTrigger = () => {
      rotationControl1.disable();
    };
    rotate_close1.onTrigger = () => {
      rotationControl1.disable();
    };
    rotate_open.onTrigger = () => {
      rotationControl1.enable();
    };
    rotate_open1.onTrigger = () => {
      rotationControl1.enable();
    };
  }
  trigger2Animation() {
    const trigger0: any = getCompFromFlatedArrByName("trigger0");
    const triggerCubeGroup0 = getCompFromFlatedArrByName("triggerCubeGroup0");
    const triggerPathGroup0 = getCompFromFlatedArrByName("triggerPathGroup0");
    const site0 = getCompFromFlatedArrByName("site0") as Site;
    trigger0.onTrigger = () => {
      if (this.isTrigger1Trigged) {
        return;
      }
      if (!site0) {
        return;
      }
      this.isTrigger1Trigged = true;

      site0.onTrigger();
      animate({
        from: 0,
        to: Math.PI / 2,
        duration: 200,
        onUpdate: (latest: any) => {
          triggerCubeGroup0.rotation.z = latest;
        },
        onComplete: () => {
          triggerPathGroup0.visible = true;
        },
      });
    };
  }
  trigger3Animation() {
    const trigger1: any = getCompFromFlatedArrByName("trigger1");
    const tp0_target: any = getCompFromFlatedArrByName("tp0_target");
    trigger1.onTrigger = () => {
      if (!tp0_target) {
        return;
      }
      movingPath.setAdaOn(tp0_target);
      ada.position.copy(new Vector3());

      const bridge0: any = getCompFromFlatedArrByName("bridge0");
      const bridge1: any = getCompFromFlatedArrByName("bridge1");
      const bridge2: any = getCompFromFlatedArrByName("bridge2");
      const bridge3: any = getCompFromFlatedArrByName("bridge3");
      const bridge4: any = getCompFromFlatedArrByName("bridge4");
      const bridge5: any = getCompFromFlatedArrByName("bridge5");
      const bridge6: any = getCompFromFlatedArrByName("bridge6");
      const bridge7: any = getCompFromFlatedArrByName("bridge7");
      const bridge8: any = getCompFromFlatedArrByName("bridge8");
      const bridge9: any = getCompFromFlatedArrByName("bridge9");
      const bridge10: any = getCompFromFlatedArrByName("bridge10");
      const bridge11: any = getCompFromFlatedArrByName("bridge11");

      if (
        !(
          bridge0 &&
          bridge1 &&
          bridge2 &&
          bridge3 &&
          bridge4 &&
          bridge5 &&
          bridge6 &&
          bridge7 &&
          bridge8 &&
          bridge9 &&
          bridge10 &&
          bridge11
        )
      ) {
        return;
      }
      const fall = (bridge: Object3D, delay: number) => {
        const target0 = new Vector3()
          .copy(bridge.position)
          .add(new Vector3(0, unitWidth * 4, 0));
        animate({
          from: bridge.position,
          to: target0,
          elapsed: delay,
          duration: 200,
          onUpdate: (latest) => {
            bridge.position.copy(latest);
          },
        });
      };
      fall(bridge0, -0);
      fall(bridge1, -200);
      fall(bridge2, -400);
      fall(bridge3, -600);
      fall(bridge4, -800);
      fall(bridge5, -1000);
      fall(bridge6, -1200);
      fall(bridge7, -1400);
      fall(bridge8, -1600);
      fall(bridge9, -1800);
      fall(bridge10, -2000);
      fall(bridge11, -2200);
    };
  }
  trigger4Animation() {
    const trigger2: any = getCompFromFlatedArrByName("trigger2");
    trigger2.onTrigger = () => {
      const bridge0: any = getCompFromFlatedArrByName("bridge0");
      const bridge1: any = getCompFromFlatedArrByName("bridge1");
      const bridge2: any = getCompFromFlatedArrByName("bridge2");
      const bridge3: any = getCompFromFlatedArrByName("bridge3");
      const bridge4: any = getCompFromFlatedArrByName("bridge4");
      const bridge5: any = getCompFromFlatedArrByName("bridge5");
      const bridge6: any = getCompFromFlatedArrByName("bridge6");
      const bridge7: any = getCompFromFlatedArrByName("bridge7");
      const bridge8: any = getCompFromFlatedArrByName("bridge8");
      const bridge9: any = getCompFromFlatedArrByName("bridge9");
      const bridge10: any = getCompFromFlatedArrByName("bridge10");
      const bridge11: any = getCompFromFlatedArrByName("bridge11");

      if (
        !(
          bridge0 &&
          bridge1 &&
          bridge2 &&
          bridge3 &&
          bridge4 &&
          bridge5 &&
          bridge6 &&
          bridge7 &&
          bridge8 &&
          bridge9 &&
          bridge10 &&
          bridge11
        )
      ) {
        return;
      }
      const fall = (bridge: Object3D, delay: number) => {
        const target0 = new Vector3()
          .copy(bridge.position)
          .add(new Vector3(0, -unitWidth * 4, 0));
        animate({
          from: bridge.position,
          to: target0,
          elapsed: delay,
          duration: 200,
          onUpdate: (latest) => {
            bridge.position.copy(latest);
          },
        });
      };
      fall(bridge0, -2200);
      fall(bridge1, -2000);
      fall(bridge2, -1800);
      fall(bridge3, -1600);
      fall(bridge4, -1400);
      fall(bridge5, -1200);
      fall(bridge6, -1000);
      fall(bridge7, -800);
      fall(bridge8, -600);
      fall(bridge9, -400);
      fall(bridge10, -200);
      fall(bridge11, -0);
    };
  }
  trigger5Animation() {
    const trigger3: any = getCompFromFlatedArrByName("trigger3");
    const triggerCubeGroup1 = getCompFromFlatedArrByName("triggerCubeGroup1");
    const site1 = getCompFromFlatedArrByName("site1") as Site;
    trigger3.onTrigger = () => {
      if (this.isTrigger2Trigged) {
        return;
      }
      if (!site1) {
        return;
      }
      this.isTrigger2Trigged = true;

      site1.onTrigger();
      animate({
        from: 0,
        to: -Math.PI / 2,
        duration: 200,
        onUpdate: (latest: any) => {
          triggerCubeGroup1.rotation.z = latest;
        },
      });
    };
  }
  trigger6Animation() {
    const trigger4: any = getCompFromFlatedArrByName("trigger4");
    const triggerCubeGroup2 = getCompFromFlatedArrByName("triggerCubeGroup2");
    const triggerCubeGroup3 = getCompFromFlatedArrByName("triggerCubeGroup3");
    const site2 = getCompFromFlatedArrByName("site2") as Site;
    trigger4.onTrigger = () => {
      if (this.isTrigger3Trigged) {
        return;
      }
      if (!site2) {
        return;
      }
      this.isTrigger3Trigged = true;

      site2.onTrigger();
      animate({
        from: 0,
        to: -Math.PI,
        duration: 200,
        onUpdate: (latest: any) => {
          triggerCubeGroup2.rotation.z = latest;
        },
      });

      const newP = new Vector3()
        .copy(triggerCubeGroup3.position)
        .add(new Vector3(0, -unitWidth * 2, 0));
      animate({
        from: triggerCubeGroup3.position,
        to: newP,
        duration: 200,
        onUpdate: (latest: any) => {
          triggerCubeGroup3.position.copy(latest);
        },
      });
    };
  }
}
