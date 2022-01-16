import { orbitControls, scene } from "@env";
import { ArrowHelper, Vector3 } from "three";
import Rotable from "@components/lib/rotable";
import { IpinterdownHander, store } from "./store";
import Moveable from "@components/lib/moveable";
const movePointer = new Vector3();

let totalMovement = new Vector3();
export const setMove: IpinterdownHander = ({ raycaster, next }) => {
  if (store.isMoveable && store.moveComponent) {
    const target = new Vector3();
    raycaster.ray.intersectPlane(
      store.moveComponent.userData.movePlane,
      target
    );

    target.sub((store.moveComponent as any).worldPosition);

    const result = new Vector3().copy(target);
    result.sub(movePointer);
    totalMovement.add(result);
    (store.moveComponent as any)?.onMove(
      store.moveComponent.userData.movePlane.normal,
      result
    );
    movePointer.copy(target);
  }
  next();
};

export const setMovePrevPoint: IpinterdownHander = ({
  mainGroupIntersect,
  raycaster,
  next,
}) => {
  if (mainGroupIntersect instanceof Moveable) {
    if (mainGroupIntersect.userData?.disabled) {
      return;
    }
    totalMovement = new Vector3();
    store.isMoveable = true;
    orbitControls.enabled = false;

    store.moveComponent = mainGroupIntersect;
    mainGroupIntersect.generateMovePlane();
    const target = new Vector3();
    raycaster.ray.intersectPlane(mainGroupIntersect.userData.movePlane, target);

    movePointer.subVectors(target, mainGroupIntersect.worldPosition);
    (store.moveComponent as any)?.onMoveBegin();
  }
  next();
};

export const moved: IpinterdownHander = ({ next }) => {
  store.isMoveable = false;
  orbitControls.enabled = true;
  console.log((store.moveComponent as any)?.moveInitWorldPosition);
  (store.moveComponent as any)?.onMoved(
    store.moveComponent?.userData.movePlane.normal,
    totalMovement
  );
  (store.moveComponent as any)?.onMoveEnd();
  store.moveComponent = null;
  next();
};
