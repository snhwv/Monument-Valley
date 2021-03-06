import {
  composeObject,
  getQuaternionFromAxisAndAngle,
  putTop,
  putBottom,
  composeObjectWidthMultiply,
  walkPlaneCreator,
  getBox,
  listenPlanes,
  IUserData
} from "@/utils";
import {
  BoxGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Mesh,
  Vector2,
  Quaternion,
  Vector3,
  Object3D,
  Group,
  BoxBufferGeometry,
  ArrowHelper,
  Matrix4,
  PlaneGeometry,
  Box3,
  DoubleSide,
  TextureLoader,
  ImageUtils,
  Geometry
} from "three";
import * as THREE from "three";
import { scene, camera, renderer } from "../base";
import { squarePositionGenerator } from "@/utils";
import Valve from "@/components/valve";
import Stairway from "@/components/stairway";
import { axis, unitLength, mainMaterial } from "@/constents";
import {
  QuarterCirclePathOuter,
  CirclePathInner
} from "@/components/circlePath";
import Door from "@/components/door";
import { intersect, subtract } from "@/utils/bsp";
import ThreeBSP from "three-solid";
import Roof from "@/components/roof";
import HollowHolder from "@/components/hollowHolder";
import EnterPoint from "@/components/enterPoint";
import OuterPoint from "./OuterPoint";
import CenterRotate from "./CenterRotate";
import PartTriangle from "./PartTriangle";
import Rotable from "@/utils/Rotable";
import TWEEN from "@tweenjs/tween.js";
import { createMGraph, MGraph, Floyd, PrintAll } from "@/utils/floyd";
import { SpinControl } from "@/utils/SpinControl";
import Ada from "@/utils/ada";

export default class LevelOne {
  centerCube!: Mesh;
  centerCubeWidth: number = 5 * unitLength;
  centerCubeHeight: number = 6 * unitLength;
  rotableStair!: Stairway;
  topHollowHolder!: HollowHolder;
  valve!: Valve;
  centerRotable!: Rotable;
  stairRotable!: Rotable;
  partTriangle!: PartTriangle;
  spinControl!: SpinControl;
  ada!: Ada;
  constructor() {
    this.init();
  }
  init() {
    const bottomCubs = this.generateBottomLoopCube();
    const centerCube = this.generateCenterCube();
    const planePath = this.generatePlanePath();
    const rotableStair = this.generateRotableStair();
    const valve = this.generateValve();

    const staticStair = this.generateStaticStair();

    // ????????????????????????
    const enterPointOne = this.generateEnterPointOne();
    // ????????????
    const outPoint = this.generateOutPoint();
    // ????????????????????????
    const centerRotate = this.generateCenterRotate();
    // ????????????????????????????????????????????????????????????????????????
    const partTriangle = this.generatePartTriangle();
    // ????????????

    scene.add(bottomCubs);
    scene.add(centerCube);
    scene.add(planePath);
    scene.add(staticStair);
    scene.add(enterPointOne);
    scene.add(outPoint);
    scene.add(partTriangle);

    // this.partTriangle.generateCover();

    const rotableGroup = new Group();

    rotableGroup.add(valve);
    rotableGroup.add(rotableStair);
    const stairRotable = new Rotable(rotableGroup, valve, new Vector3(0, 0, 1));
    // stairRotable.element.rotateOnAxis(axis.z, Math.PI);

    console.log(stairRotable);
    const boxdata = getBox(centerRotate.element);

    // ??????????????????????????????box???????????????????????????????????????????????????vector3??????????????????
    const centerRotateCenter = boxdata.min.add(boxdata.max).multiplyScalar(0.5);

    const centerRotable = new Rotable(
      centerRotate.element,
      centerRotate.rotateElement,
      new Vector3(0, 1, 0),
      new Vector3(centerRotateCenter.x, 0, centerRotateCenter.z)
    );
    centerRotable.element.rotateOnAxis(axis.y, -Math.PI / 2);
    scene.add(stairRotable.element);
    scene.add(centerRotable.element);
    this.centerRotable = centerRotable;
    this.stairRotable = stairRotable;

    this.changeNodesDataStruct();
    this.bindPathPointCallback();

    const spinControl = new SpinControl();
    spinControl.add(centerRotable);
    spinControl.add(stairRotable);
    spinControl.listen();
    this.spinControl = spinControl;
    const groupedPlanesObject = window.groupedPlanesObject;
    // find(groupedPlanesObject.bottomPath[0],groupedPlanesObject.bottomPath[3]);
    this.centerRotationBindCall();
    this.stairRotableBindCall();
    listenPlanes();

    this.generateAda();
    // this.test();
  }

