import { transformControls } from "@env";
import { setTreeExpandedKeys } from "../layout/SceneTree";
import { IpinterdownHander } from "./store";
export const setTransformControl: IpinterdownHander = ({
  mainGroupIntersect,
  next,
}) => {
  if (transformControls.dragging) {
    next();
    return;
  }
  if (mainGroupIntersect) {
    const intersect = mainGroupIntersect;
    if (intersect !== transformControls.object) {
      transformControls.detach();
      transformControls.attach(intersect);

      setTreeExpandedKeys([intersect.id]);
    }
  }
  next();
};
