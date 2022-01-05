import { Object3D, Quaternion, Vector3 } from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
export default class Level1 {
  init() {
    const initPath = Paths.find(
      (item) => item.userData.props?.[0]?.name === "initPosition"
    );
    if (!initPath) {
      return;
    }
    initPath.getWorldPosition(ada.position);

    scene.add(ada);

    movingPath.setAdaOn(initPath);

    this.configAnimation();
    // this.triggerAnimation();
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
    const trigger_1: any = getCompFromFlatedArrByName("trigger_1");
    const trigger_2: any = getCompFromFlatedArrByName("trigger_2");
    trigger_1.onTrigger = () => {};
    trigger_2.onTrigger = () => {};
  }
}
