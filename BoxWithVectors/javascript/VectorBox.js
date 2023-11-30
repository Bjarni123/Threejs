import * as THREE from "three";

function CreateVectorBox() {
    const group = new THREE.Group();

    const pointsSideA = [];
    
    pointsSideA.push( new THREE.Vector3( 0, 0, 0 ) );
    pointsSideA.push( new THREE.Vector3( 0, 0, 1 ) );
    pointsSideA.push( new THREE.Vector3( 0, 1, 1 ) );
    pointsSideA.push( new THREE.Vector3( 0, 1, 0 ) );
    pointsSideA.push( new THREE.Vector3( 0, 0, 0 ) );

    const pointsSideB = [];

    pointsSideB.push( new THREE.Vector3( 1, 0, 0 ) );
    pointsSideB.push( new THREE.Vector3( 1, 0, 1 ) );
    pointsSideB.push( new THREE.Vector3( 1, 1, 1 ) );
    pointsSideB.push( new THREE.Vector3( 1, 1, 0 ) );
    pointsSideB.push( new THREE.Vector3( 1, 0, 0 ) );

    
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

    const points4 = [];

    points4.push( new THREE.Vector4( 0, 0, 0, 1 ) );
    points4.push( new THREE.Vector4( 0, 0, 1, 1 ) );
    points4.push( new THREE.Vector4( 0, 1, 1, 1 ) );
    points4.push( new THREE.Vector4( 0, 1, 0, 1 ) );
    points4.push( new THREE.Vector4( 1, 0, 0, 1 ) );
    points4.push( new THREE.Vector4( 1, 0, 1, 1 ) );
    points4.push( new THREE.Vector4( 1, 1, 1, 1 ) );
    points4.push( new THREE.Vector4( 1, 1, 0, 1 ) );


    const geometry4 = new THREE.BufferGeometry().setFromPoints( points4 );
    const line4 = new THREE.Line( geometry4, material );
    group.add(line4);

    return group;
}

export { CreateVectorBox }