import { orbitControls } from "@env";
import { Vector3 } from "three";
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

    target.projectOnPlane(store.rotationComponent.userData.rotablePlane.normal);

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

export const setRotationPrevPoint: IpinterdownHander = ({
  mainGroupIntersect,
  raycaster,
  next,
}) => {
  if (mainGroupIntersect instanceof Rotable) {
    totalAngle = 0;
    store.isRotable = true;
    orbitControls.enabled = false;

    store.rotationComponent = mainGroupIntersect;
    mainGroupIntersect.generateRotablePlane();
    const target = new Vector3();
    raycaster.ray.intersectPlane(
      mainGroupIntersect.userData.rotablePlane,
      target
    );

    target.projectOnPlane(mainGroupIntersect.userData.rotablePlane.normal);

    rotationPointer.copy(target);
    (store.rotationComponent as any)?.onRotateBegin();
  }
  next();
};

export const rotated: IpinterdownHander = () => {
  store.isRotable = false;
  orbitControls.enabled = true;
  (store.rotationComponent as any)?.onRotated(
    store.rotationComponent?.userData.rotablePlane.normal,
    totalAngle
  );
  (store.rotationComponent as any)?.onRotateEnd();
  store.rotationComponent = null;
};
