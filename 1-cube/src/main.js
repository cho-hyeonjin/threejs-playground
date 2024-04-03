import * as THREE from "three";

window.addEventListener("load", function () {
  init();
});

function init() {
  // renderer 인스턴스 생성 - renderer.domElement 안에는 (앞으로 만들어질 3D 콘텐츠가 보여질) canvas DOM 요소가 들어 있음. (https://threejs.org/docs/#api/en/renderers/WebGLRenderer.domElement)
  const renderer = new THREE.WebGLRenderer({
    // alpha: true, // 배경 검정색 아니고 투명하게 하려면 true로
    antialias: true, // 이미지 모서리마다 노이즈 또는 계단처럼 느껴지는 질감 없어지게 처리하는 속성
  });

  renderer.setSize(window.innerWidth, window.innerHeight); // canvas를 화면에 꽉 차는 사이즈로 설정

  // renderer.domElement == canvas
  // canvas를 body의 자식요소로 추가
  document.body.appendChild(renderer.domElement);

  // (3D 컨텐츠를 담을) scene 추가
  const scene = new THREE.Scene();

  // camera 추가 - 종류 아주 많음. 여기서는 물체에 대한 원근감을 표현할 수 있는 카메라 'perspective' 카메라 추가

  const camera = new THREE.PerspectiveCamera(
    75, // 시야각(fov, field of view)
    window.innerWidth / window.innerHeight, // 카메라 종횡비
    1, // near
    500 // far
  );

  // 3js는 벡터 좌표로 3D 이미지 구현. 그래서 인자가 3개인 것~
  // geometry는 벡터 좌표에 해당하는 3개의 인자를 이용하여 3D 이미지로 구현해내는 자바스크립트 코드를 추상화한 클래스
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  // camera.position.z = 5;
  camera.position.set(3, 4, 5);

  // 카메라가 항상 오브젝트를 바라보도록 설정하는 메서드
  camera.lookAt(cube.position);

  renderer.render(scene, camera); // camera에 설정한 범위 내의 오브젝트들을 scene에 render
}
