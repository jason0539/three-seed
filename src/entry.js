/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3, AxisHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SeedScene from './objects/Scene.js';
import GeometryLand from './GeometryLand/GeometryLand.js';
import * as dat from 'dat.gui';
import { GLOBAL_CONTROLS } from './globalControls.js';
import { GLOBAL_SIGNALS } from './globalSignals.js';

const gui = new dat.GUI();
const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const seedScene = new SeedScene();
const orbitControls = new OrbitControls(camera);
const axisHelper = new AxisHelper(20);

const geometryLand = new GeometryLand(scene, GLOBAL_CONTROLS.showGeometryLand);

// scene control
gui.add(GLOBAL_CONTROLS, 'showAxisHelper').onChange(function (value) {
  value ? scene.add(axisHelper) : scene.remove(axisHelper);
});
gui.add(GLOBAL_CONTROLS, 'showGeometryLand').onChange(function (value) {
  GLOBAL_SIGNALS.addGeometryLand.dispatch(value);
  value ? geometryLand.show() : geometryLand.hide();
});

// scene
scene.add(seedScene);

//axis
GLOBAL_CONTROLS.showAxisHelper && scene.add(axisHelper);
GLOBAL_CONTROLS.showGeometryLand && scene.add(geometryLand);

// camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x7ec0ee, 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  orbitControls.update();
  renderer.render(scene, camera);
  seedScene.update && seedScene.update(timeStamp);
  geometryLand && geometryLand.update && geometryLand.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);

