import { unitWidth } from "@constants";
import {
  BoxGeometry,
  ExtrudeGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Shape,
} from "three";
import Component from "./lib/recordable";

class Guardrail extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateGuardrail();
  }
  matcap?: string;
  setMatcap(matcap: string) {
    this.matcap = matcap;
    this.changeProps(...JSON.parse(JSON.stringify(this.userData.props)));
  }
  getDefaultProps() {
    return [
      {
        width0: 2,
        width1: 5,
        height: 5,
        depth: 2,
      },
    ];
  }
  generateGuardrail() {
    
    const obj = this.userData.props?.[0];

    const width0 = obj?.width0;
    const width1 = obj?.width1;
    const height = obj?.height;
    const depth = obj?.depth;
    console.log(height);
    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, height);
    shape.lineTo(width0, height);
    shape.lineTo(width1, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
      depth,
      bevelEnabled: false,
    };

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    const material = this.getDefaultMaterial({ textureSrc: this.matcap });
    const mesh = new Mesh(geometry, material);

    const mesh1 = mesh.clone();
    mesh1.rotateY(Math.PI);
    mesh1.translateX(-unitWidth);
    mesh1.translateZ(-depth);

    this.add(mesh);
    this.add(mesh1);
  }
}
(Guardrail as any).cnName = "护栏";
export default Guardrail;