  generateAda() {
    const groupedPlanesObject = window.groupedPlanesObject;
    const initPlaneData = groupedPlanesObject.staticStairWay[4];
    const initPosition = new Vector3();
    const plane = initPlaneData.plane as Mesh;

    const quat = new Quaternion();
    const scale = new Vector3();

    const ada = new Ada();
    scene.add(ada.element);
    this.ada = ada;
    initPlaneData.hasAda = true;

    const hasAdaData: IUserData = window.nodes.find(node => node.hasAda);
    if (hasAdaData) {
      ada.hasAdaPlane = hasAdaData.plane;
    }

    // ada.addTo(plane)
    plane.localToWorld(ada.element.position);
    plane.localToWorld(ada.position);
    scene.add(ada.element);
  }
  stairRotableBindCall() {
    const stairRotable = this.stairRotable;
    const groupedPlanesObject = window.groupedPlanesObject;
    const originGroupedPlanesObject = window.originGroupedPlanesObject;

    stairRotable.animationStartCallbacks.push(() => {
      const resets = [
        {
          groupName: "rotateStairWay",
          index: 0
        },
        {
          groupName: "rotateStairWay",
          index: 2
        },
        {
          groupName: "bottomPath",
          index: 3
        },
        {
          groupName: "staticStairWay",
          index: 0
        }
      ];
      this.resetConnection(resets);
    });

    stairRotable.animationEndCallbacks.push(() => {
      const relativeNormal = stairRotable.element
        .localToWorld(axis.x.clone())
        .sub(stairRotable.element.position)
        .round();

      const calls = [
        {
          condition: { x: 1, y: 0 },
          call: () => {
            const connects = [
              [
                {
                  groupName: "bottomPath",
                  index: 3
                },
                {
                  groupName: "rotateStairWay",
                  index: 2
                }
              ],
              [
                {
                  groupName: "rotateStairWay",
                  index: 0
                },
                {
                  groupName: "staticStairWay",
                  index: 0
                }
              ]
            ];
            this.generateAnimationConnect(connects);
          }
        }
      ];

      this.callbackByCondition(calls, relativeNormal);
    });
  }

