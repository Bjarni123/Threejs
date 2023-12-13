import { 
    BoxGeometry,
    MeshStandardMaterial,
    Mesh,
    HemisphereLight,
    DirectionalLight
} from "three";

function createFloor() {
    const floorGeometry = new BoxGeometry(10, 0.5, 10);
    const floorMaterial = new MeshStandardMaterial({ color: 'White' });
    const floor = new Mesh(floorGeometry, floorMaterial);

    floor.receiveShadow = true
    floor.position.y = -3;

    return floor;
}

function createLights() {

    const ambientLight = new HemisphereLight(
        'white', // bright sky color
        'darkslategrey', // dim ground color
        2, // intensity
    );

    // const ambientLight = new AmbientLight('white', 2);
    // Create a directional light
    const mainLight = new DirectionalLight('white', 8);

    mainLight.castShadow = true

    // move the light right, up, and towards us
    mainLight.position.set(0, 10, 0);

    return {mainLight, ambientLight};
}

export { createFloor, createLights }
