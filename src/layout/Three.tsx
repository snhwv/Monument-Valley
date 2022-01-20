import { tick, init } from "@env";
import { useEffect, useRef } from "react";
import Level1 from "../levels/level1";
import { eventInit } from "../event";
import { generateStaticMap } from "../event/getPath";
import Level0 from "../levels/level0";
import Level2 from "../levels/level2";
import Level3 from "../levels/level3";
import Level4 from "../levels/level4";

function Three() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    init();
    tick();
    eventInit();

    // const level0 = new Level0();
    // level0.init();
    const level1 = new Level1();
    level1.init();
    // const level2 = new Level2();
    // level2.init();
    // const level3 = new Level3();
    // level3.init();
    // const level4 = new Level4();
    // level4.init();
    generateStaticMap();
  }, []);
  return <canvas data-canvas ref={ref} className={"full canvas"}></canvas>;
}

export default Three;
