import { transformControls } from "@env";
import { setTreeExpandedKeys } from "../layout/SceneTree";
import { IpinterdownHander, store } from "./store";
export const setTransformControl: IpinterdownHander = ({
  mainGroupIntersect,
  next,
}) => {
  if (!store.isTransform) {
    next();
    return;
  }
  if (transformControls.dragging) {
    next();
    return;
  }
  if (mainGroupIntersect) {
    console.log(mainGroupIntersect);
    const intersect = mainGroupIntersect;
    if (intersect !== transformControls.object) {
      transformControls.detach();
      transformControls.attach(intersect);

      setTreeExpandedKeys([intersect.id]);
    }
  }
  next();
};
