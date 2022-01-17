import { unitWidth } from "@constants";
import {
  BoxBufferGeometry,
  Color,
  ExtrudeGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  ShaderMaterialParameters,
  Shape,
  TextureLoader,
  Vector2,
  Vector3,
} from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";
import matcap2 from "../assets/matcap/matcap2.png";
import texture1 from "../assets/texture/texture1.png";
import { animate, linear } from "popmotion";

// 顶
class FlatRoof extends Component {
  hatHeight = unitWidth * 2;
  constructor();

  constructor(...args: any) {
    super(...args);
  }

  generateElement(): void {
    this.hatHeight = unitWidth * 2;
    this.generateHat();
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
    const p1 = new Vector2(
      unitWidth * 1.5 - unitWidth * 0.1,
      unitWidth * 2 - unitWidth / 8 - unitWidth * 0.5
    );
    const p2 = new Vector2(
      unitWidth * 1.5 - unitWidth * 0.44,
      unitWidth * 2 - unitWidth / 8 - unitWidth * 0.32
    );

    shape.moveTo(0, unitWidth * 3.5);
    shape.lineTo(3, unitWidth * 3.5 - unitWidth);
    shape.lineTo(0, unitWidth * 3.5 - unitWidth);

    shape.lineTo(4, unitWidth * 2.5 - 4);

    shape.lineTo(0, unitWidth * 2);
    shape.lineTo(unitWidth / 8, unitWidth * 2 - unitWidth / 8);
    shape.bezierCurveTo(
      p1.x,
      p1.y,
      p2.x,
      p2.y,
      unitWidth * 1.5,
      unitWidth * 2 - unitWidth
    );

    const p3 = new Vector2(unitWidth * 3 - 8, 8);
    const p4 = new Vector2(unitWidth * 3, 8);
    shape.bezierCurveTo(p3.x, p3.y, p4.x, p4.y, unitWidth * 3, 0);

    shape.lineTo(-unitWidth * 3, 0);

    const reflectP3 = new Vector2().copy(p3).multiply(new Vector2(-1, 1));
    const reflectP4 = new Vector2().copy(p4).multiply(new Vector2(-1, 1));

    shape.bezierCurveTo(
      reflectP4.x,
      reflectP4.y,
      reflectP3.x,
      reflectP3.y,
      -unitWidth * 1.5,
      unitWidth * 2 - unitWidth
    );
    const reflectP1 = new Vector2().copy(p1).multiply(new Vector2(-1, 1));
    const reflectP2 = new Vector2().copy(p2).multiply(new Vector2(-1, 1));

    shape.bezierCurveTo(
      reflectP2.x,
      reflectP2.y,
      reflectP1.x,
      reflectP1.y,
      -unitWidth / 8,
      unitWidth * 2 - unitWidth / 8
    );

    shape.lineTo(0, unitWidth * 2);
    shape.lineTo(-4, unitWidth * 2.5 - 4);
    shape.lineTo(0, unitWidth * 3.5 - unitWidth);
    shape.lineTo(-3, unitWidth * 3.5 - unitWidth);
    shape.lineTo(0, unitWidth * 3.5);
    const depth = unitWidth * 6;
    var extrudeSettings = {
      depth,
      bevelEnabled: false,
      curveSegments: 12,
    };

    var verticalGeometry = new ExtrudeGeometry(shape, extrudeSettings);

    const cubem = new Matrix4();
    const scaleFactor = 1;
    cubem
      .makeScale(scaleFactor, scaleFactor, scaleFactor)
      .premultiply(new Matrix4().makeTranslation(0, 0, -unitWidth * 3));
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
    result.scale.set(1 / 6, 1 / 3, 1 / 6);
    this.add(result);

    // this.add(new Mesh(verticalGeometry, cubeMaterial));
    // this.add(new Mesh(horizontalGeometry, cubeMaterial));
  }

  generateFlag() {
    const width = 26;
    const height = 2;
    const geometry = new PlaneGeometry(width, height, 20, 2);
    const material = this.getFlagMaterial({
      fogColor: { value: new Vector3(65 / 255, 187 / 255, 175 / 255) },
      time: { value: 0.0 },
      height: { value: 2.0 },
      width: { value: 26.0 },
    });
    const material1 = this.getFlagMaterial({
      fogColor: { value: new Vector3(65 / 255, 187 / 255, 175 / 255) },
      time: { value: 1.0 },
      height: { value: 2.0 },
      width: { value: 26.0 },
    });

    const plane = new Mesh(geometry, material);
    plane.translateX(width / 2);
    plane.translateY(unitWidth + 3);

    const planeTwo = plane.clone();
    planeTwo.translateY(2);

    planeTwo.material = material1;

    animate({
      from: 0,
      to: 1,
      duration: 3000,
      ease: linear,
      repeat: Infinity,
      onUpdate: () => {
        material.uniforms["time"].value =
          (material.uniforms["time"].value - 0.1) % (Math.PI * 2);
        material1.uniforms["time"].value =
          (material1.uniforms["time"].value - 0.1) % (Math.PI * 2);
      },
    });

    this.add(plane);
    this.add(planeTwo);

    const cubeMaterial = this.getDefaultMaterial({ textureSrc: matcap2 });
    const size = 1;
    const geo = new OctahedronGeometry(size);
    geo.translate(0, unitWidth + 7, 0);
    geo.rotateY(Math.PI / 4);

    const octMesh = new Mesh(geo, cubeMaterial);
    this.add(octMesh);
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
(FlatRoof as any).cnName = "平屋顶";
export default FlatRoof;
