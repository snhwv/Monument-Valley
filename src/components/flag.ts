import { unitWidth } from "@constants";
import { animate, linear } from "popmotion";
import {
  Matrix4,
  Mesh,
  OctahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  ShaderMaterialParameters,
  Vector3,
} from "three";
import Component from "./lib/recordable";

import matcap2 from "../assets/matcap/matcap2.png";
class Flag extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement(): void {
    this.generateFlag();
  }

  getDefaultProps() {
    return [
      {
        width: 26,
        height: 2,
        initTime: 0,
      },
    ];
  }

  generateFlag() {
    const obj = this.userData.props?.[0];
    const { width = 26, height = 2, initTime = 0 } = obj;
    const geometry = new PlaneGeometry(width, height, 20, 2);
    const material = this.getFlagMaterial({
      fogColor: { value: new Vector3(65 / 255, 187 / 255, 175 / 255) },
      time: { value: initTime },
      height: { value: height },
      width: { value: width },
    });

    const plane = new Mesh(geometry, material);
    plane.translateX(width / 2);
    plane.translateY(height / 2);

    animate({
      from: 0,
      to: 1,
      duration: 3000,
      ease: linear,
      repeat: Infinity,
      onUpdate: () => {
        material.uniforms["time"].value =
          (material.uniforms["time"].value - 0.1) % (Math.PI * 2);
      },
    });
    this.add(plane);
  }

  getFlagMaterial(uniforms: ShaderMaterialParameters["uniforms"]) {
    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
      uniform float time;
      uniform float width;
      varying vec3 v_position;
			void main()
			{
        vec3 newPos = position;
        float factor = (newPos.x + width / 2.0) / width;
        newPos.z = sin(newPos.x / 4.0 + time) * 4.0 * factor;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
        v_position = position;
			}
`,
      fragmentShader: `
      uniform float time;
			uniform vec3 fogColor;
      varying vec3 v_position;
      uniform float width;
      uniform float height;

			void main( void ) {
        float factor = -v_position.x * (height/width);
        if(v_position.y > factor) {
          discard;
        }

				gl_FragColor =vec4( fogColor, 1.0 );

			}`,
    });
    return material;
  }
}
(Flag as any).cnName = "旗子";
export default Flag;
