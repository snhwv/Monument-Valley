import { componentTypes } from "@constants";
import { flatedComponents, mainGroup, transformControls } from "@env";
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
  return { key: object.id, name: object.name, title: object.id, children: [] };
};
const SceneTree = () => {
  const [gData, setGData] = useState([...mainGroup.children]);
  updateSceneTree = () => {
    const obj: any = {};
    obj[mainGroup.id] = getTreeDataItem(mainGroup);
    flatedComponents.forEach((object) => {
      obj[object.id] = getTreeDataItem(object);
    });
    flatedComponents.forEach((object) => {
      if (object.parent?.id) {
        obj[object.parent?.id].children.push(getTreeDataItem(object));
      }
    });

    setGData([...obj[mainGroup.id].children]);
  };
  const onDragEnter = (info: any) => {
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onDrop: TreeProps["onDrop"] = (info: any) => {
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

    console.log(info);
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
        item.children.unshift(dragObj);
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

  const onSelect: TreeProps["onSelect"] = (selectedKeys) => {
    if (selectedKeys?.[0]) {
      const currentComponent = mainGroup.getObjectById(
        selectedKeys?.[0] as number
      );
      currentComponent && transformControls.attach(currentComponent);
    }
  };

  return (
    <Tree
      className="draggable-tree"
      //   defaultExpandedKeys={expandedKeys}
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onSelect={onSelect}
      onDrop={onDrop}
      treeData={gData as any}
      fieldNames={fieldNames}
    />
  );
};
export default SceneTree;
