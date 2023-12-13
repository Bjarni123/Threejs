import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.module.js";

class CreateVectorSphere {
    constructor() {
        this.group = new THREE.Group();
        this.radius = 2;
        this.points = [];
        this.calculatePoints();
        this.drawCircle();
    }

    calculatePoints() {
        // https://stackoverflow.com/questions/57123194/how-to-distribute-points-evenly-on-the-surface-of-hyperspheres-in-higher-dimensi




        // https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere
        this.points = [];
        const phi = Math.PI * (Math.sqrt(5) - 1);

        for (let i = 0; i < 100; i++) {
            let y = 1 - (i / 100) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;

            let x = Math.cos(theta) * radius;
            let z = Math.sin(theta) * radius

            x *= this.radius;
            y *= this.radius;
            z *= this.radius;

            this.points.push(new THREE.Vector3(x, y, z));
        }

        // Calculate points on a sphere
        /* const n = 100;
        const inc = Math.PI * (3 - Math.sqrt(5));
        const off = 2 / n;
        const points = [];
        const radius = 2;
        for (let k = 0; k < n; k++) {
            const y = k * off - 1 + off / 2;
            const r = Math.sqrt(1 - y * y);
            const phi = k * inc;
            points.push(new THREE.Vector3(Math.cos(phi) * r * radius, y * radius, Math.sin(phi) * r * radius));
        }
        this.points = points; */
        
        // Notkun eingahrings til að reikna punkta á hring
        /* const einingahringur = [
            0.5, Math.sqrt(2) / 2, Math.sqrt(3) / 2,
        ]

        this.points = [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),

            new THREE.Vector3(einingahringur[0], einingahringur[2], 0),
            new THREE.Vector3(einingahringur[0], -einingahringur[2], 0),
            new THREE.Vector3(-einingahringur[0], einingahringur[2], 0),
            new THREE.Vector3(-einingahringur[0], -einingahringur[2], 0),

            new THREE.Vector3(einingahringur[1], einingahringur[1], 0),
            new THREE.Vector3(einingahringur[1], -einingahringur[1], 0),
            new THREE.Vector3(-einingahringur[1], einingahringur[1], 0),
            new THREE.Vector3(-einingahringur[1], -einingahringur[1], 0),

            new THREE.Vector3(einingahringur[2], einingahringur[0], 0),
            new THREE.Vector3(einingahringur[2], -einingahringur[0], 0),
            new THREE.Vector3(-einingahringur[2], einingahringur[0], 0),
            new THREE.Vector3(-einingahringur[2], -einingahringur[0], 0),
        ] */
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

export { CreateVectorSphere }