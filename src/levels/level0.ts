import { MeshBasicMaterial, Object3D, Quaternion, Vector3 } from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Site from "@components/site";
import { unitWidth } from "@constants";
import Component from "@components/lib/recordable";
import ValveControl from "@components/valveControl";
import level0Data from "../levelData/level0Data";
import Level from "./lib/level";
export default class Level0 extends Level {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;

  init() {
    this.loadDataScene(level0Data);
    this.initAda();

    this.configAnimation();
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
  configAnimation() {
    const rotationControl: any = getCompFromFlatedArrByName("rotationControl");
    const centerRotable: Object3D | undefined =
      getCompFromFlatedArrByName("centerRotable");
    if (!(rotationControl && centerRotable)) {
      return;
    }
    rotationControl.onRotate = (axis: Vector3, angle: number) => {
      if (centerRotable) {
        centerRotable.rotateOnAxis(new Vector3(1, 0, 0), angle);
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
    this.trigger3Animation();
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
