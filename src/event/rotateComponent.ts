import { orbitControls } from "@env";
import { Vector3 } from "three";
import Rotable from "@components/lib/rotable";
import { IpinterdownHander, store } from "./store";
const rotationPointer = new Vector3();

export const setRotation: IpinterdownHander = ({ raycaster, next }) => {
  if (store.isRotable && store.rotationComponent) {
    const target = new Vector3();
    raycaster.ray.intersectPlane(
      store.rotationComponent.userData.rotablePlane,
      target
    );

    const worldP = new Vector3();
    store.rotationComponent.getWorldPosition(worldP);
    target.sub(worldP);

    let angle = rotationPointer.angleTo(target);

    const velocity = new Vector3();
    velocity.crossVectors(rotationPointer, target);
    const dirction = velocity.dot(store.rotationComponent.up) > 0 ? 1 : -1;
    angle = dirction * angle;
    store.rotationComponent.rotateOnAxis(store.rotationComponent.up, angle);
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
    store.isRotable = true;
    orbitControls.enabled = false;

    store.rotationComponent = mainGroupIntersect;

    const target = new Vector3();
    raycaster.ray.intersectPlane(
      mainGroupIntersect.userData.rotablePlane,
      target
    );
    mainGroupIntersect.worldToLocal(target);
    rotationPointer.copy(target);
  }
  next();
};
