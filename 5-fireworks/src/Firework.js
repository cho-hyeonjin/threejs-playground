/** CONSUMER */
// new Firework({x: 0, y: 0})

import * as THREE from "three";

/** PRODUCER */
class FireWork {
  constructor({ x, y }) {
    const count = 1000;

    const particlesGeometry = new THREE.BufferGeometry();

    const particles = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);

      particles.push(particle);
    }

    particlesGeometry.setFromPoints(particles);

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load("./assets/textures/particle.png");

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    });

    const points = new THREE.Points(particlesGeometry, particlesMaterial);

    this.points = points;
  }
}

export default FireWork;
