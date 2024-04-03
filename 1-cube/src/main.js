import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

function init() {
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

  //📦 Mesh 오브젝트 생성
  // > 3개의 좌표로 지오메트리 (3D 오브젝트 형체) 생성
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  // > 3js에서 제공하는 내장 Mesh 클래스로 3D 오브젝트의 질감 (Material) 생성
  // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff }); // lights의 영향을 받지 않는 geometry라 light로 음영표현이 안됨
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffa500 // 16진수 넘버타입 hex 코드
    // color: '#ffa500' // 16진수 문자열타입 hex 코드
    // color: 'orange' // 컬러명
    color: new THREE.Color(0xffa500), // 3js에 내장된 Color 클래스 인스턴스
    // transparent: true, // 투명도 설정
    // opacity: 0.5, // 투명도 정도 설정
    // visible: false, // 안 보이게
    // wireframe: true, // Material 골격 확인
    // side: THREE.BackSide, // 보여지는 기준면
  });
  material.color = new THREE.Color(0x00c896); // material 생성 후에 컬러 부여하는 방식도 가능

  // > Mesh 오브젝트 생성✨ (Mesh클래스에 Geometry, Material 전달해서 찍어낸 인스턴스)
  const cube = new THREE.Mesh(geometry, material);
  // Mesh 오브젝트 Scene에 추가
  scene.add(cube);

  // 📹 카메라 포지션 세팅
  // camera.position.z = 5; // 벡터 좌표 하나하나 설정하는 방식
  camera.position.set(3, 4, 5); // 벡터 좌표 한번에 설정하는 방식 (set메서드)
  camera.lookAt(cube.position); // 카메라가 항상 오브젝트를 바라보도록 설정하는 메서드

  // 🔦 주조명 생성
  const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1);
  // 주조명 세팅
  directionalLight.position.set(-1, 2, 3);
  // 주조명 Scene에 추가
  scene.add(directionalLight);
  // 🔦 보조 조명 생성
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  // 보조 조명 Scene에 추가
  scene.add(ambientLight);

  renderer.render(scene, camera); // camera에 설정한 범위 내의 오브젝트들을 scene에 render

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
  }
  // 👂🏻 resize 이벤트 리스너
  window.addEventListener("resize", handleResize);
}
