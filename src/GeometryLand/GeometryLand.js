import { Group, PlaneGeometry, AmbientLight, SpotLight, MeshLambertMaterial, Mesh, DoubleSide } from 'three';
import * as dat from 'dat.gui';
import { GLOBAL_SIGNALS } from './../globalSignals.js';

GLOBAL_SIGNALS.addGeometryLand.add(function (add) {
    console.log(`GLOBAL_SIGNALS.addGeometryLand:${add}`);
});

const gui = new dat.GUI();
const geometryLandControl = new function () {
    this.rotationX = -0.5 * Math.PI;
    this.rotationY = -0.5 * Math.PI;
    this.rotationZ = -0.5 * Math.PI;
    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = 0;
};

export default class GeometryLand extends Group {
    constructor(scene) {
        super();
        this.scene = scene;

        // var ambientLight = new AmbientLight(0x0c0c0c);
        // this.add(ambientLight);

        // // add spotlight for the shadows
        // var spotLight = new SpotLight(0xff0000);
        // spotLight.position.set(-40, 60, -10);
        // spotLight.castShadow = true;
        // this.add(spotLight);

        const planeGeometry = new PlaneGeometry(10, 10, 1, 1);
        const planeMaterial = new MeshLambertMaterial({ color: 0xffffff, side: DoubleSide });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 0;
        plane.position.y = 2;
        plane.position.z = 0;

        gui.add(geometryLandControl, 'positionX', -100, 100).onChange(function (value) {
            plane.position.x = value;
        });
        gui.add(geometryLandControl, 'positionY', -100, 100).onChange(function (value) {
            plane.position.y = value;
        });
        gui.add(geometryLandControl, 'positionZ', -100, 100).onChange(function (value) {
            plane.position.z = value;
        });
        gui.add(geometryLandControl, 'rotationX', -1, 1).onChange(function (value) {
            plane.rotation.x = value * Math.PI;
        });
        gui.add(geometryLandControl, 'rotationY', -1, 1).onChange(function (value) {
            plane.rotation.y = value * Math.PI;
        });
        gui.add(geometryLandControl, 'rotationZ', -1, 1).onChange(function (value) {
            plane.rotation.z = value * Math.PI;
        });
        gui.hide();
        this.add(plane);
    }

    show() {
        gui.show();
        this.scene.add(this);
    }

    hide() {
        gui.hide();
        this.scene.remove(this);
    }

    update(timeStamp) {
        this.geometryLandControl
        this.rotation.y = timeStamp / 10000;
    }
}