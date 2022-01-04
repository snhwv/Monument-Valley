import { tick, init } from "@env";
import { useEffect, useRef } from "react";
import Level1 from "../levels/level1";
import { eventInit } from "../event";
import { generateStaticMap } from "../event/getPath";

function Three() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    init();
    tick();
    eventInit();
    generateStaticMap();

    const level1 = new Level1();
    level1.init();
  }, []);
  return <canvas data-canvas ref={ref} className={"full canvas"}></canvas>;
}

export default Three;
