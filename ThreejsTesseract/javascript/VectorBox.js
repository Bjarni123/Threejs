import {
    Group,
    Vector3,
    LineBasicMaterial,
    BufferGeometry,
    Line
} from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.module.js";

function CreateVectorBox() {
    const group = new Group();

    const pointsSideA = [];
    
    pointsSideA.push( new Vector3( -1, -1, -1 ) );
    pointsSideA.push( new Vector3( -1, -1, 1 ) );
    pointsSideA.push( new Vector3( -1, 1, 1 ) );
    pointsSideA.push( new Vector3( -1, 1, -1 ) );
    pointsSideA.push( new Vector3( -1, -1, -1 ) );

    const pointsSideB = [];

    pointsSideB.push( new Vector3( 1, -1, -1 ) );
    pointsSideB.push( new Vector3( 1, -1, 1 ) );
    pointsSideB.push( new Vector3( 1, 1, 1 ) );
    pointsSideB.push( new Vector3( 1, 1, -1 ) );
    pointsSideB.push( new Vector3( 1, -1, -1 ) );

    
    const material = new LineBasicMaterial( { color: 0x0000ff } );
    
    const geometryA = new BufferGeometry().setFromPoints( pointsSideA );
    const lineA = new Line( geometryA, material );
    group.add(lineA);

    const geometryB = new BufferGeometry().setFromPoints( pointsSideB );
    const lineB = new Line( geometryB, material );
    group.add(lineB);

    for (let i = 0; i < pointsSideA.length - 1; i++) {
        const geometryConnectors = new BufferGeometry().setFromPoints( [pointsSideA[i], pointsSideB[i]] );
        const lineConnectors = new Line( geometryConnectors, material );
        group.add(lineConnectors);
    }

    return group;
}

export { CreateVectorBox }