import { unitWidth } from "@constants";
import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  Color,
  CylinderBufferGeometry,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  Plane,
  TextureLoader,
  Vector3,
} from "three";
import Rotable from "./lib/rotable";
import matcap2 from "../assets/matcap/matcap2.png";
import matcap3 from "../assets/matcap/matcap3.png";
import texture1 from "../assets/texture/texture1.png";
import { animate } from "popmotion";

class CubeRotateControl extends Rotable {
  onRotateBegin() {
    const plugMaterial1 = this.userData.plugMaterial1 as MeshBasicMaterial;

    const obj = this.userData.props?.[0];
    const largeCircleColor = obj?.largeCircleColor;
    const subColor = new Color(0xffffff).sub(
      new Color(Number(largeCircleColor))
    );
    animate({
      from: 0,
      to: 1,
      duration: 400,
      onUpdate: (latest) => {
        plugMaterial1.color.set(
          new Color(Number(largeCircleColor)).add(
            new Color().copy(subColor).multiplyScalar(latest)
          )
        );
      },
    });
  }
  onRotateEnd() {
    const plugMaterial1 = this.userData.plugMaterial1 as MeshBasicMaterial;

    const obj = this.userData.props?.[0];
    const largeCircleColor = obj?.largeCircleColor;
    const subColor = new Color(0xffffff).sub(
      new Color(Number(largeCircleColor))
    );
    animate({
      from: 1,
      to: 0,
      duration: 400,
      onUpdate: (latest) => {
        plugMaterial1.color.set(
          new Color(Number(largeCircleColor)).add(
            new Color().copy(subColor).multiplyScalar(latest)
          )
        );
      },
    });
  }
  constructor(...args: any) {
    super(...args);
  }
  generateElement(): void {
    // this.plugTexture = this.plugTexture || texture1;
    // this.largeCircleColor = this.largeCircleColor || 0xece4b2;
    // this.smallCircleColor = this.smallCircleColor || 0x6a6b39;
    // this.rodTexture = this.rodTexture || matcap2;
    // this.rodEndTexture = this.rodEndTexture || matcap3;
    this.generateCube();
  }
  getDefaultProps() {
    return [
      {
        gap: 6,
        controlNumber: 5,
        plugR: 4,
        plugHeight: 6,
        largeCircleColor: "0xff0000",
        smallCircleColor: "0x00ff00",
        width: unitWidth * 5,
        height: unitWidth,
        deepth: unitWidth * 5,
      },
    ];
  }

  plugTexture = texture1;
  rodTexture = matcap2;
  rodEndTexture = matcap3;
  largeCircleColor = 0xece4b2;
  smallCircleColor = 0x6a6b39;

  plugMatcap = matcap2;
  cubMatcap = matcap2;
  setProgramProps({
    plugMatcap,
    plugTexture,
    rodTexture,
    rodEndTexture,
    largeCircleColor,
    smallCircleColor,
  }: {
    plugMatcap?: string;
    plugTexture?: string;
    rodTexture?: string;
    rodEndTexture?: string;
    largeCircleColor?: number;
    smallCircleColor?: number;
  }) {
    this.plugMatcap = plugMatcap || this.plugMatcap;
    // this.plugTexture = plugTexture || this.plugTexture;
    // this.rodTexture = rodTexture || this.rodTexture;
    // this.rodEndTexture = rodEndTexture || this.rodEndTexture;
    // this.largeCircleColor = largeCircleColor || this.largeCircleColor;
    // this.smallCircleColor = smallCircleColor || this.smallCircleColor;

    this.changeProps(...JSON.parse(JSON.stringify(this.userData.props)));
  }

  generateCube() {
    const obj = this.userData.props?.[0];

    const width = obj?.width;
    const height = obj?.height;
    const deepth = obj?.deepth;
    const cubeGeometry = new BoxGeometry(width, height, deepth);
    const cubeMaterial = this.getDefaultMaterial({
      textureSrc: this.cubMatcap,
    });
    this.add(new Mesh(cubeGeometry, cubeMaterial));

    const controlPlugGroup = this.generatePlug();
    controlPlugGroup.translateZ(deepth / 2);

    for (let i = 0; i < 4; i++) {
      const plugGroup = controlPlugGroup.clone();
      const containerGroup = new Group();
      containerGroup.add(plugGroup);
      containerGroup.rotateOnAxis(new Vector3(0, 1, 0), (Math.PI / 2) * i);
      this.add(containerGroup);
    }
  }

  generatePlug() {
    const obj = this.userData.props?.[0];

    const controlNumber = obj?.controlNumber;
    const largeCircleColor = obj?.largeCircleColor;
    const smallCircleColor = obj?.smallCircleColor;
    const plugR = obj?.plugR;
    const plugHeight = obj?.plugHeight;
    const gap = obj?.gap;

    const cylinderMaterial = this.getDefaultMaterial({
      textureSrc: this.plugMatcap,
    });

    var geometry = new CylinderBufferGeometry(plugR, plugR, plugHeight, 32);

    const geometry1 = new CircleGeometry(plugR, 32);

    const circleM = new Matrix4();
    circleM
      .makeTranslation(0, plugHeight / 2 + 0.01, 0)
      .multiply(
        new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), -Math.PI / 2)
      );
    geometry1.applyMatrix4(circleM);

    const geometry2 = geometry1.clone();
    geometry2.scale(0.5, 1, 0.5).translate(0, 0.01, 0);
    console.log(largeCircleColor);

    const material1 = new MeshBasicMaterial({
      color: Number(largeCircleColor),
    });
    const material2 = new MeshBasicMaterial({
      color: Number(smallCircleColor),
    });

    this.userData.plugMaterial1 = material1;
    this.userData.plugMaterial2 = material2;

    const gs = new Group();

    for (let i = 0; i < controlNumber; i++) {
      const g = new Group();

      const circle = new Mesh(geometry1, material1);
      const circle2 = new Mesh(geometry2, material2);
      var cylinder = new Mesh(geometry, cylinderMaterial);

      const gm = new Matrix4();
      gm.makeTranslation((2 * plugR + gap) * i, 0, 0).multiply(
        new Matrix4().makeRotationAxis(new Vector3(1, 0, 0), Math.PI / 2)
      );
      g.applyMatrix4(gm);

      g.add(cylinder);
      g.add(circle);
      g.add(circle2);
      gs.add(g);
    }

    const gsm = new Matrix4();
    gsm.makeTranslation(-((2 * plugR + gap) * (controlNumber - 1)) / 2, 0, 0);
    gs.applyMatrix4(gsm);
    return gs;
  }
}
(CubeRotateControl as any).cnName = "长方体旋转控制";
export default CubeRotateControl;