  centerRotationBindCall() {
    const centerRotable = this.centerRotable;
    const groupedPlanesObject = window.groupedPlanesObject;
    const originGroupedPlanesObject = window.originGroupedPlanesObject;

    centerRotable.animationStartCallbacks.push(() => {
      const resets = [
        {
          groupName: "staticStairWay",
          index: 4
        },
        {
          groupName: "centerRotateBottomPath",
          index: 2
        },
        {
          groupName: "rotateTrigger",
          index: 0
        },
        {
          groupName: "partTriangleOne",
          index: 3
        },
        {
          groupName: "partTriangleTWo",
          index: 2
        },
        {
          groupName: "centerRotateTopPath",
          index: 3
        },
        {
          groupName: "enterPointOne",
          index: 0
        }
      ];

      this.resetConnection(resets);
    });

    centerRotable.animationEndCallbacks.push(() => {
      const relativeNormal = centerRotable.element
        .localToWorld(axis.x.clone())
        .sub(centerRotable.element.position)
        .round();

      const calls = [
        {
          condition: { x: -1, z: 0 },
          call: () => {
            const connects = [
              [
                {
                  groupName: "staticStairWay",
                  index: 4
                },
                {
                  groupName: "centerRotateBottomPath",
                  index: 2
                }
              ]
            ];
            this.generateAnimationConnect(connects);
          }
        },
        {
          condition: { x: 0, z: 1 },
          call: () => {
            const connects = [
              [
                {
                  groupName: "centerRotateTopPath",
                  index: 3
                },
                {
                  groupName: "enterPointOne",
                  index: 0
                }
              ]
            ];
            this.generateAnimationConnect(connects);
          }
        },
        {
          condition: { x: 1, z: 0 },
          call: () => {
            const connects = [
              [
                {
                  groupName: "centerRotateBottomPath",
                  index: 2
                },
                {
                  groupName: "rotateTrigger",
                  index: 0
                }
              ]
            ];
            this.generateAnimationConnect(connects);
          }
        },
        {
          condition: { x: 0, z: -1 },
          call: () => {
            const connects = [
              [
                {
                  groupName: "centerRotateBottomPath",
                  index: 2
                },
                {
                  groupName: "partTriangleOne",
                  index: 3
                }
              ],
              [
                {
                  groupName: "centerRotateTopPath",
                  index: 3
                },
                {
                  groupName: "partTriangleTWo",
                  index: 2
                }
              ]
            ];
            // ??????????????????????????????
            this.generateAnimationConnect(connects);
          }
        }
      ];

      this.callbackByCondition(calls, relativeNormal);
    });
  }
  bindPathPointCallback() {
    const groupedPlanesObject = window.groupedPlanesObject;
    console.log(groupedPlanesObject);

    (groupedPlanesObject.partTriangleOne[2] as IUserData).callback = (
      tween,
      ada
    ) => {
      const ada1 = ada as Ada;

      const adaEl = ada1.element.getObjectByName("adaEl");

      const partTriangleOne2 = groupedPlanesObject
        .partTriangleOne[2] as IUserData;
      if (adaEl) {
        if (partTriangleOne2.called) {
          return;
        }
        // const coverPosition = camera.position.clone().multiplyScalar(0.1);
        // const adaElMesh = adaEl as Mesh;
        // const group = new Group();
        // this.partTriangle.planes.map(plane => {
        //   const p = new Vector3();
        //   const q = new Quaternion();
        //   // debugger;  
        //   plane.getWorldQuaternion(q);
        //   q.conjugate();
        //   coverPosition.applyQuaternion(q);
        //   const cp = coverPosition.clone();
        //   console.log(cp)

        //   plane.position.add(cp)

        //   // plane.getWorldPosition(p);
        //   // group.attach(plane);
        //   // plane.position.copy(p);
        //   // group.position.add(coverPosition)
        //   // console.log(plane);
        // });
        // scene.add(group);
        // adaElMesh.renderOrder = 2;
        // adaElMesh.onBeforeRender = function(renderer) {
        //   renderer.clearDepth();
        // };

        // adaElMesh.updateWorldMatrix(true, false);

        // console.log(adaElMesh);
        // const groupTwoWorldP = new Vector3();

        // adaElMesh.getWorldPosition(groupTwoWorldP);

        // const p = coverPosition.add(groupTwoWorldP);
        // adaElMesh.worldToLocal(p);
        // adaElMesh.translate(p.x, p.y, p.z);
        partTriangleOne2.called = true;
      }
    };

    (groupedPlanesObject.rotateTrigger[0] as IUserData).callback = (
      tween,
      ada
    ) => {
      const tirgger = groupedPlanesObject.rotateTrigger[0];
      if (tirgger.called) {
        return;
      }
      this.partTriangle.rotate(() => {
        groupedPlanesObject.partTriangleOne[0].connectPlane.push(
          groupedPlanesObject.partTriangleTWo[0]
        );
        groupedPlanesObject.partTriangleTWo[0].connectPlane.push(
          groupedPlanesObject.partTriangleOne[0]
        );
      });
      tirgger.called = true;
      if (ada) {
        ada.isMoving = false;
        ada.path = [];
      }
    };

    (groupedPlanesObject.rotateStairWay[0] as IUserData).callback = () => {
      console.log("call rotateStairWay");
      const stairRotable = this.stairRotable;
      const rotables = this.spinControl.rotables;
      if (rotables.indexOf(stairRotable) !== -1) {
        rotables.splice(rotables.indexOf(stairRotable), 1);
      }
      this.valve.hide();
    };

    (groupedPlanesObject.rotateStairWay[2] as IUserData).callback = () => {
      console.log("call rotateStairWay");
      const stairRotable = this.stairRotable;
      const rotables = this.spinControl.rotables;
      if (rotables.indexOf(stairRotable) !== -1) {
        rotables.splice(rotables.indexOf(stairRotable), 1);
      }
      this.valve.hide();
    };

    (groupedPlanesObject.staticStairWay[0] as IUserData).callback = () => {
      console.log("call staticStairWay");
      const stairRotable = this.stairRotable;
      this.spinControl.add(stairRotable);
      this.valve.show();
    };

    (groupedPlanesObject.bottomPath[3] as IUserData).callback = () => {
      console.log("call bottomPath");
      const stairRotable = this.stairRotable;
      this.spinControl.add(stairRotable);
      this.valve.show();
    };
  }
  changeNodesDataStruct() {
    const nodes = window.nodes;
    const obj: {
      [key: string]: any[];
    } = {};
    nodes.map(item => {
      if (obj[item.belongGroup]) {
        obj[item.belongGroup][item.index] = item;
      } else {
        obj[item.belongGroup] = [];
        obj[item.belongGroup][item.index] = item;
      }
    });
    const keys = Object.keys(obj);
    keys.map(item => {
      this.generateConnection(obj[item]);
    });
    window.groupedPlanesObject = obj;
    const origin: {
      [key: string]: any[];
    } = {};
    keys.map(item => {
      origin[item] = obj[item].map(plane => ({
        ...plane,
        connectPlane: [...plane.connectPlane]
      }));
    });

    window.originGroupedPlanesObject = origin;
  }

