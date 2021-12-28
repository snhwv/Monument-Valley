import { tick, init } from "@env";
import { useEffect, useRef } from "react";
import { eventInit, generateStaticMap } from "../event";

function Three() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    init();
    tick();
    eventInit();
    generateStaticMap();
  }, []);
  return <canvas data-canvas ref={ref} className={"full canvas"}></canvas>;
}

export default Three;
