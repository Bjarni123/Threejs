import * as THREE from "three";

import * as matrix from "./matrix";

let points = [
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

class Tesseract {
    constructor() {
        this.group = new THREE.Group();
        this.angle = 0;
        this.projected3d = [];
        this.width = 2;
    }

    calculatePoints() {
        for (let i = 0; i < points.length; i++) {
            const v = points[i];
            
            const rotationXY = [
                [Math.cos(this.angle), -Math.sin(this.angle), 0, 0],
                [Math.sin(this.angle), Math.cos(this.angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];
    
            
            const rotationZW = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, Math.cos(this.angle), -Math.sin(this.angle)],
                [0, 0, Math.sin(this.angle), Math.cos(this.angle)]
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
            projected.mult(this.width);
            this.projected3d[i] = projected;
        }
    }

    createGroup() {
        //this.group = new THREE.Group();

        // Add the dots/corners
        for (let i = 0; i < this.projected3d.length; i++) {
            var dotGeometry = new THREE.SphereGeometry(0.1, 32, 16);
            var dotMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            var dot = new THREE.Mesh( dotGeometry, dotMaterial );
            dot.position.set(this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z);
            this.group.add( dot );
        }


        // put the lines on "outer" box
        for (let i = 0; i < 4; i++) {
            const line1 = connectWithVector(0, i, (i + 1) % 4, this.projected3d);
            const line2 = connectWithVector(0, i + 4, ((i + 1) % 4) + 4, this.projected3d);
            const line3 = connectWithVector(0, i, i + 4, this.projected3d);

            this.group.add(line1, line2, line3);
        }

        // put the lines on the "inner" box
        for (let i = 0; i < 4; i++) {
            const line1 = connectWithVector(8, i, (i + 1) % 4, this.projected3d);
            const line2 = connectWithVector(8, i + 4, ((i + 1) % 4) + 4, this.projected3d);
            const line3 = connectWithVector(8, i, i + 4, this.projected3d);

            this.group.add(line1, line2, line3);
        }

        // connect the boxes
        for (let i = 0; i < 8; i++) {
            const line1 = connectWithVector(0, i, i + 8, this.projected3d);

            this.group.add(line1);
        }
    }

    tick() {
        this.angle += 0.02;
        this.calculatePoints();
        this.createGroup();
    }

    getTesseract() {
        this.calculatePoints();
        this.createGroup();
        return this.group;
    }
}

export { Tesseract }