import "./App.css";
import Cube from "@components/cube";
import { scene, transformControls, tick, init } from "@env";
import React, { useEffect } from "react";
import("./event");
const cube = new Cube();

function App() {
  useEffect(() => {
    init();
    tick();
    transformControls.attach(cube);
  }, []);
  return (
    <div>
      <canvas data-canvas className="canvas"></canvas>
    </div>
  );
}

export default App;
