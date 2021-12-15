import "./App.css";
// import Cube from "@components/cube";
// import { scene, transformControls ,tick, init } from "@env";
import { useEffect } from "react";
import("./event");
// const cube = new Cube();

// transformControls.attach(cube);

function App() {
  useEffect(() => {
    import("@env").then((re) => {
      console.log(re);
      // init();
      // tick();
    });
  }, []);
  return (
    <>
      <canvas data-canvas className="canvas"></canvas>
    </>
  );
}

export default App;
