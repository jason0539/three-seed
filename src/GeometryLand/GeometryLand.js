import { Group, PlaneGeometry, BoxGeometry, AmbientLight, SpotLight, MeshLambertMaterial, Mesh, DoubleSide } from 'three';
import * as dat from 'dat.gui';
import { GLOBAL_SIGNALS } from './../globalSignals.js';

GLOBAL_SIGNALS.addGeometryLand.add(function (add) {
    console.log(`GLOBAL_SIGNALS.addGeometryLand:${add}`);
});

const gui = new dat.GUI();
const PLANE_SIDE_MAX = 10;
const CUBE_SIDE_MAX = PLANE_SIDE_MAX / 5;

const PLANE_POSITION_Y = 2;

class GeometryLandControl {

    constructor(geometryLand) {
        this.geometryLand = geometryLand;
        this.cubeRotationSpeed = 0.01;
        this.rotationX = -0.5 * Math.PI;
        this.rotationY = -0.5 * Math.PI;
        this.rotationZ = -0.5 * Math.PI;
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        this.numberOfObjects = geometryLand.children.length;
    }

    addCube() {
        var cubeSize = Math.ceil((Math.random() * CUBE_SIDE_MAX));
        var cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
        var cubeMaterial = new MeshLambertMaterial({ color: Math.random() * 0xffffff });
        var cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = false;
        cube.name = "cube-" + this.geometryLand.children.length;

        cube.position.x = Math.round((Math.random() * PLANE_SIDE_MAX)) - PLANE_SIDE_MAX / 2;
        cube.position.y = Math.round((Math.random() * CUBE_SIDE_MAX)) + CUBE_SIDE_MAX / 2;
        cube.position.z = Math.round((Math.random() * PLANE_SIDE_MAX)) - PLANE_SIDE_MAX / 2;

        this.geometryLand.add(cube);
        this.numberOfObjects = this.geometryLand.children.length;
    };

    removeCube() {
        var allChildren = this.geometryLand.children;
        var lastObject = allChildren[allChildren.length - 1];
        if (lastObject instanceof Mesh) {
            this.geometryLand.remove(lastObject);
            this.numberOfObjects = scene.children.length;
        }
    };
    outputObjects() {
        console.log(geometryLand.children);
    }
}

export default class GeometryLand extends Group {
    constructor(scene, show) {
        super();
        this.scene = scene;

        this.geometryLandControl = new GeometryLandControl(this);

        // var ambientLight = new AmbientLight(0x0c0c0c);
        // this.add(ambientLight);

        // // add spotlight for the shadows
        // var spotLight = new SpotLight(0xff0000);
        // spotLight.position.set(-40, 60, -10);
        // spotLight.castShadow = true;
        // this.add(spotLight);

        const planeGeometry = new PlaneGeometry(PLANE_SIDE_MAX, PLANE_SIDE_MAX, 1, 1);
        const planeMaterial = new MeshLambertMaterial({ color: 0xffffff, side: DoubleSide });
        this.plane = new Mesh(planeGeometry, planeMaterial);
        this.plane.receiveShadow = true;
        this.plane.rotation.x = 0.5 * Math.PI;

        this.position.x = 0;
        this.position.y = PLANE_POSITION_Y;
        this.position.z = 0;

        gui.add(this.geometryLandControl, 'positionX', -100, 100).onChange((value) => {
            this.position.x = value;
        });
        gui.add(this.geometryLandControl, 'positionY', -100, 100).onChange((value) => {
            this.position.y = value;
        });
        gui.add(this.geometryLandControl, 'positionZ', -100, 100).onChange((value) => {
            this.position.z = value;
        });
        gui.add(this.geometryLandControl, 'rotationX', -1, 1).onChange((value) => {
            this.rotation.x = value * Math.PI;
        });
        gui.add(this.geometryLandControl, 'rotationY', -1, 1).onChange((value) => {
            this.rotation.y = value * Math.PI;
        });
        gui.add(this.geometryLandControl, 'rotationZ', -1, 1).onChange((value) => {
            this.rotation.z = value * Math.PI;
        });
        gui.add(this.geometryLandControl, 'cubeRotationSpeed', 0, 0.05);
        gui.add(this.geometryLandControl, 'addCube');
        gui.add(this.geometryLandControl, 'removeCube');
        gui.add(this.geometryLandControl, 'numberOfObjects').listen();
        show ? gui.show() : gui.hide();
        this.add(this.plane);
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
        this.rotation.y = -timeStamp / 10000;
        this.traverse((e) => {
            if (e instanceof Mesh && e != this.plane) {
                e.rotation.x += this.geometryLandControl.cubeRotationSpeed;
                e.rotation.y += this.geometryLandControl.cubeRotationSpeed;
                e.rotation.z += this.geometryLandControl.cubeRotationSpeed;
            }
        });
    }
}