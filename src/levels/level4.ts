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
import matcap_level2_0 from "../assets/matcap/matcap_level2_0.png";
import Level from "./lib/level";
import levelData3 from "../levelData/levelData3";
import MoveControl from "@components/moveControl";
export default class Level4 extends Level {
  isTrigger1Trigged = false;

  init() {
    Component.defaultMatcap = matcap_level2_0;
    Component.FOG_COLOR = undefined;
    this.loadDataScene('');
    this.initAda();
    // this.setSceneLook();

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
    scene.background = new Color(0xfeffbd);
    // const moveControl0 = getCompFromFlatedArrByName(
    //   "moveControl0"
    // ) as MoveControl;
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
    const moveControl0: any = getCompFromFlatedArrByName("moveControl0");
    const moveGroup0 = getCompFromFlatedArrByName("moveGroup0") as MoveControl;
    const triggerMoveGroup0 = getCompFromFlatedArrByName(
      "triggerMoveGroup0"
    ) as MoveControl;
    if (!(moveControl0 && moveGroup0 && triggerMoveGroup0)) {
      return;
    }
    moveControl0.onMove = (axis: Vector3, dl: Vector3) => {
      if (moveGroup0) {
        dl.projectOnVector(new Vector3(0, 1, 0));
        const newP = new Vector3().copy(moveGroup0.position).add(dl);

        const newP1 = new Vector3().copy(triggerMoveGroup0.position).sub(dl);
        newP.clamp(
          new Vector3(newP.x, -unitWidth * 5, newP.z),
          new Vector3(newP.x, unitWidth * 2, newP.z)
        );
        newP1.clamp(
          new Vector3(newP1.x, -unitWidth * 2, newP1.z),
          new Vector3(newP1.x, unitWidth * 5, newP1.z)
        );
        moveGroup0.position.copy(newP);
        triggerMoveGroup0.position.copy(newP1);
      }
    };
    moveControl0.onMoved = (axis: Vector3, totalMovement: Vector3) => {
      if (moveGroup0) {
        const moveInitWorldPosition = moveControl0.moveInitWorldPosition!;
        const newWorldP = new Vector3();
        moveControl0.getWorldPosition(newWorldP);
        const subVector = newWorldP.sub(moveInitWorldPosition);
        const newY = Math.round(subVector.y / unitWidth) * unitWidth;

        const targetV = new Vector3()
          .copy(moveGroup0.position)
          .sub(subVector)
          .add(new Vector3(0, newY, 0));
        animate({
          from: moveGroup0.position,
          to: targetV,
          duration: 200,
          onUpdate: (latest) => {
            moveGroup0.position.copy(latest);
          },
        });

        const targetV1 = new Vector3()
          .copy(triggerMoveGroup0.position)
          .add(subVector)
          .sub(new Vector3(0, newY, 0));
        animate({
          from: triggerMoveGroup0.position,
          to: targetV1,
          duration: 200,
          onUpdate: (latest) => {
            triggerMoveGroup0.position.copy(latest);
          },
        });
      }
    };
  }
  configAnimation1() {
    const moveControl1: any = getCompFromFlatedArrByName("moveControl1");
    const moveGroup1 = getCompFromFlatedArrByName("moveGroup1") as MoveControl;
    const triggerMoveGroup1 = getCompFromFlatedArrByName(
      "triggerMoveGroup1"
    ) as MoveControl;
    if (!(moveControl1 && moveGroup1 && triggerMoveGroup1)) {
      return;
    }
    moveControl1.onMove = (axis: Vector3, dl: Vector3) => {
      if (moveGroup1) {
        dl.projectOnVector(new Vector3(0, 1, 0));
        const newP = new Vector3().copy(moveGroup1.position).add(dl);

        const newP1 = new Vector3().copy(triggerMoveGroup1.position).sub(dl);
        newP.clamp(
          new Vector3(newP.x, -unitWidth * 2, newP.z),
          new Vector3(newP.x, unitWidth * 6, newP.z)
        );
        newP1.clamp(
          new Vector3(newP1.x, -unitWidth * 6, newP1.z),
          new Vector3(newP1.x, unitWidth * 2, newP1.z)
        );
        moveGroup1.position.copy(newP);
        triggerMoveGroup1.position.copy(newP1);
      }
    };
    moveControl1.onMoved = (axis: Vector3, totalMovement: Vector3) => {
      if (moveGroup1) {
        const moveInitWorldPosition = moveControl1.moveInitWorldPosition!;
        const newWorldP = new Vector3();
        moveControl1.getWorldPosition(newWorldP);
        const subVector = newWorldP.sub(moveInitWorldPosition);
        const newY = Math.round(subVector.y / unitWidth) * unitWidth;

        const targetV = new Vector3()
          .copy(moveGroup1.position)
          .sub(subVector)
          .add(new Vector3(0, newY, 0));
        animate({
          from: moveGroup1.position,
          to: targetV,
          duration: 200,
          onUpdate: (latest) => {
            moveGroup1.position.copy(latest);
          },
        });

        const targetV1 = new Vector3()
          .copy(triggerMoveGroup1.position)
          .add(subVector)
          .sub(new Vector3(0, newY, 0));
        animate({
          from: triggerMoveGroup1.position,
          to: targetV1,
          duration: 200,
          onUpdate: (latest) => {
            triggerMoveGroup1.position.copy(latest);
          },
        });
      }
    };
  }
  triggerAnimation() {
    this.trigger1Animation();
    // this.trigger2Animation();
  }
  trigger1Animation() {
    const trigger0: any = getCompFromFlatedArrByName("trigger0");
    const trigger0MoveGroup0: any =
      getCompFromFlatedArrByName("trigger0MoveGroup0");
    const trigger0MoveGroup1: any =
      getCompFromFlatedArrByName("trigger0MoveGroup1");
    const trigger0MoveGroup2: any =
      getCompFromFlatedArrByName("trigger0MoveGroup2");
    trigger0.onTrigger = () => {
      if (!(trigger0MoveGroup0 && trigger0MoveGroup1 && trigger0MoveGroup2)) {
        return;
      }
      const target0 = new Vector3()
        .copy(trigger0MoveGroup0.position)
        .add(new Vector3(0, unitWidth * 15, 0));
      animate({
        from: trigger0MoveGroup0.position,
        to: target0,
        duration: 200,
        onUpdate: (latest) => {
          trigger0MoveGroup0.position.copy(latest);
        },
      });

      const target1 = new Vector3()
        .copy(trigger0MoveGroup1.position)
        .add(new Vector3(0, unitWidth * 14, 0));
      animate({
        from: trigger0MoveGroup1.position,
        to: target1,
        duration: 200,
        onUpdate: (latest) => {
          trigger0MoveGroup1.position.copy(latest);
        },
      });

      const target2 = new Vector3()
        .copy(trigger0MoveGroup2.position)
        .add(new Vector3(0, unitWidth * 29, 0));
      animate({
        from: trigger0MoveGroup2.position,
        to: target2,
        duration: 200,
        onUpdate: (latest) => {
          trigger0MoveGroup2.position.copy(latest);
        },
      });
      // movingPath.setAdaOn(tp0_target);
      // ada.position.copy(new Vector3());
    };
  }
  trigger2Animation() {
    const trigger0: any = getCompFromFlatedArrByName("trigger0");
    const rotable0 = getCompFromFlatedArrByName("rotable0");
    const rotable1 = getCompFromFlatedArrByName("rotable1");
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
          rotable0.rotation.y = -latest;
          rotable1.rotation.y = latest;
        },
      });
    };
  }
}
