import Cube from "@components/cube";
import { scene, transformControls, tick, init } from "@env";
import React, { useEffect } from "react";
import { eventInit } from "../event";
import { updateSceneTree } from "./SceneTree";

function Three() {
  useEffect(() => {
    const cube = new Cube();
    new Cube();
    new Cube();
    new Cube();
    new Cube();
    init();
    tick();
    eventInit();
    transformControls.attach(cube);
    setTimeout(() => {
      updateSceneTree();
    }, 1000);
  }, []);
  return <canvas data-canvas className={"full canvas"}></canvas>;
}

export default Three;
