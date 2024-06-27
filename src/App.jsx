import "./App.css";
import { ShapeTable } from "./components/ShapeTable";
import { CreateShapeDialog } from "./components/CreateShapeDialog";
import { Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function App() {
  const canvasRef = useRef(null);

  const [shapes, setShapes] = useLocalStorage("shapes", []);
  const [showDialog, setShowDialog] = useState(false);
  const [displayedShapes, setDisplayedShapes] = useState([]);

  const handleShapeDelete = (id) => {
    setShapes((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handleShapeRender = (id) => {
    const selectedShape = shapes.filter((item) => item.id === id);
    setDisplayedShapes(selectedShape);
  };
  const handleCreate = ({ name, shapeType }) => {
    const newId = shapes.length ? shapes[shapes.length - 1].id + 1 : 1;
    setShapes([...shapes, { id: newId, name, shapeType }]);
  };

  const handleRenderAll = () => {
    setDisplayedShapes(shapes);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        canvasRef.current.clientWidth / canvasRef.current.clientHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      );
      canvasRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.maxPolarAngle = Math.PI / 2;

      // const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
      // ambientLight.intensity = 10;
      // scene.add(ambientLight);

      // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

      // directionalLight.position.set(1, 1, 1).normalize();
      // scene.add(directionalLight);

      const renderScene = () => {
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        displayedShapes.forEach((shape, index) => {
          let geometry;
          if (shape.shapeType === "Sphere") {
            geometry = new THREE.SphereGeometry(1, 32, 32);
          } else if (shape.shapeType === "Cylinder") {
            geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
          } else if (shape.shapeType === "Cube") {
            geometry = new THREE.BoxGeometry(1, 1, 1);
          } else if (shape.shapeType === "Cone") {
            geometry = new THREE.ConeGeometry(1, 2, 32);
          }
          const material = new THREE.MeshMatcapMaterial({ color: 0x00ffff });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = index * 3;
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

      renderScene();

      return () => {
        while (canvasRef.current.firstChild) {
          canvasRef.current.removeChild(canvasRef.current.firstChild);
        }
      };
    }
  }, [displayedShapes]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowDialog(true)}
        style={{ marginRight: "10px" }}
      >
        Create
      </Button>
      <Button variant="contained" color="secondary" onClick={handleRenderAll}>
        Render
      </Button>
      <ShapeTable
        data={shapes}
        onShapeDelete={handleShapeDelete}
        onShapeRender={handleShapeRender}
      />

      <CreateShapeDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onCreate={handleCreate}
      />
      <div
        ref={canvasRef}
        style={{ width: "100%", height: "500px", marginTop: "20px" }}
      />
    </>
  );
}

export default App;
