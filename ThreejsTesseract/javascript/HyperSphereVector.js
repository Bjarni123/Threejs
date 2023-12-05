import * as THREE from "three";

class CreateHyperSphere {
    constructor() {
        this.group = new THREE.Group();
        this.radius = 2;
        this.points = [];
        this.calculatePoints();
        this.drawCircle();
    }

    calculatePoints() {
        // https://stackoverflow.com/questions/57123194/how-to-distribute-points-evenly-on-the-surface-of-hyperspheres-in-higher-dimensi
        

    }

    drawCircle() {
        this.group = new THREE.Group();

        var dotGeometry = new THREE.SphereGeometry(0.1, 32, 16);
        var dotMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        for (let i = 0; i < this.points.length; i++) {
            var dot = new THREE.Mesh( dotGeometry, dotMaterial );
            dot.position.set(this.points[i].x, this.points[i].y, this.points[i].z);
            this.group.add( dot );
        }

        // Draw lines between the points
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++) {
                // find the points which are closest together and draw a line between them
                const distance = this.points[i].distanceTo(this.points[j]);
                if (distance < 0.8) {
                    const geometry = new THREE.BufferGeometry().setFromPoints( [this.points[i], this.points[j]] );
                    const line = new THREE.Line( geometry, material );
                    this.group.add( line );
                }
            }
        }
    }

    getSphere() {
        return this.group;
    }
}

export { CreateHyperSphere }