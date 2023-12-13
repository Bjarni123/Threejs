import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.module.min.js";

import * as matrix from "./matrix";

function generatePointsOnHypersphere(dimensions, numPoints, radius = 2) {
    const points = [];
  
    // Generate random points on the hypersphere
    for (let i = 0; i < numPoints; i++) {
        const point = generateRandomPoint(dimensions);
        point.x *= radius;
        point.y *= radius;
        point.z *= radius;
        point.w *= radius;
        points.push(point);
    }
  
    // Apply the Spherical Code algorithm to distribute points evenly
    const sphericalCodePoints = sphericalCode(points);
  
    return sphericalCodePoints;
  }

function generateRandomPoint(dimensions) {
    const point = new P4Vector();
    let length = 0;
  
    // Generate random coordinates
    const coordinateX = Math.random() * 2 - 1; // Random value between -1 and 1
    point.x = coordinateX;
    length += coordinateX * coordinateX;

    const coordinateY = Math.random() * 2 - 1; // Random value between -1 and 1
    point.y = coordinateY;
    length += coordinateY * coordinateY;

    const coordinateZ = Math.random() * 2 - 1; // Random value between -1 and 1
    point.z = coordinateZ;
    length += coordinateZ * coordinateZ;

    const coordinateW = Math.random() * 2 - 1; // Random value between -1 and 1
    point.w = coordinateW;
    length += coordinateW * coordinateW;
  
    // Normalize the point to the surface of the hypersphere
    length = Math.sqrt(length);

    point.x /= length;
    point.y /= length;
    point.z /= length;
    point.w /= length;
  
    return point;
}
  
function sphericalCode(points) {
    // TODO: Implement the Spherical Code algorithm
    // You may need to use optimization techniques to find a set of points
    // that minimizes the discrepancy of their distribution on the hypersphere.
    // This implementation is non-trivial and may require advanced algorithms.

    // Placeholder code, replace this with the actual implementation
    return points;
}

class CreateHyperSphere {
    constructor() {
        this.group = new THREE.Group();
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotations = [0, 0, 0, 0];
        // this.width = 2;
        this.angle = 0;
        this.radius = 1;
        this.points = [];
        this.projected3d = [];
        this.calculatePoints();
        this.drawCircle();
    }

    setXRotation(xRot) {
        this.rotations[0] += 0.01 * xRot;
    }

    setYRotation(yRot) {
        this.rotations[1] += 0.01 * yRot;
    }
    
    setZRotation(zRot) {
        this.rotations[2] += 0.01 * zRot;
    }

    setWRotation(wRot) {
        this.rotations[3] += 0.01 * wRot;
    }

    calculatePoints(rotateX, rotateY, rotateZ, rotateW) {
        // https://stackoverflow.com/questions/57123194/how-to-distribute-points-evenly-on-the-surface-of-hyperspheres-in-higher-dimensi
        
        /* const dimensions = 4; // Change the number of dimensions as needed
        const numPoints = 200; // Change the number of points as needed

        this.points = generatePointsOnHypersphere(dimensions, numPoints, this.radius); */

        let da = 35;
        const na= 90.0/da;
        // console.log(na * na * na * 8);
        if (na<1) return;
        da = (90 / (na-1));

        let i, j, k;
        let a, b, c, x, y, z, w, l;

        for (a = -45.0 * Math.PI / 180, i = 0; i < na; i++, a += da) {
            for (b = -45.0 * Math.PI / 180, j = 0; j < na; j++, b += da) {
                for (c = -45.0 * Math.PI / 180, k = 0; k < na; k++, c += da) {
                    x = Math.tan(a);
                    y = Math.tan(b);
                    z = Math.tan(c);
                    w = 1.0;

                    l = Math.sqrt(x * x + y * y + z * z + w * w);
                    x /= l;
                    y /= l;
                    z /= l;
                    w /= l;

                    this.points.push(new P4Vector(x, y, z, -w));
                    this.points.push(new P4Vector(x, y, z, w));
                    this.points.push(new P4Vector(x, y, -w, z));
                    this.points.push(new P4Vector(x, y, w, z));
                    this.points.push(new P4Vector(x, -w, y, z));
                    this.points.push(new P4Vector(x, w, y, z));
                    this.points.push(new P4Vector(-w, x, y, z));
                    this.points.push(new P4Vector(w, x, y, z));
                }
            }
        }

        this.calculate3DProjection();
    }

