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
import levelData3 from "../levelData/levelData3";
import MoveControl from "@components/moveControl";
export default class Level4 extends Level {
  isTrigger1Trigged = false;

  init() {
    Component.defaultMatcap = matcap_level2_0;
    Component.FOG_COLOR = undefined;
    this.loadDataScene("");
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
  triggerAnimation() {
    this.trigger1Animation();
    this.trigger2Animation();
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
}
