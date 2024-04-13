import * as THREE from "three";
import { GUI } from "lil-gui";

window.addEventListener("load", function () {
  init();
});

function init() {
  const canvas = document.querySelector("#canvas");

  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas, // 위에서 만든 canvas요소가 Three.js의 renderer로 사용됨
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  // 안개 표현 방법 1
  scene.fog = new THREE.Fog(0xf0f0f0, 0.1, 500);
  // 안개 표현 방법 2
  // scene.fog = new THREE.FogExp2(0xf0f0f0, 0.005); // Fog보다 안개가 좀 더 현실적인 느낌으로 표현되지만, 안개의 범위를 직접 지정할 수 없어서 Fog를 더 많이 씀

  gui.add(scene.fog, "near").min(0).max(100).step(0.1);
  gui.add(scene.fog, "far").min(100).max(500).step(0.1);

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

  wave.rotation.x = -Math.PI / 2;

  const waveHeight = 2.5;
  const initialZPositions = [];

  for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
    const z =
      waveGeometry.attributes.position.getZ(i) +
      (Math.random() - 0.5) * waveHeight;

    waveGeometry.attributes.position.setZ(i, z);
    initialZPositions.push(z);
  }

  wave.update = function () {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < waveGeometry.attributes.position.count; i++) {
      // initialZPositions[i]로 i번째 좌표의 z좌표 얻기
      // 각 정점마다 움직이는 높낮이를 다르게 하기 위해 elapsedTime *3 + i
      // 불규칙하게 움직이게 하기 위해 + i → + i ** 2 (i를 거듭제곱한 값)로 리팩토링
      const z =
        initialZPositions[i] + Math.sin(elapsedTime * 3 + i ** 2) * waveHeight;

      waveGeometry.attributes.position.setZ(i, z);

      waveGeometry.attributes.position.array[i + 2] +=
        Math.sin(elapsedTime * 3) * waveHeight;
    }

    waveGeometry.attributes.position.needsUpdate = true;
  };

  scene.add(wave);

  const pointLight = new THREE.PointLight(0xffffff, 2000);

  pointLight.position.set(25, 25, 25);

  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);

  directionalLight.position.set(-25, 25, 25);

  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    wave.update();

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
