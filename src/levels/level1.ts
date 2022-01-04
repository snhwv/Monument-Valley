import { Group, Object3D, Vector3 } from "three";
import { flatedComponents, Paths, scene } from "@env";
import Ada from "@env/ada";
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
      console.log(totalAngle);
      console.log(centerRotable);
    //   centerRotable?.quaternion.angleTo
      if (centerRotable) {
      }
      //   const centerRotable: Object3D | undefined = flatedComponents.find(
      //     (item) => item.name === "centerRotable"
      //   );
      //   if (centerRotable) {
      //     centerRotable.rotateOnAxis(axis, angle);
      //   }
    };
  }
}
