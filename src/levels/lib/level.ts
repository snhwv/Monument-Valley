import { componentMap } from "@components";
import { camera, mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { Group, Matrix4, Vector3 } from "three";
import Component from "@components/lib/recordable";

export default abstract class Level {
  constructor() {
    Component.FOG_COLOR = undefined;
    camera.position.set(200, 200, 200);
    camera.lookAt(new Vector3());
  }
  loadDataScene(data: string) {
    // const mainGroupChildren = localStorage.getItem("mainGroupChildren");
    const mainGroupChildren = data;
    // const mainGroupChildren = '';
    if (mainGroupChildren) {
      const parsedMainGroupChildren = JSON.parse(mainGroupChildren);
      const generateObj = (arr: any[], parent: any) => {
        arr.map((item: any) => {
          const onCreate = (comp: Group) => {
            comp.parent?.remove(comp);
            parent.add(comp);

            const matrix = new Matrix4();
            matrix.elements = item.matrix.elements;
            comp.applyMatrix4(matrix);
          };

          // if (item.type === "Path") {
          //   item.userData.props[0] = { ...item.userData.props[0], isStatic: 0 };
          // }
          const component: Group = new (componentMap as any)[item.type](
            item.userData.props[0],
            item.userData.props[1],
            onCreate
          );

          if (item.children?.length) {
            generateObj(item.children, component);
          }
        });
      };
      generateObj(parsedMainGroupChildren, mainGroup);
      updateSceneTree();
    }
  }
  abstract init(): void;
}
