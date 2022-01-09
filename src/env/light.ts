import { scene } from "@env";
import { AmbientLight, DirectionalLight, HemisphereLight } from "three";

// 0xcdcb81
export const directionalLight = new DirectionalLight(0xffffff, 1);
export const directionalLight1 = new DirectionalLight(0xffffff, 1);
export const directionalLight2 = new DirectionalLight(0xffffff, 0.5);
// export const directionalLight = new DirectionalLight(0xfcf19a, 1);
directionalLight.position.set(78.63, 119.62, 38.87);
directionalLight1.position.set(0, -100, 0);
directionalLight2.position.set(100, 0, -500);
scene.add(directionalLight);
// scene.add(directionalLight1);
// scene.add(directionalLight2);

export const ambientLight = new AmbientLight(0xbdc578, 0.2); // soft white light
// scene.add(ambientLight);

const hemisphereLight = new HemisphereLight( 0x000000, 0xffffff, 0.51 );
// scene.add( hemisphereLight );

// const light = new HemisphereLight(0xffffbb, 0x080820, 1);
// scene.add(light);
