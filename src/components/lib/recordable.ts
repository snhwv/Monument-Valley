import { flatedComponents, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import {
  Color,
  Group,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshStandardMaterial,
  TextureLoader,
} from "three";
import { v4 } from "uuid";
import merge from "lodash.merge";
import matcap1 from "../../assets/matcap/matcap1.png";
export function isFunction(val: unknown): val is Function {
  return typeof val === "function";
}
abstract class Component extends Group {
  key: string;
  title: string;
  constructor(...args: any) {
    super();
    this.userData.props = [];
    mainGroup.add(this);
    flatedComponents.push(this);
    this.key = v4();
    this.title = this.key;

    if (isFunction(args?.[2])) {
      args?.[2](this);
    }

    if (args?.[1]) {
      this.changeProps(...args);
    }

    updateSceneTree();
  }

  getProps() {
    return this.userData.props;
  }
  getFirstProps() {
    return this.userData.props?.[0];
  }

  changeProps(...args: any) {
    const childrenLength = this.children.length;

    for (let i = 0; i < childrenLength; i++) {
      this.children[0].removeFromParent();
    }

    const defaultProps = this?._getDefaultProps?.();
    if (defaultProps) {
      merge(this.userData.props, defaultProps, args);
    }
    const obj = this.userData.props?.[0];
    const zIndex = obj?.zIndex;

    if (zIndex) {
      this.renderOrder = zIndex;
    }

    this.name = obj?.name || "";

    this.generateElement();
  }

  getDefaultMaterial(params?: {
    textureSrc?: string;
    materialColor?: number | string;
  }) {
    const { textureSrc, materialColor } = params || {};
    const texture = new TextureLoader().load(textureSrc || matcap1);

    const obj = this.userData.props?.[0];
    const objMaterialColor = obj?.materialColor || "";
    const material = new MeshMatcapMaterial({
      depthTest: this.getZIndex() ? false : true,
      matcap: texture,
    });
    material.defines["SHOW_SHADOW"] = !!obj?.showShadow;
    material.defines["SHADOW_OFFSET"] = obj?.shadowOffset || 0.8;
    material.defines["SHADOW_SLOPE"] = obj?.slope || 0.2;
    if (Number(materialColor) || Number(objMaterialColor)) {
      material.color = new Color(
        Number(materialColor) || Number(objMaterialColor)
      );
    }
    material.onBeforeCompile = function (shader) {
      shader.vertexShader = `#define MATCAP
      varying vec3 vViewPosition;
      varying vec4 vPosition;
      #include <common>
      #include <uv_pars_vertex>
      #include <color_pars_vertex>
      #include <displacementmap_pars_vertex>
      #include <fog_pars_vertex>
      #include <normal_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>
      void main() {
        #include <uv_vertex>
        #include <color_vertex>
        #include <beginnormal_vertex>
        #include <morphnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>
        #include <normal_vertex>
        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <displacementmap_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
        #include <fog_vertex>
        vViewPosition = - mvPosition.xyz;
        vPosition = vec4( position, 1.0 );
      }`;
      shader.fragmentShader = `#define MATCAP
      uniform vec3 diffuse;
      uniform float opacity;
      uniform sampler2D matcap;
      varying vec3 vViewPosition;
      varying vec4 vPosition;
      #include <common>
      #include <dithering_pars_fragment>
      #include <color_pars_fragment>
      #include <uv_pars_fragment>
      #include <map_pars_fragment>
      #include <alphamap_pars_fragment>
      #include <alphatest_pars_fragment>
      #include <fog_pars_fragment>
      #include <normal_pars_fragment>
      #include <bumpmap_pars_fragment>
      #include <normalmap_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>
      void main() {
        #include <clipping_planes_fragment>
        vec4 diffuseColor = vec4( diffuse, opacity );
        #include <logdepthbuf_fragment>
        #include <map_fragment>
        #include <color_fragment>
        #include <alphamap_fragment>
        #include <alphatest_fragment>
        #include <normal_fragment_begin>
        #include <normal_fragment_maps>
        vec3 viewDir = normalize( vViewPosition );
        vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
        vec3 y = cross( viewDir, x );
        vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
        #ifdef USE_MATCAP
          vec4 matcapColor = texture2D( matcap, uv );
          matcapColor = matcapTexelToLinear( matcapColor );
        #else
          vec4 matcapColor = vec4( 1.0 );
        #endif

        #ifdef SHOW_SHADOW
          float factor = ((vPosition.y + 8.0) / 16.0) * SHADOW_SLOPE + SHADOW_OFFSET;
          if(factor > 1.0) {
            factor = 1.0;
          }
        #else
          float factor = 1.0;
        #endif
        vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb * vec3(factor,factor,factor);
        #include <output_fragment>
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
        #include <premultiplied_alpha_fragment>
        #include <dithering_fragment>
      }`;
    };
    material.needsUpdate = true;
    return material;
  }
  getDefaultMaterial1(params?: {
    textureSrc?: string;
    materialColor?: number | string;
  }) {
    const { textureSrc, materialColor } = params || {};
    const texture = new TextureLoader().load(textureSrc || matcap1);

    const obj = this.userData.props?.[0];
    const objMaterialColor = obj?.materialColor || "";
    const material = new MeshMatcapMaterial({
      depthTest: this.getZIndex() ? false : true,
      matcap: texture,
    });
    if (Number(materialColor) || Number(objMaterialColor)) {
      material.color = new Color(
        Number(materialColor) || Number(objMaterialColor)
      );
    }

    return material;
  }

  getZIndex(): number {
    const obj = this.userData.props?.[0];
    return obj?.zIndex || 0;
  }
  _getDefaultProps(): any[] {
    return merge(this.getDefaultProps(), [
      {
        zIndex: 0,
        name: "",
        materialColor: "",
        showShadow: 0,
        shadowOffset: 0.8,
        slope: 0.2,
      },
    ]);
  }
  getDefaultProps(): any[] {
    return [];
  }

  abstract generateElement(): void;
}
export default Component;
