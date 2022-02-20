import { tick, init, clear } from "@env";
import { useEffect, useRef } from "react";
import Level1 from "../levels/level1";
import { eventInit } from "../event";
import { generateStaticMap } from "../event/getPath";
import Level0 from "../levels/level0";
import Level2 from "../levels/level2";
import Level3 from "../levels/level3";
import Level4 from "../levels/level4";
import { Button } from "antd";
import Level from "src/levels/lib/level";

function Three() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    init();
    tick();
    eventInit();

    // const level0 = new Level0();
    // level0.init();
    // const level1 = new Level1();
    // level1.init();
    // const level2 = new Level2();
    // level2.init();
    // const level3 = new Level3();
    // level3.init();
    // const level4 = new Level4();
    // level4.init();
  }, []);

  const changeLevel = (levelIndex: number) => {
    clear();
    let level!: Level;
    switch (levelIndex) {
      case 0:
        level = new Level0();
        break;
      case 1:
        level = new Level1();
        break;
      case 2:
        level = new Level2();
        break;
      case 3:
        level = new Level3();
        break;
      case 4:
        level = new Level4();
        break;
    }
    level.init();
    generateStaticMap();
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ position: "absolute" }}>
        <Button onClick={() => changeLevel(0)}>第一关</Button>
        <Button onClick={() => changeLevel(1)}>第二关</Button>
        <Button onClick={() => changeLevel(2)}>第三关</Button>
        <Button onClick={() => changeLevel(3)}>第四关</Button>
        <Button onClick={() => changeLevel(4)}>第五关</Button>
      </div>
      <canvas data-canvas ref={ref} className={"full canvas"}></canvas>
    </div>
  );
}

export default Three;
