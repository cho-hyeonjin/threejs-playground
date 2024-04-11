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

  // 그림자 기능 사용하려면 먼저 shadowMap의 enabled 속성을 true로 설정해줘야 함! (그림자 기능이 있는 Light, 없는 Light가 있으니 확인하고 사용할것~!)
  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75, // fov (camera frustrum vetical field of view)
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // camera frustrum near plane
    500 // camera frustrum far plane
  );

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

  // 그림자는 cast, recieve 객체를 설정해줘야 함! (그림자를 드리우는 객체, 그림자를 받는 객체!)
  text.castShadow = true; // text가 그림자 드리우는 shadow cast 객체

  // textGeometry.computeBoundingBox(); // BoundingBox 사용하려면 이렇게 호출부터 해줘야 함

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
  plane.receiveShadow = true; // plane이 그림자 받는 shadow recieve 객체

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

  // 그림자의 cast 객체와 recieve 객체를 설정해주었으면, Light 객체에 castShadow 값을 true로 설정하여 cast 해줘야 한다. (Shadow 기능을 지원하는 Ligth인지 확인 후 설정할 것~!)
  spotLight.castShadow = true;
  // 그림자를 표현할 map의 크기를 설정하여 그림자의 가장자리 노이즈를 부드럽게 바꿔준다. 2의 거듭제곱값으로 설정하면 됨(기본값은 512) 단! 값을 너무 높게 설정하면 그림자 해상도는 높아지겠지만 렌더링 성능이 낮아지므로 적당한 값으로 판단해서 설정하기!
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.width = 1024;
  // 자연스러운 그림자를 위해 가장자리에 블러 효과를 준다.
  spotLight.shadow.radius = 10;

  spotLight.position.set(0, 0, 3);
  spotLight.target.position.set(0, 0, -3);

  const spotLightTexture = textureLoader.load("gradient.jpg");
  // Texture 인코딩 방식 설정
  spotLightTexture.encoding = THREE.sRGBEncoding; // todo: Threejs srgb linear encoding search in Google!
  THREE.LinearEncoding;
  spotLight.map = spotLightTexture;

  scene.add(spotLight, spotLight.target);

  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 20; // 1. '0.5'를 빼 준 이유 : ()는 0~1사이이기 때문! -0.5를 해주면 커서가 화면 중앙에 가까워질 때 (0,0)에 가까워짐! (내가 알던 좌표 논리 반영 위함~)
    const y = -(event.clientY / window.innerHeight - 0.5) * 20;
    // 2. '* 20'을 해준 이유 : 기본 세팅된 움직임 값이 너무 작아서 마우스 움직이는 만큼 빛이 따라오지 않아서 이것도 싱크 맞춰주기 위해서~ 1번의 값에 *5
    // 3. y에 -를 붙인 이유 :
    // 그런데 window의 이벤트는 수직방향으로 위로 올라가면 -, 아래로 내려가면 +이기 때문에~ 내가 알고 있는 좌표 논리에서 reverse된 느낌. Three.js는 내가 알던 좌표 논리와 동일하게 위로 올라가면 +, 아래로 내려가면 - → 내가 window에서 마우스를 아래로 움직이면 Three.js의 spotLight는 위로 움직이게 되서 헷갈리고 불편!
    // 따라서 Three.js와 window.mousemove 이벤트의 좌표 논리를 동일하게 & 내가 알던 좌표 논리에 맞게 하기 위해

    spotLight.target.position.set(x, y, -3);
  });

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

  // 그림자 가장자리 블러 효과
  spotLightFolder
    .add(spotLight.shadow, "radius")
    .min(1)
    .max(20)
    .step("shadow.radius");

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
