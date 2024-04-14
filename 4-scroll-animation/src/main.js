import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GUI } from "lil-gui";

window.addEventListener("load", function () {
  init();
});

async function init() {
  gsap.registerPlugin(ScrollTrigger);

  const params = {
    waveColor: "#00ffff",
    backgroundColor: "#ffffff",
    fogColor: "#f0f0f0",
  };

  const gui = new GUI();

  gui.hide();

  const canvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas, // 위에서 만든 canvas요소가 Three.js의 renderer로 사용됨
  });

  renderer.shadowMap.enabled = true;

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
    // color: "#00FFFF",
    color: params.waveColor,
  });

  const wave = new THREE.Mesh(waveGeometry, waveMaterial);

  wave.rotation.x = -Math.PI / 2;
  wave.receiveShadow = true;

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

  const gltfLoader = new GLTFLoader();

  const gltf = await gltfLoader.loadAsync("./models/ship/scene.gltf");

  // 3D모델들은 gltf.scene 안에 포함되어 있는 값들이기 때문에 gltf.scene 안에 포함된 객체들을 탐색하면서 그 객체들에 castShadow를 true로 만들어줘야 함.
  const ship = gltf.scene;

  ship.castShadow = true;

  // gltf.scene 내부의 객체들을 순회하면서 그 중 Mesh 객체인 경우에만 castShadow를 true로 만드는 작업.
  ship.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });

  ship.update = function () {
    const elapsedTime = clock.getElapsedTime();

    ship.position.y = Math.sin(elapsedTime * 3);
  };

  ship.rotation.y = Math.PI;

  ship.scale.set(40, 40, 40);

  scene.add(ship);

  const pointLight = new THREE.PointLight(0xffffff, 2000);

  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.radius = 10;

  pointLight.position.set(25, 25, 25);

  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.radius = 10;

  directionalLight.position.set(-25, 25, 25);

  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    wave.update();

    ship.update();

    camera.lookAt(ship.position);

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

  /** 시간차를 두고 변경되게 하고 싶다면? → gsap.timeline */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      markers: true,
      scrub: true,
    },
  });

  tl.to(params, {
    waveColor: "#4258ff",
    onUpdate: () => {
      waveMaterial.color = new THREE.Color(params.waveColor);
    },
  })
    .to(
      params,
      {
        backgroundColor: "#2a2a2a",
        onUpdate: () => {
          scene.background = new THREE.Color(params.backgroundColor);
        },
      },
      "<"
    )
    .to(
      params,
      {
        fogColor: "#2f2f2f",
        onUpdate: () => {
          scene.fog.color = new THREE.Color(params.fogColor);
        },
      },
      "<"
    );
}
