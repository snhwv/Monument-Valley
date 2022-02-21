import {
  CircleGeometry,
  Color,
  CylinderBufferGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import Moveable from "./lib/moveable";
import matcap2 from "../assets/matcap/matcap2.png";
import { animate } from "popmotion";

class MoveControl extends Moveable {
  constructor(...args: any) {
    super(...args);
  }
  getDefaultProps() {
    return [
      {
        gap: 5,
        controlNumber: 4,
        plugR: 6,
        plugHeight: 6,
        largeCircleColor: "0xff0000",
        smallCircleColor: "0x00ff00",
      },
    ];
  }
  generateElement() {
    this.plugMatcap = this.plugMatcap || matcap2;
    this.generatePlug();
  }

  plugMatcap = matcap2;
  setProgramProps({ plugMatcap }: { plugMatcap?: string }) {
    this.plugMatcap = plugMatcap || this.plugMatcap;
    this.changeProps(...JSON.parse(JSON.stringify(this.userData.props)));
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
      gm.makeTranslation((2 * plugR + gap) * i, 0, 0);
      g.applyMatrix4(gm);

      g.add(cylinder);
      g.add(circle);
      g.add(circle2);
      gs.add(g);
    }

    const gsm = new Matrix4();
    gsm.makeTranslation(-((2 * plugR + gap) * (controlNumber - 1)) / 2, 0, 0);
    gs.applyMatrix4(gsm);

    this.add(gs);
  }
  moveInitWorldPosition?: Vector3;

  onMoveBegin() {
    this.moveInitWorldPosition = new Vector3();
    this.getWorldPosition(this.moveInitWorldPosition);

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
  onMoveEnd() {
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
    // animate({
    //   from: 0,
    //   to: 1,
    //   duration: 400,
    //   onUpdate: (latest) => {
    //     plugMaterial1.opacity = latest;
    //   },
    // });
  }
}
(MoveControl as any).cnName = "移动控制";
(MoveControl as any).constName = "MoveControl";
export default MoveControl;
