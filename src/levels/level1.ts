import { Object3D, Quaternion, Vector3 } from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Site from "@components/site";
import { unitWidth } from "@constants";
import Component from "@components/lib/recordable";
export default class Level1 {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;

  init() {
    const initPath = Paths.find(
      (item) => item.userData.props?.[0]?.name === "initPosition"
    );
    if (!initPath) {
      return;
    }
    initPath.getCenterWorldPosition(ada.position);

    scene.add(ada);

    movingPath.setAdaOn(initPath);

    // this.hiddenMaskComponents();
    this.configAnimation();
    this.triggerAnimation();
    this.pathTriggerPoint();
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
          .add(new Vector3(0, unitWidth * 4, 0));
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
    // trigger_2.onTrigger = () => {};
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
  pathTriggerPoint() {}
}
