import { flatedComponents, mainGroup, transformControls } from "@env";
import { Button, Col, Row, TreeProps } from "antd";

import { Tree } from "antd";
import { useState } from "react";
import { Object3D } from "three";

export let updateSceneTree!: any;

const fieldNames = {
  key: "key",
  title: "title",
  children: "children",
};
const getTreeDataItem = (object: any): any => {
  return {
    key: object.id,
    name: object.name,
    currentComponent: object,
    title: object.id,
    children: [],
  };
};

const addTo = (parent: Object3D, child: Object3D) => {
  if (!parent.children.includes(child)) {
    child.parent?.remove?.(child);
    parent.add(child);
  }
};

const generateTree = (getItemData = getTreeDataItem): any[] => {
  const obj: any = {};
  obj[mainGroup.id] = getItemData(mainGroup);
  flatedComponents.forEach((object) => {
    obj[object.id] = getItemData(object);
  });
  flatedComponents.forEach((object) => {
    if (object.parent?.id) {
      obj[object.parent?.id].children.push(obj[object.id]);
    }
  });
  return [...obj[mainGroup.id].children];
};

const SceneTree = () => {
  const [gData, setGData] = useState([...mainGroup.children]);
  updateSceneTree = () => {
    const treeData = generateTree(getTreeDataItem);
    setGData(treeData);
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

        addTo(item.currentComponent, dragObj.currentComponent);
      });
    } else if (
      (info.node.children || []).length > 0 && // Has children
      info.node.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);

        addTo(item.currentComponent, dragObj.currentComponent);
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

      addTo(ar[i].currentComponent.parent, dragObj.currentComponent);
    }

    console.log(mainGroup.children);

    setGData(data);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, { node }: any) => {
    console.log(node);
    if (selectedKeys?.[0]) {
      const currentComponent = node.currentComponent as Object3D;
      currentComponent && transformControls.attach(currentComponent);
    }
  };

  const save = () => {
    // new Cube()
    const treeData = generateTree((object: any) => {
      return {
        type: object?.constructor?.name,
        args: object.args,
        matrix: object.matrix,
        children: [],
      };
    });
    console.log(treeData);
    localStorage.setItem("mainGroupChildren", JSON.stringify(treeData));
  };
  const onCopy = (item: any) => {
    const copyComponent = new item.currentComponent.constructor(
      ...item.currentComponent.args
    );
    copyComponent.parent.remove(copyComponent);
    item.currentComponent.parent?.add(copyComponent);
    updateSceneTree();
  };
  return (
    <>
      <Button onClick={save}>保存</Button>
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
        titleRender={(item) => {
          return (
            <Row>
              <Col flex="1">{item?.title}</Col>
              <Col flex="none">
                <Button type="link" size="small" onClick={() => onCopy(item)}>
                  复制
                </Button>
                <Button type="link" size="small">
                  修改
                </Button>
              </Col>
            </Row>
          );
        }}
      />
    </>
  );
};
export default SceneTree;