import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

window.addEventListener("load", function () {
  init();
});

function init() {
  const options = {
    color: "0x00ffff",
  };

  // 🖥️ 렌더러 생성 (3js에 내장된 WebGLRenderer 클래스로 찍어낸 인스턴스): renderer.domElement 안에는 (앞으로 만들어질 3D 콘텐츠가 보여질) canvas DOM 요소가 들어 있음. (https://threejs.org/docs/#api/en/renderers/WebGLRenderer.domElement)
  const renderer = new THREE.WebGLRenderer({
    // alpha: true, // 배경 검정색 아니고 투명하게 하려면 true로
    antialias: true, // 이미지 모서리마다 노이즈 또는 계단처럼 느껴지는 질감 없어지게 처리하는 속성
  });
  // > 🖥️📐 렌더러 사이즈 세팅
  renderer.setSize(window.innerWidth, window.innerHeight); // canvas를 화면에 꽉 차는 사이즈로 설정
  // > 🖥️ document.body 노드의 자식요소로 렌더러의 DOM요소(canvas) 추가 (renderer.domElement == canvas)
  document.body.appendChild(renderer.domElement);

  // 🏞️ Scene 생성 (3js의 내장 클래스 Scene으로 찍어낸 3D 컨텐츠를 담는 인스턴스)
  const scene = new THREE.Scene();

  // 📹 Camera 생성
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각(fov, field of view)
    window.innerWidth / window.innerHeight, // 카메라 종횡비(aspect)
    1, // near
    500 // far
  );

  // 🕹️ 카메라 컨트롤
  // Mesh 드래그 시 위치변경이 가능해지는데, 이는 Mesh가 움직이는 게 아닌 Mesh를 둘러싼 Camera의 위치가 변경되는 것이다.
  const controls = new OrbitControls(camera, renderer.domElement);
  // > AxesHelper를 설치해서 Mesh가 아닌 Camera의 위치 변경임을 확인할 수 있음.(물체가 돌아가는거였다면 x,y,z 축이 고정되어 있어야 하지만 확인해보면 축의 위치가 변하는 것을 학인할 수 있음)
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);
  // > 드래그 하지 않아도 Camera가 Mesh 주변을 자동으로 돌도록. - 기존엔 Mesh의 rotation을 이용해 Mesh를 돌리고 있었지만 이제 Mesh를 고정시키고 camera가 돌아가게 해보자.
  controls.autoRotate = true;
  // controls.autoRotateSpeed = 30; // 스피드~
  // controls.enableDamping = true; // 드래그 시 바로 멈추지 않고 스무~스하게 관성 유지
  // controls.dampingFactor = 0.01; // 관성 제어 정도 설정. 기본값은 0.05
  // controls.enableZoom = true; // 줌인~줌아웃~ 기본값이 true라 따로 설정 안해도 됨.
  // controls.enablePan = true; // 우클릭시 드래그 하면 좌우로~ 기본값이 true라 따로 설정 안해도 됨.
  // controls.maxDistance = 50; // 줌은 무한으로 가능하게 설정되어있는데 min,max Distance 옵션으로 범위 제한 가능
  // controls.minDistance = 10;
  // controls.maxPolarAngle = Math.PI / 2; // 카메라 수직 무빙 범위 제한 옵션
  // controls.minPolarAngle = Math.PI / 3;
  // controls.maxAzimuthAngle = Math.PI / 2; // 카메라 수평 무빙 범위 제한 옵션
  // controls.minAzimuthAngle = Math.PI / 3; // 카메라 수평 무빙 범위 제한 옵션

  //📦 Mesh 오브젝트 생성
  // > 3개의 좌표로 지오메트리 (3D 오브젝트 형체) 생성
  const cubeGeometry = new THREE.IcosahedronGeometry(1); // 20면체 지오메트리
  // > 3js에서 제공하는 내장 Mesh 클래스로 3D 오브젝트의 질감 (Material) 생성
  // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff }); // lights의 영향을 받지 않는 geometry라 light로 음영표현이 안됨
  // const material = new THREE.MeshStandardMaterial({
  const cubeMaterial = new THREE.MeshLambertMaterial({
    //
    color: 0x00ffff,
    emissive: 0x111111, // Material이 자체적으로 내뿜는 색 표현 속성
    // color: 0xffa500 // 16진수 넘버타입 hex 코드
    // color: '#ffa500' // 16진수 문자열타입 hex 코드
    // color: 'orange' // 컬러명
    // color: new THREE.Color(0xffa500), // 3js에 내장된 Color 클래스 인스턴스
    // transparent: true, // 투명도 설정
    // opacity: 0.5, // 투명도 정도 설정
    // visible: false, // 안 보이게
    // wireframe: true, // Material 골격 확인
    // side: THREE.BackSide, // 보여지는 기준면
  });
  // material.color = new THREE.Color(0xcc99ff); // material 생성 후에 컬러 부여하는 방식도 가능
  // > Mesh 오브젝트 생성✨ (Mesh클래스에 Geometry, Material 전달해서 찍어낸 인스턴스)
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // > Mesh 오브젝트 Scene에 추가
  scene.add(cube);

  // 📦 또 다른 Mesh 오브젝트 생성
  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color: 0xaaaaaa,
  });
  // > Geometry와 Material로 부피와 질감을 가진 Mesh 오브젝트 생성
  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);
  // > 오브젝트 scene에 추가
  scene.add(skeleton);
  // scene.add(cube, skeleton); // 이렇게 한번에 추가도 가능

  // 📹 카메라 포지션 세팅
  camera.position.z = 5; // 벡터 좌표 하나하나 설정하는 방식
  // camera.position.set(3, 4, 5); // 벡터 좌표 한번에 설정하는 방식 (set메서드)
  // camera.lookAt(cube.position); // 카메라가 항상 오브젝트를 바라보도록 설정하는 메서드

  // 🔦 주조명 생성
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  // 주조명 포지션 세팅
  // directionalLight.position.set(-1, 2, 3);
  // 주조명 Scene에 추가
  scene.add(directionalLight);
  // // 🔦 보조 조명 생성
  // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  // // 보조 조명 Scene에 추가
  // scene.add(ambientLight);

  const clock = new THREE.Clock();

  // 🤹🏻 애니메이션 효과를 포함한 렌더링 함수
  function render() {
    // cube.rotation.x = THREE.MathUtils.degToRad(45); // 각도 설정 시 degree를 radian으로 변환해서 넣어줘야 함! → 3js에 내장된 MathUtils 클래스의 degToRad() 메서드를 이용하면 편하다!
    // cube.rotation.x += 0.01; // 회전: 매 프레임마다 0.01 라디안씩 회전! → 1프레임은 30~60fps로 기기에 따라 다름 ∴ 기계에 따른 오차 범위 큼
    // cube.position.y = Math.sin(cube.rotation.x); // 수직: 1 ~ -1 사이로 왔다갔다 (sin 함수는 항상 1 ~ -1 사이값이니까)
    // cube.scale.x = Math.cos(cube.rotation.x); // 크기: 좌우방향으로 1 ~ -1 사이로 줄었다늘었다 (cos 함수도 항상 1 ~ -1 사이값이니까)
    // cube.rotation.x += Date.now() / 1000; // 회전: 매 프레임마다 0.01 라디안씩 회전!
    // cube.rotation.x = clock.getElapsedTime(); // Clock 인스턴스가 생성된 시점으로부터 경과한 시간을 초단위로 반환
    const elapsedTime = clock.getElapsedTime();

    // cube.rotation.x = elapsedTime; // getDelta가 호출된 뒤 다음 호출까지의 사이 시간을 반환 ∴ 회전할 값을 계속 더해줘야 함
    // cube.rotation.y = elapsedTime; // y축 방향으로도 움직이도록 설정

    // skeleton.rotation.x = elapsedTime * 1.5;
    // skeleton.rotation.y = elapsedTime * 1.5;

    renderer.render(scene, camera); // camera에 설정한 범위 내의 오브젝트들을 scene에 render

    controls.update(); // camera는 update 해줘야 변경사항이 반영된다는 거~ 따라서, render함수와 resise함수 안에서 update 해주기~~!

    requestAnimationFrame(render); // requestAnimationFrame 함수의 파라미터에는 그 다음 차례에 호출할 콜백함수가 들어옴. ∴ 재귀적으로 render함수를 호출
    // 매 프레임마다 콜백함수 호출하는 api
  }

  // > 렌더 함수 호출
  render();

  // 🕹️ 렌더러 사이즈 resize 이벤트 핸들러
  function handleResize() {
    // 📹📦📐도형은 도형기준으로 변경되게끔 카메라 aspect(종횡비) 변경
    camera.aspect = window.innerWidth / window.innerHeight;
    // > 📢📹📦📐 카메라 종횡비(aspect) 변경은 꼭 업데이트 해줘야 반영됨
    camera.updateProjectionMatrix();

    // 🖥️📐 렌더러 resize 이벤트
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 🖥️ 렌더러의 렌더 메서드로 위 사항들 반경하여 다시 렌더되게 호출
    renderer.render(scene, camera);

    controls.update();
  }
  // 👂🏻 resize 이벤트 리스너
  window.addEventListener("resize", handleResize);

  // 🕹️ GUI CONTROLLER ✨
  const gui = new GUI();
  // gui.add(cube.position, "y", -3, 3, 0.1); // 아래와 같이 가독성 높게 작성
  gui.add(cube.position, "y").min(-3).max(3).step(0.1);
  gui.add(cube, "visible");
  gui.addColor(options, "color").onChange((value) => {
    cube.material.color.set(value);
  });
}
