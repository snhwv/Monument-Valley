import { Group, Object3D, Raycaster } from "three";

export const store: {
  isShiftDown: boolean;
  isCtrlDown: boolean;
  isRotable: boolean;
  isMoveable: boolean;
  rotationComponent: Group | null;
  moveComponent: Group | null;
} = {
  isShiftDown: false,
  isCtrlDown: false,
  isRotable: false,
  isMoveable: false,
  rotationComponent: null,
  moveComponent: null,
};

export type IpinterdownHander = (event: {
  mainGroupIntersect?: Object3D;
  next: () => void;
  raycaster: Raycaster;
}) => void | undefined;
