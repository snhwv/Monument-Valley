import { componentMap } from "@components";
import { mainGroup } from "@env";
import { updateSceneTree } from "../../layout/SceneTree";
import { Group, Matrix4 } from "three";

export default class Level {
  constructor() {}
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
}
