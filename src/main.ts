import "./style.css";

import {
  AmbientLight,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeInfiniteGrid from "../lib/three-infinite-grid";
import GUI from "lil-gui";

const scene = new Scene();

const camera = new PerspectiveCamera(
  40,
  document.body.offsetWidth / document.body.offsetHeight,
  0.01,
  4000,
);
camera.position.set(10, 10, 10);

scene.add(camera);

//#region Renderer setup
const renderer = new WebGLRenderer();
renderer.setClearColor(new Color("#ffffff"));

const handleResize = () => {
  renderer.setSize(document.body.offsetWidth, document.body.offsetHeight);
  renderer.setPixelRatio(devicePixelRatio);

  camera.aspect = document.body.offsetWidth / document.body.offsetHeight;
  camera.updateProjectionMatrix();
};

handleResize();
window.addEventListener("resize", handleResize);
document.body.append(renderer.domElement);
//#endregion

//#region Basic scene
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

const ambientLight = new AmbientLight(new Color("#ffffff"), 1.5);
const directionalLight = new DirectionalLight(new Color("#ffffff"), 1.5);

scene.add(ambientLight, directionalLight);

const grid = new ThreeInfiniteGrid({});
scene.add(grid);

const gui = new GUI();
gui.add(grid, "plane").name("Axis").options({ XZ: 0, XY: 1, ZY: 2 });

const sizeSettings = gui.addFolder("Size Settings");
sizeSettings.add(grid, "cellSize").name("Cell Size").min(0.1).max(48).step(0.1);
sizeSettings
  .add(grid, "majorGridFactor")
  .name("Major Grid Factor")
  .min(2)
  .max(10)
  .step(1);
sizeSettings
  .add(grid, "minorLineWidth")
  .name("Minor Line Width")
  .min(0.001)
  .max(0.1)
  .step(0.001);
sizeSettings
  .add(grid, "majorLineWidth")
  .name("Major Line Width")
  .min(0.001)
  .max(0.1)
  .step(0.001);
sizeSettings
  .add(grid, "axisLineWidth")
  .name("Axis Line Width")
  .min(0.001)
  .max(0.2)
  .step(0.001);

const colorSettings = gui.addFolder("Color Settings");
colorSettings.addColor(grid, "minorLineColor").name("Minor Line Color");
colorSettings.addColor(grid, "majorLineColor").name("Major Line Color");
colorSettings.addColor(grid, "xAxisColor").name("X Axis Color");
colorSettings.addColor(grid, "yAxisColor").name("Y Axis Color");
colorSettings.addColor(grid, "zAxisColor").name("Z Axis Color");
colorSettings.addColor(grid, "centerColor").name("Center Color");
colorSettings.add(grid, "opacity").name("Opacity").min(0).max(1).step(0.05);

//#endregion

const loop = () => {
  renderer.render(scene, camera);
  if (controls.enabled) {
    controls.update();
  }
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
