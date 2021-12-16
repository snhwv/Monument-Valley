import { mainGroup } from "@env";
import { Col, Row, TreeProps } from "antd";

import { Tree } from "antd";
import { useState } from "react";
import { Object3D } from "three";

// const initData = [
//   {
//     uuid: "1",
//     children: [
//       {
//         title: "2",
//         uuid: "2",
//       },
//       {
//         title: "3",
//         uuid: "3",
//       },
//     ],
//   },
// ];

export let updateSceneTree!: any;

const fieldNames = {
  key: "key",
  title: "title",
  children: "children",
};
const getTreeDataItem = (object: Object3D) => {
  return { id: object.id, name: object.name, title: object.id, children: [] };
};
const SceneTree = () => {
  const [gData, setGData] = useState([...mainGroup.children]);
  console.log(mainGroup);
  updateSceneTree = () => {
    console.log(mainGroup);

    const obj: any = {};
    obj[mainGroup.id] = getTreeDataItem(mainGroup);
    mainGroup.traverse((object) => {
      if (["cube", "valveControl"].includes(object?.userData?.type)) {
        obj[object.id] = getTreeDataItem(object);
      }
    });
    mainGroup.traverse((object) => {
      if (["cube", "valveControl"].includes(object?.userData?.type)) {
        if (object.parent?.id) {
          obj[object.parent?.id].children.push(getTreeDataItem(object));
        }
      }
    });
    console.log(obj);

    setGData([...obj[mainGroup.id].children]);
  };
  const onDragEnter = (info: any) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onDrop: TreeProps["onDrop"] = (info: any) => {
    console.log(info);
    const dropKey = info.node[fieldNames.key];
    const dragKey = info.dragNode[fieldNames.key];
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: any, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i][fieldNames.key] === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.children || []).length > 0 && // Has children
      info.node.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any;
      let i: any;
      loop(data, dropKey, (item: any, index: any, arr: any) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setGData(data);
  };
  return (
    <Tree
      className="draggable-tree"
      //   defaultExpandedKeys={expandedKeys}
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      treeData={gData as any}
      fieldNames={fieldNames}
    />
  );
};
export default SceneTree;
