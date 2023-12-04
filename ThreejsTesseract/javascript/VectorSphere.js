import * as THREE from "three";

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
            const y = 1 - (i / 100) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;

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


        /* // Calculate points on a hypersphere
        const n = 3;
        const m = 2;
        const r = 2;
        const pi = Math.PI;
        const theta = pi / n;
        const phi = pi / m;
        const points = [];
        for (let i = 0; i < n; i++) {
            const x = r * Math.cos(theta * i);
            const y = r * Math.sin(theta * i);
            for (let j = 0; j < m; j++) {
                const z = r * Math.cos(phi * j);
                const w = r * Math.sin(phi * j);
                points.push(new THREE.Vector4(x, y, z, w));
            }
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
            dot.position.set(this.points[i].x * this.radius, this.points[i].y * this.radius, this.points[i].z * this.radius);
            this.group.add( dot );
        }
    }

    getSphere() {
        return this.group;
    }
}

export { CreateVectorSphere }