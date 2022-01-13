import { unitWidth } from "@constants";
import {
  BoxBufferGeometry,
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  Shape,
  Vector2,
  Vector3,
} from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";
import matcap2 from "../assets/matcap/matcap2.png";
import { animate, linear } from "popmotion";

// 顶
class Roof extends Component {
  hatHeight = unitWidth * 2;
  constructor();

  constructor(...args: any) {
    super(...args);
  }

  generateElement(): void {
    this.hatHeight = unitWidth * 2;
    this.generateHat();
    this.generatePedestal();
    this.generateFlag();
  }

  generatePedestal() {
    const thickness = 1;
    const cubeMaterial = this.getDefaultMaterial({ textureSrc: matcap2 });
    var geometry = new BoxBufferGeometry(
      unitWidth + 4,
      thickness,
      unitWidth + 4
    );

    const cubem = new Matrix4();
    cubem.makeTranslation(0, thickness / 2 - unitWidth / 2, 0);
    geometry.applyMatrix4(cubem);

    var cube = new Mesh(geometry, cubeMaterial);

    this.add(cube);
  }

  generateHat() {
    var shape = new Shape();
    const p1 = new Vector2(-unitWidth, 18);
    const p2 = new Vector2(0, 10);
    const p3 = new Vector2(0, this.hatHeight);

    shape.moveTo(-unitWidth * 0.4, 0);
    shape.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    const reflectP1 = new Vector2().copy(p1).multiply(new Vector2(-1, 1));
    const reflectP2 = new Vector2().copy(p2).multiply(new Vector2(-1, 1));

    shape.bezierCurveTo(
      reflectP2.x,
      reflectP2.y,
      reflectP1.x,
      reflectP1.y,
      unitWidth * 0.4,
      0
    );

    shape.lineTo(-unitWidth * 0.4, 0);

    const depth = unitWidth * 2;
    var extrudeSettings = {
      depth,
      bevelEnabled: false,
      curveSegments: 8,
    };

    var verticalGeometry = new ExtrudeGeometry(shape, extrudeSettings);

    const cubem = new Matrix4();
    const scaleFactor = 1.3;
    cubem
      .makeScale(scaleFactor, scaleFactor, scaleFactor)
      .premultiply(
        new Matrix4().makeTranslation(
          0,
          -unitWidth / 2 + 1,
          -unitWidth * scaleFactor
        )
      );
    verticalGeometry.applyMatrix4(cubem);

    var horizontalGeometry = verticalGeometry.clone();

    const hm = new Matrix4();
    hm.makeRotationY(Math.PI / 2);
    verticalGeometry.applyMatrix4(hm);

    // const cubeMaterial = this.getDefaultMaterial( {textureSrc: matcap2});
    const cubeMaterial = this.getDefaultMaterial({ textureSrc: matcap2 });
    const result = CSG.intersect(
      new Mesh(verticalGeometry, cubeMaterial),
      new Mesh(horizontalGeometry, cubeMaterial)
    );
    this.add(result);

    // this.add(new Mesh(horizontalGeometry, cubeMaterial));
  }

  generateFlag() {
    const uniforms = {
      fogColor: { value: new Vector3(65 / 255, 187 / 255, 175 / 255) },
      time: { value: 0.0 },
      height: { value: 8.0 },
      width: { value: 50.0 },
    };

    const width = 50;
    const height = 8;
    uniforms.width.value = width;
    uniforms.height.value = height;
    const geometry = new PlaneGeometry(width, height, 20, 2);
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

    animate({
      from: 0,
      to: 1,
      duration: 3000,
      ease: linear,
      repeat: Infinity,
      onUpdate: () => {
        uniforms["time"].value = (uniforms["time"].value - 0.1) % (Math.PI * 2);
      },
    });

    const plane = new Mesh(geometry, material);
    plane.translateX(width / 2);
    plane.translateY(this.hatHeight + height - 2);

    this.add(plane);

    const cubeMaterial = this.getDefaultMaterial({ textureSrc: matcap2 });
    const size = 2;
    const geo = new OctahedronGeometry(size);
    geo.translate(0, this.hatHeight + height + size * 2, 0);
    geo.rotateY(Math.PI / 4);

    const octMesh = new Mesh(geo, cubeMaterial);
    this.add(octMesh);
  }
}
(Roof as any).cnName = "屋顶";
export default Roof;
