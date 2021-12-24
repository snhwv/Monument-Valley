import { scene } from "@env";
import { AmbientLight, DirectionalLight, HemisphereLight } from "three";

export const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(300, 360, 240);
scene.add(directionalLight);

// export const ambientLight = new AmbientLight(0xffffff, 1); // soft white light
// scene.add(ambientLight);

// const light = new HemisphereLight(0xffffbb, 0x080820, 1);
// scene.add(light);
