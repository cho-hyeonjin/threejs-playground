import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

window.addEventListener("load", function () {
  init();
});

async function init() {
  const gui = new GUI();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75, // fov (camera frustrum vetical field of view)
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // camera frustrum near plane
    500 // camera frustrum far plane
  );

  console.log(camera);
  camera.position.z = 5;

  /** Controls */
  new OrbitControls(camera, renderer.domElement);

  /** Font */
  const fontLoader = new FontLoader();

  // text를 콜백함수 밖에서도 접근할 수 있도록 하기 위해 load 대신 loadAsync 를 이용한 리팩토링
  const font = await fontLoader.loadAsync(
    "./assets/fonts/Hakgyoansim Jiugae R_Regular.json"
  );
  /** Text */
  const textGeometry = new TextGeometry("니가 웃으면 나도 좋아", {
    font,
    size: 0.5,
    depth: 0.1, // TextGeometry의 height 속성은 deprecated. → depth로 사용해야 함
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });

  const textMaterial = new THREE.MeshPhongMaterial();

  const text = new THREE.Mesh(textGeometry, textMaterial);

  textGeometry.computeBoundingBox(); // BoundingBox 사용하려면 이렇게 호출부터 해줘야 함

  scene.add(text);

  /** Texture */
  const textureLoader = new THREE.TextureLoader().setPath("./assets/textures/"); // setPath로 TextureLoader의 path를 설정해두면~

  // TextureLoader의 loader 메서드는 loadAsync를 쓰지 않더라도 바로 texture instance를 반환해준다!
  const textTexture = textureLoader.load("holographic.jpeg"); // load 시 파일명만 넣어주면 load 가능!

  textMaterial.map = textTexture;

  textGeometry.center();

  /** Plane - 빛을 받는 백그라운드 역할 */
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xff64dc });
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.position.z = -10;

  scene.add(plane);

  /** AmbientLight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  scene.add(ambientLight);

  /** SpotLight */
  const spotLight = new THREE.SpotLight(
    0xdfffff, // 빛 색상
    10, // 빛 강도
    30, // 빛이 닿는 거리
    Math.PI * 0.15, // 빛이 퍼지는 각도
    0.2, // 빛이 감소하는 정도
    0.5 // 거리에 따른 빛의 감소량
  );

  spotLight.position.set(0, 0, 3);

  scene.add(spotLight);

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);

  scene.add(spotLightHelper);

  // add 대신 addFolder를 사용하면 관련된 속성들을 묶어서 폴더 단위로 사용할 수 있음
  const spotLightFolder = gui.addFolder("SpotLight");

  spotLightFolder
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);

  spotLightFolder
    .add(spotLight.position, "z")
    .min(1)
    .max(10)
    .step(0.01)
    .name("position.z");

  // spotLight 출발점에서 Mesh(target)까지의 거리
  spotLightFolder.add(spotLight, "distance").min(1).max(30).step(0.01);

  // 거리에 따라 옅어지는 spotLight의 강도 (intensity) - 수치가 클수록 intense함
  spotLightFolder.add(spotLight, "decay").min(0).max(10).step(0.01);

  // spotLight의 경계 - 0에 가까울수록(수치가 작을수록) 경계가 선명해지고, 수치가 클수록 경계가 희미해짐
  spotLightFolder.add(spotLight, "penumbra").min(0).max(1).step(0.01);

  render();

  function render() {
    renderer.render(scene, camera);

    // spotLightHelper도 매 프레임마다 변경값이 반영되도록 render함수에 넣어준다
    spotLightHelper.update();

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
