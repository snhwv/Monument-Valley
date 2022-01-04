import { unitWidth } from "@constants";
import { BoxGeometry, Matrix4, Mesh, MeshLambertMaterial } from "three";
import { CSG } from "three-csg-ts";
import Component from "./lib/recordable";

// 爬梯
class Ladder extends Component {
  constructor(...args: any) {
    super(...args);
  }
  generateElement() {
    this.generateLadder();
  }
  generateLadder() {
    const cubeGeometry = new BoxGeometry(unitWidth, unitWidth, unitWidth);
    const cubeMaterial = this.getDefaultMaterial();
    const cube = new Mesh(cubeGeometry, cubeMaterial);

    const gap = unitWidth / 8;

    const ladderHieght = (unitWidth - gap * 4) / 4;
    const ladderDepth = unitWidth / 6;

    const ladderItemGeometry = new BoxGeometry(
      unitWidth - ladderHieght * 3,
      ladderHieght,
      ladderDepth
    );
    const cubem = new Matrix4();
    cubem.makeTranslation(0, 0, (unitWidth - ladderDepth) / 2);
    ladderItemGeometry.applyMatrix4(cubem);

    let subRes: Mesh = cube;
    for (let i = 0; i < 4; i++) {
      const geo = ladderItemGeometry.clone();

      const cubem = new Matrix4();
      cubem.makeTranslation(
        0,
        (gap + ladderHieght) * i - unitWidth / 2 + ladderHieght / 2 + gap / 2,
        0
      );
      geo.applyMatrix4(cubem);

      const ladderItem = new Mesh(geo, cubeMaterial);

      subRes = CSG.subtract(subRes, ladderItem);
    }
    this.add(subRes);
  }
}
(Ladder as any).cnName = "爬梯";
export default Ladder;
