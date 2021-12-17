import Altar from "@components/altar";
import Cube from "@components/cube";
import Door from "@components/door";
import Eave from "@components/eave";
import Ladder from "@components/ladder";
import Pier from "@components/pier";
import Pillar from "@components/pillar";
import Plane from "@components/plane";
import Roof from "@components/roof";
import ValveControl from "@components/valveControl";
import { transformControls, tick, init } from "@env";
import { useEffect, useRef } from "react";
import { eventInit } from "../event";

function Three() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // new Cube();
    // new Eave();
    // new Pillar();
    // new ValveControl();
    // new Pier();
    // new Plane();
    // new Ladder();
    new Door();
    // new Roof();
    // new Altar();

    // const valveControl = new Roof();
    init();
    tick();
    eventInit();
    // transformControls.attach(valveControl);
  }, []);
  return <canvas data-canvas ref={ref} className={"full canvas"}></canvas>;
}

export default Three;
