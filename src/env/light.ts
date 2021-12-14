import { scene } from "@env";
import { AmbientLight, DirectionalLight } from "three";

export const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(300, 360, 240);
scene.add(directionalLight);
directionalLight.intensity = 1;

export const ambientLight = new AmbientLight(0xffffff, 0.4); // soft white light
scene.add(ambientLight);
