import { unitWidth } from "@constants";
import { BoxGeometry, Group, Material, Matrix4, Mesh, MeshLambertMaterial } from "three";

class Ada extends Group {
  material!: Material;
  constructor() {
    super();
    this.generateElement();
  }
  generateElement() {
    this.generateCube();
  }
  generateCube() {
    const cubeGeometry = new BoxGeometry(
      unitWidth * 1,
      unitWidth * 1,
      unitWidth * 0.2
    );
    const material = new MeshLambertMaterial({
      color: 0xffae71,
      depthTest: false,
    });
    this.material = material;
    this.setZIndex(0);

    
    const cubem = new Matrix4();
    cubem.makeRotationY(Math.PI / 2);
    cubeGeometry.applyMatrix4(cubem);
    
    this.add(new Mesh(cubeGeometry, material));
  }
  setZIndex(zIndex: number) {
    this.renderOrder = zIndex;
    this.material.depthTest = !zIndex;
  }
}

export default Ada;
