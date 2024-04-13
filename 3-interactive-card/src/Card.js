import * as THREE from "three";

// const card = new Card {
//   width: 2,
//   height: 3,
//   color: #0077ffm
// }

class Card {
  constructor({ width, height, radius, color }) {
    const x = width / 2 - radius;
    const y = height / 2 - radius;
    const shape = new THREE.Shape();

    shape
      .absarc(x, y, radius, Math.PI / 2, 0, true) // 우상단 absarc
      .lineTo(x + radius, -y) // 우하단 꼭지점까지 라인 잇기
      .absarc(x, -y, radius, 0, -Math.PI / 2, true) // 우하단 absarc
      .lineTo(-x, -(y + radius)) // 좌하단 꼭지점까지 라인 잇기
      .absarc(-x, -y, radius, -Math.PI / 2, Math.PI, true) // 좌하단 absarc
      .lineTo(-(x + radius), y, radius, Math.PI, Math.PI / 2, true) // 좌상단 꼭지점까지 라인 잇기
      .absarc(-x, y, radius, Math.PI, Math.PI / 2, true); // 좌상단 absarc
    // const geometry = new THREE.PlaneGeometry(width, height); // PlaneGeometry는 Shape가 한정적. (width, height만 제공하기 떄문)

    const geometry = new THREE.ShapeGeometry(shape);
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
