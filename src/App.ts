import "./App.css";
import { scene } from "./env";
import * as THREE from "three";

const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xb6ae71 });

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);
