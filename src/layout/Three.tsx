import Cube from "@components/cube";
import ValveControl from "@components/valveControl";
import { transformControls, tick, init } from "@env";
import { useEffect, useRef } from "react";
import { eventInit } from "../event";

function Three() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cube = new Cube();
    new ValveControl();
    init();
    tick();
    eventInit();
    transformControls.attach(cube);
  }, []);
  return <canvas data-canvas ref={ref} className={"full canvas"}></canvas>;
}

export default Three;
