import * as THREE from "three";

import * as matrix from "./matrix";

const points = [
    new P4Vector(-1, -1, -1, 1),
    new P4Vector(1, -1, -1, 1),
    new P4Vector(1, 1, -1, 1),
    new P4Vector(-1, 1, -1, 1),
    new P4Vector(-1, -1, 1, 1),
    new P4Vector(1, -1, 1, 1),
    new P4Vector(1, 1, 1, 1),
    new P4Vector(-1, 1, 1, 1),
    new P4Vector(-1, -1, -1, -1),
    new P4Vector(1, -1, -1, -1),
    new P4Vector(1, 1, -1, -1),
    new P4Vector(-1, 1, -1, -1),
    new P4Vector(-1, -1, 1, -1),
    new P4Vector(1, -1, 1, -1),
    new P4Vector(1, 1, 1, -1),
    new P4Vector(-1, 1, 1, -1)
]

function connectWithVector(offset, i, j, points2) {
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const p1 = points2[i + offset];
    const p2 = points2[j + offset];
    const geometryConnectors = new THREE.BufferGeometry().setFromPoints( [new THREE.Vector3(p1.x, p1.y, p1.z), new THREE.Vector3(p2.x, p2.y, p2.z)] );
    const lineConnectors = new THREE.Line( geometryConnectors, material );
    
    return lineConnectors
}

function CreateTesseractVector(angle = 0, width = 2) {
    const group = new THREE.Group();
    const projected3d = [];

    for (let i = 0; i < points.length; i++) {
        const v = points[i];
    
        const rotationXY = [
            [Math.cos(angle), -Math.sin(angle), 0, 0],
            [Math.sin(angle), Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ];
    
        const rotationZW = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, Math.cos(angle), -Math.sin(angle)],
            [0, 0, Math.sin(angle), Math.cos(angle)]
        ];
    
        let rotated = matrix.matmul(rotationXY, v);
        rotated = matrix.matmul(rotationZW, rotated);
    
        let distance = 2;
        let w = 1 / (distance - rotated.w);
    
        const projection = [
            [w, 0, 0, 0],
            [0, w, 0, 0],
            [0, 0, w, 0],
        ];
    
        let projected = matrix.matmul(projection, rotated);
        projected.mult(width);
        projected3d[i] = projected;
    }


    // Add the dots/corners
    for (let i = 0; i < projected3d.length; i++) {
        var dotGeometry = new THREE.SphereGeometry(0.1, 32, 16);
        var dotMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var dot = new THREE.Mesh( dotGeometry, dotMaterial );
        dot.position.set(projected3d[i].x, projected3d[i].y, projected3d[i].z);
        group.add( dot );
    }


    // put the lines on "outer" box
    for (let i = 0; i < 4; i++) {
        const line1 = connectWithVector(0, i, (i + 1) % 4, projected3d);
        const line2 = connectWithVector(0, i + 4, ((i + 1) % 4) + 4, projected3d);
        const line3 = connectWithVector(0, i, i + 4, projected3d);

        group.add(line1, line2, line3);
    }

    // put the lines on the "inner" box
    for (let i = 0; i < 4; i++) {
        const line1 = connectWithVector(8, i, (i + 1) % 4, projected3d);
        const line2 = connectWithVector(8, i + 4, ((i + 1) % 4) + 4, projected3d);
        const line3 = connectWithVector(8, i, i + 4, projected3d);

        group.add(line1, line2, line3);
    }

    // connect the boxes
    for (let i = 0; i < 8; i++) {
        const line1 = connectWithVector(0, i, i + 8, projected3d);

        group.add(line1);
    }

    return group;
}

class Tesseract {
    constructor() {
        this.group = CreateTesseractVector();
        this.angle = 0;
    }

    tick() {
        this.angle += 0.01;
        this.group = CreateTesseractVector(this.angle);
    }

    getTesseract() {
        return this.group;
    }
}

export { Tesseract }