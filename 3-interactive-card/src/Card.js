import * as THREE from "three";

// const card = new Card {
//   width: 2,
//   height: 3,
//   color: #0077ffm
// }

class Card {
  constructor({ width, height, color }) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    this.mesh = mesh;
  }
}

export default Card;
