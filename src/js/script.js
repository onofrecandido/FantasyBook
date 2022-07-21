import "../style.css";
import "mind-ar/dist/mindar-image-three.prod.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "/targets/book7.mind",
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight("#ffffff", "#bbbbff", 1);
    scene.add(light);

    const book = await loadGLTF("/models/book/scene.gltf");
    const mixer = new THREE.AnimationMixer(book.scene);
    const clips = book.animations;
    console.log(book.animations);
    const action = mixer.clipAction(
      THREE.AnimationClip.findByName(clips, "The Life")
    );

    action.play();
    book.scene.scale.set(0.01, 0.01, 0.01);
    book.scene.position.set(0, 0, 0);

    book.scene.rotation.x = Math.PI * 0.5;
    book.scene.rotation.y = Math.PI * 0.5;

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(book.scene);

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  };
  start();
});

const loadGLTF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
};
