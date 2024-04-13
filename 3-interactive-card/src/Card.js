import * as THREE from "three";

// const card = new Card {
//   width: 2,
//   height: 3,
//   color: #0077ffm
// }

class Card {
  constructor({ width, height, color }) {
    const geometry = new THREE.PlaneGeometry(width, height);
    // Material 은 성능적인 이유로 앞면만 렌더링하는 것이 default 설정이기 때문에, 다른 면을 보고 싶으면 side 옵션으로 값을 설정해줘야 함.
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);

    this.mesh = mesh;
  }
}

export default Card;
