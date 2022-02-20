import { flatedComponents, mainGroup, orbitControls, Paths, transformControls } from "@env";
import { Button, Col, Row, TreeProps } from "antd";

import { Tree } from "antd";
import { useRef, useState } from "react";
import { store } from "../event/store";
import { Object3D } from "three";
import EditModal from "./components/EditModal";

export let updateSceneTree!: any;
export let saveScene!: any;
export let setTreeExpandedKeys!: any;

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
    title: object.constructor.cnName + object.id,
    children: [],
  };
};

const addTo = (parent: Object3D, child: Object3D) => {
  if (!parent.children.includes(child)) {
    child.parent?.remove?.(child);
    parent.attach(child);
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
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [selectKeys, setSelectKeys] = useState<any>([]);
  const [isDev, setIsDev] = useState<any>(false);
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

    setGData(data);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, { node }: any) => {
    setSelectKeys(selectedKeys);
    if (selectedKeys?.[0]) {
      const currentComponent = node.currentComponent as Object3D;
      currentComponent &&
        currentComponent.parent &&
        transformControls.attach(currentComponent);
    }
  };

  setTreeExpandedKeys = (keys: any[]) => {
    setSelectKeys(keys);
    setExpandedKeys(keys);
  };

  saveScene = () => {
    save();
  };
  const save = () => {
    // new Cube()
    const treeData = generateTree((object: any) => {
      return {
        type: object?.constructor?.name,
        userData: { props: object.userData.props },
        matrix: object.matrix,
        children: [],
      };
    });
    localStorage.setItem("mainGroupChildren", JSON.stringify(treeData));
  };
  const onCopy = (item: any) => {
    item.currentComponent.clone();
    updateSceneTree();
  };
  const onRemove = (item: any) => {
    if (transformControls.object === item.currentComponent) {
      transformControls.detach();
    }
    item.currentComponent.removeFromParent();
    updateSceneTree();
  };
  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };
  const showDev = () => {
    Paths.forEach((path) => {
      path.showMaterial(!isDev);
    });
    setIsDev(!isDev);
    store.isTransform = !isDev;
    transformControls.detach();
    orbitControls.enabled = !isDev;
    store.isDev = !isDev;
  };
  return (
    <>
      <Button onClick={save}>保存</Button>
      <Button onClick={showDev}>dev</Button>
      <Tree
        className="draggable-tree"
        //   defaultExpandedKeys={expandedKeys}
        draggable
        blockNode
        autoExpandParent
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        selectedKeys={selectKeys}
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
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    onCopy(item);
                  }}
                >
                  复制
                </Button>
                <EditModal item={item}></EditModal>
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(item);
                  }}
                >
                  删除
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
