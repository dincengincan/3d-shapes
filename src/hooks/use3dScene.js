import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { useCallback } from "react";

export const use3dScene = () => {
  const renderScene = useCallback(
    ({ displayedShapes, onShapeSelect, onShapeDeselect, canvas }) => {
      if (canvas) {
        const raycaster = new THREE.Raycaster();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          canvas.clientWidth / canvas.clientHeight
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        canvas.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const addTransformControls = () => {
          const transformControls = new TransformControls(
            camera,
            renderer.domElement
          );
          scene.add(transformControls);
        };

        const handleMouseClick = (event) => {
          event.stopPropagation();
          const mouse = new THREE.Vector2();

          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(scene.children, false);

          // handle object click
          if (intersects.length > 0) {
            scene.children.forEach((child) => {
              if (child.type === "Mesh") {
                const color = new THREE.Color(0xffffff);
                child.material.color = color;
              }
            });

            const selectedObject = intersects[0].object;
            const color = new THREE.Color(0xff8f8f);
            selectedObject.material.color = color;

            onShapeSelect(selectedObject);
            return;
          }

          // handle outside click
          if (event.target.tagName === "CANVAS") {
            scene.children.forEach((child) => {
              if (child.type === "Mesh") {
                const color = new THREE.Color(0xffffff);
                child.material.color = color;
              }
              onShapeDeselect();
            });
          }
        };

        const renderScene = () => {
          displayedShapes.forEach((shape, index) => {
            let geometry;
            if (shape.shapeType === "Sphere") {
              geometry = new THREE.SphereGeometry(1, 16, 16);
            } else if (shape.shapeType === "Cylinder") {
              geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
            } else if (shape.shapeType === "Cube") {
              geometry = new THREE.BoxGeometry(1, 1, 1);
            } else if (shape.shapeType === "Cone") {
              geometry = new THREE.ConeGeometry(1, 2, 32);
            }
            const material = new THREE.MeshStandardMaterial();
            material.roughness = 0.4;

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x =
              shape.position.x === undefined ? index * 3 : shape.position.x;
            mesh.position.y = shape.position.y;
            mesh.position.z = shape.position.z;

            mesh.scale.x = shape.scale.x;
            mesh.scale.y = shape.scale.y;
            mesh.scale.z = shape.scale.z;

            mesh.name = shape.nameId;

            mesh.material.color = new THREE.Color(shape.color);
            mesh.material.wireframe = shape.wireframe;

            scene.add(mesh);
          });

          camera.position.z = 5;
          const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };
          animate();
        };

        const addLights = () => {
          const ambientLight = new THREE.AmbientLight(0xffffff, 1);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
          directionalLight.position.set(0, 0, 15);

          const hemisphereLight = new THREE.HemisphereLight(
            0xff0000,
            0x0000ff,
            2
          );

          scene.add(directionalLight);
          scene.add(ambientLight);
          scene.add(hemisphereLight);
        };

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        addTransformControls();
        addLights();
        renderScene();
        addEventListener("mousedown", handleMouseClick);
        addEventListener("resize", handleResize);

        return () => {
          while (canvas && canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
          }

          removeEventListener("mousedown", handleMouseClick);
          onShapeDeselect();
          removeEventListener("resize", handleResize);
        };
      }
    },
    []
  );

  return renderScene;
};
