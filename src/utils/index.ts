import { BufferGeometry, Matrix4, Object3D } from "three";

export function skew(object: Object3D | BufferGeometry) {
  var Syx = 1,
    Szx = 0,
    Sxy = 0,
    Szy = 0,
    Sxz = 0,
    Syz = 0;

  var matrix = new Matrix4();

  matrix.set(1, Syx, Szx, 0, Sxy, 1, Szy, 0, Sxz, Syz, 1, 0, 0, 0, 0, 1);
  object.applyMatrix4(matrix);
}
