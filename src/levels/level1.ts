import { Group, Object3D, Quaternion, Vector3 } from "three";
import { flatedComponents, Paths, scene } from "@env";
import Ada from "@env/ada";
import { animate } from "popmotion";
export default class Level1 {
  init() {
    const ada = new Ada();

    const initPath = Paths.find(
      (item) => item.userData.props?.[0]?.name === "initPosition"
    );
    if (!initPath) {
      return;
    }
    initPath.getWorldPosition(ada.position);

    scene.add(ada);

    this.configAnimation();
  }
  configAnimation() {
    const rotationControl: any = flatedComponents.find(
      (item) => item.name === "rotationControl"
    );
    if (!rotationControl) {
      return;
    }

    const centerRotable: Object3D | undefined = flatedComponents.find(
      (item) => item.name === "centerRotable"
    );
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
          duration: 2000,
          onUpdate: (latest: any) => {
            centerRotable.quaternion.copy(
              new Quaternion().set(latest._x, latest._y, latest._z, latest._w)
            );
          },
        });
      }
    };
  }
}
