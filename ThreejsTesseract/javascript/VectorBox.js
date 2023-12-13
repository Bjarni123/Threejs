import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.module.min.js";

function CreateVectorBox() {
    const group = new THREE.Group();

    const pointsSideA = [];
    
    pointsSideA.push( new THREE.Vector3( -1, -1, -1 ) );
    pointsSideA.push( new THREE.Vector3( -1, -1, 1 ) );
    pointsSideA.push( new THREE.Vector3( -1, 1, 1 ) );
    pointsSideA.push( new THREE.Vector3( -1, 1, -1 ) );
    pointsSideA.push( new THREE.Vector3( -1, -1, -1 ) );

    const pointsSideB = [];

    pointsSideB.push( new THREE.Vector3( 1, -1, -1 ) );
    pointsSideB.push( new THREE.Vector3( 1, -1, 1 ) );
    pointsSideB.push( new THREE.Vector3( 1, 1, 1 ) );
    pointsSideB.push( new THREE.Vector3( 1, 1, -1 ) );
    pointsSideB.push( new THREE.Vector3( 1, -1, -1 ) );

    
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    
    const geometryA = new THREE.BufferGeometry().setFromPoints( pointsSideA );
    const lineA = new THREE.Line( geometryA, material );
    group.add(lineA);

    const geometryB = new THREE.BufferGeometry().setFromPoints( pointsSideB );
    const lineB = new THREE.Line( geometryB, material );
    group.add(lineB);

    for (let i = 0; i < pointsSideA.length - 1; i++) {
        const geometryConnectors = new THREE.BufferGeometry().setFromPoints( [pointsSideA[i], pointsSideB[i]] );
        const lineConnectors = new THREE.Line( geometryConnectors, material );
        group.add(lineConnectors);
    }

    return group;
}

export { CreateVectorBox }