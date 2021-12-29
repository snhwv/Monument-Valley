import { Group, Object3D, Raycaster } from "three";

export const store: {
  isShiftDown: boolean;
  isCtrlDown: boolean;
  isRotable: boolean;
  rotationComponent: Group | null;
} = {
  isShiftDown: false,
  isCtrlDown: false,
  isRotable: false,
  rotationComponent: null,
};

export type IpinterdownHander = (event: {
  mainGroupIntersect?: Object3D;
  next: () => void;
  raycaster: Raycaster;
}) => void | undefined;
