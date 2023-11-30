import * as THREE from 'three';

import { createRenderer, createCamera, createScene } from "/javascript/CameraRendererScene.js";
import { onResize, Resizer, createControls } from "/javascript/ResizerAndControls.js";
import { createFloor, createLights } from "/javascript/floorAndLights.js";
import { CreateVectorBox } from "/javascript/VectorBox.js";
import { CreateTesseractVector } from '/javascript/tesseractVector.js';

// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js?module';

window.addEventListener('resize', onResize);

const clock = new THREE.Clock();

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            this.tick();
            
            // render a frame
            this.renderer.render(this.scene, this.camera);
        });
    }
    
    stop() {
        this.renderer.setAnimationLoop(null);
    }
    
    tick() {
        const delta = clock.getDelta();
        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}

let camera;
let renderer;
let scene;
let loop;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);
        container.append(renderer.domElement);

        const controls = createControls(camera, renderer.domElement);
        
        // const VectorBox = CreateVectorBox();

        const VectorTesseract = CreateTesseractVector();

        const floor = createFloor();
        const { ambientLight, mainLight } = createLights();

        //controls.target.copy(meshGroup.position);

        loop.updatables.push(controls, VectorTesseract/* , VectorBox */);

        scene.add(ambientLight, mainLight, VectorTesseract/* ,  floor *//*,  VectorBox */);
        
        const resizer = new Resizer(container, camera, renderer);

        controls.addEventListener('change', () => {
            this.render();
        });
    }

    render() {
        renderer.render(scene, camera);
    }

    start() {
        loop.start();
    }
        
    stop() {
        loop.stop();
    }
}

export { World }