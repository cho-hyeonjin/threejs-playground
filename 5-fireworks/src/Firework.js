/** CONSUMER */
// new Firework({x: 0, y: 0})

import * as THREE from "three";

/** PRODUCER */
class FireWork {
  constructor({ x, y }) {
    const count = 1000 + Math.round(Math.random() * 5000); // particle 개수 랜덤 설정
    const velocity = 10 + Math.random() * 10;

    const particlesGeometry = new THREE.BufferGeometry();

    this.particles = [];

    for (let i = 0; i < count; i++) {
      const particle = new THREE.Vector3(x, y, 0);

      // todo: 아래 공식들을 제대로 이해하려면 기하학 기초 지식 필요

      /** 육면체 형태로 퍼지는 particle */
      // particle.deltaX = THREE.MathUtils.randFloatSpread(velocity);
      // particle.deltaY = THREE.MathUtils.randFloatSpread(velocity);
      // particle.deltaZ = THREE.MathUtils.randFloatSpread(velocity);

      /** 2차원 원 형태로 퍼지는 partcle */
      // particle.theta = Math.random() * Math.PI * 2;

      // particle.deltaX = velocity * Math.cos(particle.theta);
      // particle.deltaY = velocity * Math.sin(particle.theta);
      // particle.deltaZ = 0;

      /** 원의 3차원 표현(구) 형태로 퍼지는 particle - 구면좌표계 → 직교좌표계 */
      particle.theta = Math.random() * Math.PI * 2;
      particle.phi = Math.random() * Math.PI * 2;

      particle.deltaX =
        velocity * Math.sin(particle.theta) * Math.cos(particle.phi);
      particle.deltaY =
        velocity * Math.sin(particle.theta) * Math.sin(particle.phi);
      particle.deltaZ = velocity * Math.cos(particle.theta);

      this.particles.push(particle);
    }

    particlesGeometry.setFromPoints(this.particles);

    const textureLoader = new THREE.TextureLoader();

    const texture = textureLoader.load("./assets/textures/particle.png");

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1,
      alphaMap: texture,
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      blending: THREE.AdditiveBlending, // 채도 좀 더 살아나게
    });

    const points = new THREE.Points(particlesGeometry, particlesMaterial);

    this.points = points;
  }

  update() {
    const position = this.points.geometry.attributes.position;

    for (let i = 0; i < this.particles.length; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      position.setX(i, x + this.particles[i].deltaX);
      position.setY(i, y + this.particles[i].deltaY);
      position.setZ(i, z + this.particles[i].deltaZ);
    }

    position.needsUpdate = true;
  }
}

export default FireWork;
