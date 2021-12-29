import { IpinterdownHander, store } from "./store";

export const crudComponents: IpinterdownHander = ({
  mainGroupIntersect,
  next,
}) => {
  const intersect = mainGroupIntersect;
  if (!(intersect && (store.isShiftDown || store.isCtrlDown))) {
    next();
    return;
  }
  if (store.isShiftDown) {
    intersect.parent?.remove(intersect);
  } else if (store.isCtrlDown) {
  }
};
