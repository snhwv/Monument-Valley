import "./App.css";
import { scene, transformControls } from "./env";
import Cube from "@components/cube";
import("./event");
const cube = new Cube();

transformControls.attach(cube);
