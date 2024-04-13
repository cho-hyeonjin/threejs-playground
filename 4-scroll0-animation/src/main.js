import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

function init() {
  const canvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas, // 위에서 만든 canvas요소가 Three.js의 renderer로 사용됨
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 25, 150);

  const waveGeometry = new THREE.PlaneGeometry(1500, 1500, 150, 150);
  const waveMaterial = new THREE.MeshStandardMaterial({
    // wireframe: true,
    color: "#00FFFF",
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  const waveHeight = 2.5;

  wave.rotation.x = -Math.PI / 2;

  // waveGeometry.attributes.position.array의 요소들은 3개씩 한 좌표라 생각하면 됨. 예를들면 x=[0], y=[1], z=[2]
  // 방법1. z좌표 값을 직접 변경하는 방식 - position.array의 length만큼 순회하며 z좌표 찾아서 설정
  // for (let i = 0; i < waveGeometry.attributes.position.array.length; i += 3) {
  //   // z좌표 += Math.random()은 0 ~ 1 사이의 값이니까 - 0.5 하면? - 0.5 ~ 0.5 사이의 값 * 파도 높이값
  //   waveGeometry.attributes.position.array[i + 2] +=
  //     (Math.random() - 0.5) * waveHeight;
  // }
  // 방법2. position에 setZ 메서드 사용하기 - position의 개수만큼 순회
  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;

    waveGeometry.attributes.position.setZ(i, z);
  }

  scene.add(wave);

  const pointLight = new THREE.PointLight(0xffffff, 2000);

  pointLight.position.set(25, 25, 25);

  scene.add(pointLight);

  render();

  function render() {
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", handleResize);
}
