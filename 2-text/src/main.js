import * as THREE from "three";
// import typeface from 'three/examples/fonts/...' // 매우 많은 타입이 내장되어 있지만 한글은 지원하지 X → typeface generator를 이용하여 typeface json 파일 생성해서 사용할 수 있음!
// three.js 빌트인 클래스 FontLoader 사용
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import typeface from "./assets/fonts/Hakgyoansim Jiugae R_Regular.json";

window.addEventListener("load", function () {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.z = 5;

  /** Font */
  const fontLoader = new FontLoader();

  fontLoader.load(
    "./assets/fonts/Hakgyoansim Jiugae R_Regular.json",
    (font) => {
      console.log("load", font);
    },
    (event) => {
      console.log("progress", event);
    },
    (error) => {
      console.log("error", error);
    }
  );

  const font = fontLoader.parse(typeface);

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