    calculate3DProjection() {
        for (let i = 0; i < this.points.length; i++) {
            const v = this.points[i];

            let rotated = v;
            
            // X rotation
            const rotateX = [    
                [1, 0, 0, 0],
                [0, Math.cos(this.rotations[0]), -Math.sin(this.rotations[0]), 0],
                [0, Math.sin(this.rotations[0]), Math.cos(this.rotations[0]), 0],
                [0, 0, 0, 1]
            ];
            rotated = matrix.matmul(rotateX, rotated);

            // Y rotation
            const rotateY = [
                [Math.cos(this.rotations[1]), 0, -Math.sin(this.rotations[1]), 0],
                [0, 1, 0, 0],
                [Math.sin(this.rotations[1]), 0, Math.cos(this.rotations[1]), 0],
                [0, 0, 0, 1],
            ];
            rotated = matrix.matmul(rotateY, rotated);

            // Z rotation
            const rotateZ = [
                [Math.cos(this.rotations[2]), -Math.sin(this.rotations[2]), 0, 0],
                [Math.sin(this.rotations[2]), Math.cos(this.rotations[2]), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1],
            ];
            rotated = matrix.matmul(rotateZ, rotated);

            const rotateW = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, Math.cos(this.rotations[3]), -Math.sin(this.rotations[3])],
                [0, 0, Math.sin(this.rotations[3]), Math.cos(this.rotations[3])]
            ];

            rotated = matrix.matmul(rotateW, rotated);
    
        
            let distance = 2;
            let w = 1 / (distance - rotated.w);
    
        
            const projection = [
                [w, 0, 0, 0],
                [0, w, 0, 0],
                [0, 0, w, 0],
            ];
        
            let projected = matrix.matmul(projection, rotated);
            projected.mult(this.radius * 2);
            this.projected3d[i] = new THREE.Vector3(projected.x + this.position.x, projected.y + this.position.y, projected.z + this.position.z);
        }
    }

    update () {
        for (let i = 0; i < this.projected3d.length; i++) {
            var dot = this.group.children[i];
            dot.position.set(this.projected3d[i].x * this.radius, this.projected3d[i].y * this.radius, this.projected3d[i].z * this.radius);
        }
    }

    drawCircle() {
        this.group = new THREE.Group();

        var dotGeometry = new THREE.SphereGeometry(0.1, 32, 16);
        var dotMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        for (let i = 0; i < this.projected3d.length; i++) {
            var dot = new THREE.Mesh( dotGeometry, dotMaterial );
            dot.position.set(this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z);
            this.group.add( dot );
        }

        // Draw lines between the points
        /* const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        for (let i = 0; i < this.projected3d.length; i++) {
            for (let j = i + 1; j < this.projected3d.length; j++) {
                const point1 = new THREE.Vector3( this.projected3d[i].x, this.projected3d[i].y, this.projected3d[i].z );
                const point2 = new THREE.Vector3( this.projected3d[j].x, this.projected3d[j].y, this.projected3d[j].z );
                // find the points which are closest together and draw a line between them
                let distX = (this.projected3d[i].x - this.projected3d[j].x);
                distX *= distX;
                let distY = (this.projected3d[i].y - this.projected3d[j].y);
                distY *= distY;
                let distZ = (this.projected3d[i].z - this.projected3d[j].z);
                distZ *= distZ;
                let distW = (this.projected3d[i].w - this.projected3d[j].w);
                distW *= distW;
                const distance = Math.sqrt(distX + distY + distZ + distW);
                if (distance < 0.2) {
                    const geometry = new THREE.BufferGeometry().setFromPoints( [point1, point2] );
                    const line = new THREE.Line( geometry, material );
                    this.group.add( line );
                }
            }
        } */
    }

    tick() {
        this.angle += 0.01;
        this.calculate3DProjection();
        this.update();
    }

    getSphere() {
        return this.group;
    }
}

export { CreateHyperSphere }