  generateConnection(userDataArr: any[]) {
    const localArr = [...userDataArr];
    for (let i = 0; i < localArr.length; i++) {
      if (i) {
        localArr[i].connectPlane.push(localArr[i - 1]);
      }
    }
    localArr.reverse();
    for (let i = 0; i < localArr.length; i++) {
      if (i) {
        localArr[i].connectPlane.push(localArr[i - 1]);
      }
    }
  }

  generateAnimationConnect(
    connects: {
      groupName: string;
      index: number;
    }[][]
  ) {
    const groupedPlanesObject = window.groupedPlanesObject;
    connects
      .map(connect => {
        return connect.map(item => {
          return groupedPlanesObject[item.groupName][item.index];
        });
      })
      .map(connect => {
        this.generateConnection(connect);
      });
  }

  callbackByCondition(
    calls: {
      condition: { x?: number; y?: number; z?: number };
      call: () => void;
    }[],
    relativeNormal: any
  ) {
    calls
      .filter(item => {
        const condition = item.condition;
        const keys = Object.keys(condition);

        return keys.every((item: string) => {
          return (
            (condition as { [key: string]: number })[item] ===
            (relativeNormal as { [key: string]: number })[item]
          );
        });
      })
      .map(item => {
        item.call();
      });
  }

  resetConnection(
    resets: {
      groupName: string;
      index: number;
    }[]
  ) {
    let material = new MeshLambertMaterial({
      color: 0x03a9f4,
      side: DoubleSide
    });
    const groupedPlanesObject = window.groupedPlanesObject;
    const originGroupedPlanesObject = window.originGroupedPlanesObject;
    resets.map(item => {
      const plane = groupedPlanesObject[item.groupName][item.index];
      plane.connectPlane = [
        ...originGroupedPlanesObject[item.groupName][item.index].connectPlane
      ];
      // plane.plane.material = material;
    });
  }

  test() {}

  generateCenterCube() {
    let centerCubeGeo = new BoxGeometry(
      this.centerCubeWidth,
      this.centerCubeHeight,
      this.centerCubeWidth
    );
    let centerCube = new Mesh(centerCubeGeo, mainMaterial);
    centerCube.position.sub(
      new Vector3(
        0,
        -(this.centerCubeHeight / 2 + unitLength / 2 + unitLength / 2),
        0
      )
    );
    this.centerCube = new Mesh(centerCubeGeo, mainMaterial);
    return centerCube;
  }

