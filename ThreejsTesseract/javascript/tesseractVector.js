import * as THREE from "three";

import * as matrix from "./matrix";

/* let points = [
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
] */

let points = [
    new P4Vector(-3, -3, -3, 3),
    new P4Vector(3, -3, -3, 3),
    new P4Vector(3, 3, -3, 3),
    new P4Vector(-3, 3, -3, 3),
    new P4Vector(-3, -3, 3, 3),
    new P4Vector(3, -3, 3, 3),
    new P4Vector(3, 3, 3, 3),
    new P4Vector(-3, 3, 3, 3),
    new P4Vector(-3, -3, -3, -3),
    new P4Vector(3, -3, -3, -3),
    new P4Vector(3, 3, -3, -3),
    new P4Vector(-3, 3, -3, -3),
    new P4Vector(-3, -3, 3, -3),
    new P4Vector(3, -3, 3, -3),
    new P4Vector(3, 3, 3, -3),
    new P4Vector(-3, 3, 3, -3)
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

    calculatePoints([x, y, z, w] = [0, 0, 0, 0]) {
        for (let i = 0; i < points.length; i++) {
            const v = points[i];
            
            // X rotation
            const rotateX = [    
                [1, 0, 0, 0],
                [0, Math.cos(this.angle), -Math.sin(this.angle), 0],
                [0, Math.sin(this.angle), Math.cos(this.angle), 0],
                [0, 0, 0, 1]
            ];

            // Z rotation
            const rotateZ = [
                [Math.cos(this.angle), -Math.sin(this.angle), 0, 0],
                [Math.sin(this.angle), Math.cos(this.angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];

            // Y rotation
            const rotateY = [
                [Math.cos(this.angle), 0, -Math.sin(this.angle), 0],
                [0, 1, 0, 0],
                [Math.sin(this.angle), 0, Math.cos(this.angle), 0],
                [0, 0, 0, 1],
            ];
    
            // W rotation
            const rotateW = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, Math.cos(this.angle), -Math.sin(this.angle)],
                [0, 0, Math.sin(this.angle), Math.cos(this.angle)]
            ];
    
            
            // rotated = matrix.matmul(rotateX, v);
            // rotated = matrix.matmul(rotateY, rotated);
            // rotated = matrix.matmul(rotateZ, rotated);
            let rotated = matrix.matmul(rotateW, v);
    
        
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
        this.group = new THREE.Group();

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

    update () {
        for (let i = 0; i < 16; i++) {
            var dot = this.group.children[i];
            dot.position.set(this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z);
        }

        // outer box lines
        for (let i = 0; i < 4; i++) {
            const line = this.group.children[i + 16];
            line.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z), new THREE.Vector3(this.projected3d[(i + 1) % 4].x, this.projected3d[(i + 1) % 4].y, this.projected3d[(i + 1) % 4].z)] );
            const line2 = this.group.children[i + 20];
            line2.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i + 4].x, this.projected3d[i + 4].y, this.projected3d[i + 4].z), new THREE.Vector3(this.projected3d[((i + 1) % 4) + 4].x, this.projected3d[((i + 1) % 4) + 4].y, this.projected3d[((i + 1) % 4) + 4].z)] );
            const line3 = this.group.children[i + 24];
            line3.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z), new THREE.Vector3(this.projected3d[i + 4].x, this.projected3d[i + 4].y, this.projected3d[i + 4].z)] );
        }

        // inner box lines
        for (let i = 0; i < 4; i++) {
            const line1 = this.group.children[i + 28];
            line1.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i + 8].x, this.projected3d[i + 8].y, this.projected3d[i + 8].z), new THREE.Vector3(this.projected3d[(i + 1) % 4 + 8].x, this.projected3d[(i + 1) % 4 + 8].y, this.projected3d[(i + 1) % 4 + 8].z)] );
            const line2 = this.group.children[i + 32];
            line2.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i + 12].x, this.projected3d[i + 12].y, this.projected3d[i + 12].z), new THREE.Vector3(this.projected3d[((i + 1) % 4) + 12].x, this.projected3d[((i + 1) % 4) + 12].y, this.projected3d[((i + 1) % 4) + 12].z)] );
            const line3 = this.group.children[i + 36];
            line3.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i + 8].x, this.projected3d[i + 8].y, this.projected3d[i + 8].z), new THREE.Vector3(this.projected3d[i + 12].x, this.projected3d[i + 12].y, this.projected3d[i + 12].z)] );
        }

        // connect the boxes
        for (let i = 0; i < 8; i++) {
            const line1 = this.group.children[i + 40];
            line1.geometry.setFromPoints( [new THREE.Vector3(this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z), new THREE.Vector3(this.projected3d[i + 8].x, this.projected3d[i + 8].y, this.projected3d[i + 8].z)] );
        }
    }

    tick() {
        this.angle += 0.01;
        this.calculatePoints();
        this.update();
    }

    getTesseract() {
        this.calculatePoints();
        this.createGroup();
        return this.group;
    }
}

export { Tesseract }