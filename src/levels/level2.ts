import { Color, MeshBasicMaterial, Object3D, Quaternion, Vector3 } from "three";
import { getCompFromFlatedArrByName, Paths, scene } from "@env";
import { animate } from "popmotion";
import { ada, movingPath } from "@game";
import Site from "@components/site";
import { unitWidth } from "@constants";
import Component from "@components/lib/recordable";
import ValveControl from "@components/valveControl";
import levelData1 from "../levelData/levelData1";
import matcap_level0_2 from "../assets/matcap/matcap_level0_2.png";
import Level from "./lib/level";
import MoveControl from "@components/moveControl";
export default class Level2 extends Level {
  isTrigger1Trigged = false;
  isTrigger2Trigged = false;

  init() {
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
    const moveControl0 = getCompFromFlatedArrByName(
      "moveControl0"
    ) as MoveControl;
    const moveControl1 = getCompFromFlatedArrByName(
      "moveControl0"
    ) as MoveControl;
    const moveControl2 = getCompFromFlatedArrByName(
      "moveControl0"
    ) as MoveControl;
    moveControl0.setProgramProps({
      plugMatcap: matcap_level0_2,
    });
    moveControl1.setProgramProps({
      plugMatcap: matcap_level0_2,
    });
    moveControl2.setProgramProps({
      plugMatcap: matcap_level0_2,
    });
  }
  configAnimation() {
    this.configAnimation0();
    this.configAnimation1();
    this.configAnimation2();
  }
  configAnimation0() {
    const moveControl0: any = getCompFromFlatedArrByName("moveControl0");
    const moveGroup0 = getCompFromFlatedArrByName("moveGroup0") as MoveControl;
    if (!(moveControl0 && moveGroup0)) {
      return;
    }
    moveControl0.onMove = (axis: Vector3, dl: Vector3) => {
      if (moveGroup0) {
        dl.projectOnVector(new Vector3(0, 0, 1));
        const newP = new Vector3().copy(moveGroup0.position).add(dl);
        newP.clamp(
          new Vector3(newP.x, newP.y, -unitWidth * 8.5),
          new Vector3(newP.x, newP.y, -unitWidth * 2.5)
        );
        moveGroup0.position.copy(newP);
      }
    };
    moveControl0.onMoved = (axis: Vector3, totalMovement: Vector3) => {
      if (moveGroup0) {
        const moveInitWorldPosition = moveControl0.moveInitWorldPosition!;
        const newWorldP = new Vector3();
        moveControl0.getWorldPosition(newWorldP);
        const gWorldP = new Vector3();
        moveGroup0.getWorldPosition(gWorldP);
        const subVector = newWorldP.sub(moveInitWorldPosition);
        const newZ = Math.round(subVector.z / unitWidth) * unitWidth;

        const targetV = new Vector3()
          .copy(moveGroup0.position)
          .sub(subVector)
          .add(new Vector3(0, 0, newZ));
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
  configAnimation1() {
    const moveControl1: any = getCompFromFlatedArrByName("moveControl1");
    const moveGroup1 = getCompFromFlatedArrByName("moveGroup1") as MoveControl;
    if (!(moveControl1 && moveGroup1)) {
      return;
    }
    moveControl1.onMove = (axis: Vector3, dl: Vector3) => {
      if (moveGroup1) {
        dl.projectOnVector(new Vector3(0, 0, 1));
        const newP = new Vector3().copy(moveGroup1.position).add(dl);
        newP.clamp(
          new Vector3(newP.x, newP.y, -unitWidth * 8.5),
          new Vector3(newP.x, newP.y, -unitWidth * 0.5)
        );
        moveGroup1.position.copy(newP);
      }
    };
    moveControl1.onMoved = (axis: Vector3, totalMovement: Vector3) => {
      if (moveGroup1) {
        const moveInitWorldPosition = moveControl1.moveInitWorldPosition!;
        const newWorldP = new Vector3();
        moveControl1.getWorldPosition(newWorldP);
        const gWorldP = new Vector3();
        moveGroup1.getWorldPosition(gWorldP);
        const subVector = newWorldP.sub(moveInitWorldPosition);
        const newZ = Math.round(subVector.z / unitWidth) * unitWidth;

        const targetV = new Vector3()
          .copy(moveGroup1.position)
          .sub(subVector)
          .add(new Vector3(0, 0, newZ));
        animate({
          from: moveGroup1.position,
          to: targetV,
          duration: 200,
          onUpdate: (latest) => {
            moveGroup1.position.copy(latest);
          },
        });
      }
    };
  }
  configAnimation2() {
    const moveControl2: any = getCompFromFlatedArrByName("moveControl2");
    const moveGroup2 = getCompFromFlatedArrByName("moveGroup2") as MoveControl;
    if (!(moveControl2 && moveGroup2)) {
      return;
    }
    moveControl2.onMove = (axis: Vector3, dl: Vector3) => {
      if (moveGroup2) {
        dl.projectOnVector(new Vector3(0, 1, 0));
        const newP = new Vector3().copy(moveGroup2.position).add(dl);
        newP.clamp(
          new Vector3(newP.x, -unitWidth * 4, newP.z),
          new Vector3(newP.x, 0, newP.z)
        );
        moveGroup2.position.copy(newP);
      }
    };
    moveControl2.onMoved = (axis: Vector3, totalMovement: Vector3) => {
      if (moveGroup2) {
        const moveInitWorldPosition = moveControl2.moveInitWorldPosition!;
        const newWorldP = new Vector3();
        moveControl2.getWorldPosition(newWorldP);
        const gWorldP = new Vector3();
        moveGroup2.getWorldPosition(gWorldP);
        const subVector = newWorldP.sub(moveInitWorldPosition);
        const newY = Math.round(subVector.y / unitWidth) * unitWidth;
        const targetV = new Vector3()
          .copy(moveGroup2.position)
          .sub(subVector)
          .add(new Vector3(0, newY, 0));
        animate({
          from: moveGroup2.position,
          to: targetV,
          duration: 200,
          onUpdate: (latest) => {
            moveGroup2.position.copy(latest);
          },
        });
      }
    };
  }
  triggerAnimation() {
    this.trigger1Animation();
    // this.trigger2Animation();
    // this.trigger3Animation();
  }
  trigger1Animation() {
    const tp0: any = getCompFromFlatedArrByName("tp0");
    const tp0_target: any = getCompFromFlatedArrByName("tp0_target");
    tp0.onTrigger = () => {
      if (!tp0_target) {
        return;
      }
      // tp0_target.getWorldPosition(ada.position);
      movingPath.setAdaOn(tp0_target);
      ada.position.copy(new Vector3());
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
      // this.showMask2Components();
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
