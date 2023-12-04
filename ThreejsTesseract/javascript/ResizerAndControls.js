import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function onResize() {
        console.log('You resized the browser window!');
}


const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
        constructor(container, camera, renderer) {
                // set initial size
                setSize(container, camera, renderer);

                window.addEventListener("resize", () => {
                // set the size again if a resize occurs
                setSize(container, camera, renderer);
                //this.onResize();
                });
        }
        //onResize();
}

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);


    controls.enableDamping = true;

    controls.tick = () => controls.update();

    controls.listenToKeyEvents(window);

    controls.autoRotate = false;
    controls.autoRotateSpeed = 1;

    controls.minDistance = 0; // 8
    controls.maxDistance = 1000; // 20

    return controls;
}

export { onResize, Resizer, createControls }