  generateBottomLoopCube() {
    let geometry = new BoxGeometry(unitLength, unitLength, unitLength);

    // let material = new MeshLambertMaterial({ color: 0xffff00 });
    const loop = new Group();
    const positions = squarePositionGenerator(new Vector2(), 5, unitLength);

    // var loader = new TextureLoader();
    // var clothTexture = loader.load("/assets/sprite0.png");
    // clothTexture.anisotropy = 16;

    // var clothMaterial = new MeshLambertMaterial({
    //   map: clothTexture,
    //   side: DoubleSide,
    //   alphaTest: 0.5
    // });

    // const material = clothMaterial;
    // material.map = clothTexture;
    // material.alphaTest = 0.5;
    // const loader = new TextureLoader();
    // // const texture = ImageUtils.loadTexture();
    // // material.map = texture;
    // loader.load('/images/sprite0.png',(texture) => {
    //   material.map = texture;
    //   material.needsUpdate = true;
    //   console.log(texture)
    // });
    for (let i = 0; i < positions.length; i++) {
      let cube = new Mesh(geometry, mainMaterial);

      cube.position.set(positions[i].x, 0, positions[i].y);
      loop.add(cube);
    }
    loop.translateY(unitLength / 2);
    return loop;
  }

  generatePlanePath() {
    let geometry = new BoxGeometry(unitLength, 2, unitLength);
    const loop = new Group();
    const positions = squarePositionGenerator(new Vector2(), 7, unitLength);

    let index = 0;
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      if (position.x > 0 && position.y > unitLength) {
        let cube = new Mesh(geometry, mainMaterial);
        const plane = walkPlaneCreator(unitLength, unitLength);
        plane.rotateOnAxis(axis.x, Math.PI / 2);
        plane.translateZ(-(2 / 2 + 0.01));
        plane.userData.belongGroup = "bottomPath";
        plane.userData.type = "normal";
        plane.userData.index = index;
        index++;
        cube.add(plane);

        cube.position.set(position.x, 0, position.y);
        loop.add(cube);
      }
    }

