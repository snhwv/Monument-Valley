import { Color, MeshBasicMaterial, Object3D, Quaternion, Vector3 } from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Component from "@components/lib/recordable";
import ValveControl from "@components/valveControl";
import levelData0 from "../levelData/levelData0";
import Level from "./lib/level";
import matcap_level0_0 from "../assets/matcap/matcap_level0_0.png";
import matcap_level0_1 from "../assets/matcap/matcap_level0_1.png";
import matcap_level0_2 from "../assets/matcap/matcap_level0_2.png";
import matcap_level0_3 from "../assets/matcap/matcap_level0_3.png";
import level0_texture0 from "../assets/texture/level0_texture0.png";
import Cube from "@components/cube";
export default class Level0 extends Level {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;

  init() {
    scene.background = new Color(0x273540);
    Component.defaultMatcap = matcap_level0_0;
    this.loadDataScene(levelData0);
    this.initAda();

    this.setSceneLook();
    this.configAnimation();
    this.triggerAnimation();
  }
  setSceneLook() {
    const rotate_cube = getCompFromFlatedArrByName("rotate_cube") as Cube;
    rotate_cube.setMatcap(matcap_level0_1);
    const rotate_cube1 = getCompFromFlatedArrByName("rotate_cube1") as Cube;
    rotate_cube1.setMatcap(matcap_level0_1);
    const rotationControl = getCompFromFlatedArrByName(
      "rotationControl"
    ) as ValveControl;
    rotationControl.setProgramProps({
      plugTexture: level0_texture0,
      rodEndTexture: matcap_level0_2,
      rodTexture: matcap_level0_3,
      largeCircleColor: 0x4a5960,
      smallCircleColor: 0x2c2c38,
    });
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
      axis = new Vector3(1, 0, 0);
      if (centerRotable) {
        centerRotable.rotateOnAxis(axis, angle);
      }
    };
    rotationControl.onRotated = (axis: Vector3, totalAngle: number) => {
      axis = new Vector3(1, 0, 0);
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
    if (
      !(
        rotationControl &&
        rotate_close &&
        rotate_close1 &&
        rotate_open &&
        rotate_open1
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
  }
}
