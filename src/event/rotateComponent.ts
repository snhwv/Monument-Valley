import { orbitControls, scene } from "@env";
import { ArrowHelper, Object3D, Vector3 } from "three";
import Rotable from "@components/lib/rotable";
import { IpinterdownHander, store } from "./store";
const rotationPointer = new Vector3();

let totalAngle = 0;
export const setRotation: IpinterdownHander = ({ raycaster, next }) => {
  if (store.isRotable && store.rotationComponent) {
    const target = new Vector3();
    raycaster.ray.intersectPlane(
      store.rotationComponent.userData.rotablePlane,
      target
    );

    target.sub((store.rotationComponent as any).worldPosition);

    let angle = rotationPointer.angleTo(target);

    const velocity = new Vector3();
    velocity.crossVectors(rotationPointer, target);

    const dirction =
      velocity.dot(store.rotationComponent.userData.rotablePlane.normal) > 0
        ? 1
        : -1;
    angle = dirction * angle;
    totalAngle += angle;
    (store.rotationComponent as any)?.onRotate(
      store.rotationComponent.userData.rotablePlane.normal,
      angle
    );

    rotationPointer.copy(target);
  }
  next();
};

const getRotableParent = (obj: any) => {
  let parent = obj;
  while (parent) {
    if (parent instanceof Rotable) {
      return parent;
    }
    parent = parent.parent;
  }
  return parent;
};
export const setRotationPrevPoint: IpinterdownHander = ({
  mainGroupIntersect,
  raycaster,
  next,
}) => {
  mainGroupIntersect = getRotableParent(mainGroupIntersect);
  if (mainGroupIntersect) {
    if (mainGroupIntersect.userData?.disabled) {
      return;
    }
    totalAngle = 0;
    store.isRotable = true;
    orbitControls.enabled = false;

    store.rotationComponent = mainGroupIntersect as any;
    (mainGroupIntersect as any).generateRotablePlane();
    const target = new Vector3();
    raycaster.ray.intersectPlane(
      mainGroupIntersect.userData.rotablePlane,
      target
    );

    rotationPointer.subVectors(
      target,
      (mainGroupIntersect as any).worldPosition
    );
    (store.rotationComponent as any)?.onRotateBegin();
  }
  next();
};

export const rotated: IpinterdownHander = ({ next }) => {
  store.isRotable = false;
  orbitControls.enabled = store.isDev;
  (store.rotationComponent as any)?.onRotated(
    store.rotationComponent?.userData.rotablePlane.normal,
    totalAngle
  );
  (store.rotationComponent as any)?.onRotateEnd();
  store.rotationComponent = null;
  next();
};