    loop.translateY(2 / 2 + 3 * unitLength);
    return loop;
  }

  generateRotableStair() {
    const stairSize = 3;
    const stairway = new Stairway(stairSize, false);
    stairway.walkPlanes.map((item, index) => {
      item.userData.belongGroup = "rotateStairWay";
      item.userData.type = "stair";
      item.userData.index = index;
    });
    const stairwayGroup = stairway.element;
    const halfStair = (stairSize * unitLength) / 2;
    stairwayGroup.position.sub(
      new Vector3(
        -unitLength / 2 + halfStair,
        -3 * unitLength - halfStair,
        -this.centerCubeWidth / 2 - stairway.depth / 2
      )
    );
    this.rotableStair = stairway;
    return stairwayGroup;
  }

  generateValve() {
    const valve = new Valve();
    const valveGroup = valve.element;
    valveGroup.position.add(this.rotableStair.element.position);
    valveGroup.translateZ(this.rotableStair.depth / 2 + valve.plugWidth / 2);
    valveGroup.rotateOnAxis(axis.x, Math.PI / 2);
    this.valve = valve;
    return valveGroup;
  }

  generateStaticStair() {
    const group = new Group();
    const relativePosition = new Vector3(
      -(this.centerCubeWidth / 2 + unitLength + unitLength / 2),
      this.centerCubeHeight + unitLength - unitLength / 2,
      this.centerCubeWidth / 2 + unitLength / 2
    );
    var geometry = new BoxBufferGeometry(unitLength, unitLength, unitLength);
    var cube = new Mesh(geometry, mainMaterial);
    for (let i = 0; i < 3; i++) {
      const cloneCube = cube.clone();
      cloneCube.position.add(relativePosition);
      cloneCube.translateZ(-unitLength * i);
      if (!i) {
        const plane = walkPlaneCreator(unitLength, unitLength);
        plane.userData.belongGroup = "staticStairWay";
        plane.userData.type = "normal";
        plane.userData.index = 1;
        composeObject(
          plane,
          new Vector3(0, unitLength / 2 + 0.005, 0),
          getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
        );
        cloneCube.add(plane);
      }
      group.add(cloneCube);
    }

    const smallStairway = new Stairway(1, false);
    smallStairway.walkPlanes.map((item, index) => {
      item.userData.belongGroup = "staticStairWay";
      item.userData.type = "stair";
      item.userData.index = index;
    });
    const smallStairwayGroup = smallStairway.element;
    smallStairwayGroup.position.add(relativePosition);
    smallStairwayGroup.translateX(unitLength);
    group.add(smallStairwayGroup);

    const largeStairway = new Stairway(2, false);
    largeStairway.walkPlanes.reverse().map((item, index) => {
      item.userData.belongGroup = "staticStairWay";
      item.userData.type = "stair";
      item.userData.index = index + 2;
    });
    const largeStairwayGroup = largeStairway.element;
    largeStairwayGroup.position.add(relativePosition);
    largeStairwayGroup.position.add(
      new Vector3(0, (unitLength * 3) / 2, (-unitLength * 3) / 2)
    );
    largeStairwayGroup.rotateY(-Math.PI / 2);
    group.add(largeStairwayGroup);

    const topHollowHolder = new HollowHolder(4 * unitLength);
    const topHollowHolderGroup = topHollowHolder.element;
    topHollowHolderGroup.position.add(relativePosition);
    topHollowHolderGroup.position.add(
      new Vector3(
        0,
        unitLength * 2 + unitLength / 2 + topHollowHolder.height / 2,
        -unitLength * 3
      )
    );
    this.topHollowHolder = topHollowHolder;
    group.add(topHollowHolder.element);

    const bottomhollowHolder = new HollowHolder(
      6 * unitLength + unitLength / 2,
      5 * unitLength
    );

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = "staticStairWay";
    plane.userData.type = "normal";
    plane.userData.index = 4;
    composeObject(
      plane,
      new Vector3(0, (6 * unitLength + unitLength / 2) / 2 + 0.005, 0),
      getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
    );
    bottomhollowHolder.element.add(plane);

    const bottomhollowHolderGroup = bottomhollowHolder.element;

    putBottom(bottomhollowHolderGroup, topHollowHolderGroup);
    // bottomhollowHolderGroup.position.add(topHollowHolderGroup.position);
    // bottomhollowHolderGroup.translateY(
    //   -(topHollowHolder.height / 2 + bottomhollowHolder.height / 2)
    // );
    group.add(bottomhollowHolder.element);

    return group;
  }

  generateEnterPointOne() {
    const group = new Group();

    // ???????????????????????????
    const topHollowHolderGroup = this.topHollowHolder.element;

    const geometry = new BoxBufferGeometry(unitLength, unitLength, unitLength);
    const bottomCube = new Mesh(geometry, mainMaterial);
    putTop(bottomCube, topHollowHolderGroup);
    const midCube = bottomCube.clone();
    midCube.position.set(0, 0, 0);
    putTop(midCube, bottomCube);
    const topCube = bottomCube.clone();
    topCube.position.set(0, 0, 0);

    const plane = walkPlaneCreator(unitLength, unitLength);
    plane.userData.belongGroup = "enterPointOne";
    plane.userData.type = "normal";
    plane.userData.index = 0;
    composeObject(
      plane,
      new Vector3(0, unitLength / 2 + 0.005, 0),
      getQuaternionFromAxisAndAngle(axis.x, Math.PI / 2)
    );
    topCube.add(plane);
    putTop(topCube, midCube);

    const enterPoint = new EnterPoint();
    const enterPointGroup = enterPoint.element;
    putTop(enterPointGroup, topCube);

    const roof = new Roof();
    putTop(roof.element, enterPointGroup);

    group.add(bottomCube);
    group.add(midCube);
    group.add(topCube);
    group.add(enterPointGroup);
    group.add(roof.element);
    return group;
  }

  generateOutPoint() {
    const outerPoint = new OuterPoint();
    const outerPointGroup = outerPoint.element;
    outerPointGroup.position.add(
      new Vector3(
        this.centerCubeWidth / 2 + unitLength,
        (3 * unitLength) / 2,
        0
      )
    );
    return outerPoint.element;
  }
  generateCenterRotate() {
    const centerRotate = new CenterRotate();
    const centerRotateGroup = centerRotate.element;
    putTop(centerRotateGroup, this.centerCube);

    return centerRotate;
  }
  generatePartTriangle() {
    const partTriangle = new PartTriangle();
    const partTriangleGroup = partTriangle.element;
    // putTop(partTriangleGroup, this.centerCube);

    this.partTriangle = partTriangle;
    return partTriangleGroup;
  }
}
