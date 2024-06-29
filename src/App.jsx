import { ShapeTable } from "./components/ShapeTable";
import { CreateShapeDialog } from "./components/CreateShapeDialog";
import { Button, Popover, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { IconButton } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import GUI from "lil-gui";

function App() {
  const canvasRef = useRef(null);
  const guiRef = useRef(null);
  const [shapes = [], setShapes] = useLocalStorage("shapes", []);

  const [displayedShapes, setDisplayedShapes] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleShapeDelete = (id) => {
    setShapes((prevState) => prevState.filter((item) => item.nameId !== id));
  };

  const handleShapeRender = (id) => {
    const selectedShape = shapes.filter((item) => item.nameId === id);
    setDisplayedShapes(selectedShape);
  };
  const handleCreate = ({ name, shapeType }) => {
    const nameId = shapes?.length ? shapes[shapes.length - 1].id + 1 : 1;

    setShapes([
      ...shapes,
      {
        nameId,
        name,
        shapeType,
        color: 0xffffff,
        wireframe: false,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    ]);
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

      const transformControls = new TransformControls(
        camera,
        renderer.domElement
      );
      scene.add(transformControls);

      const raycaster = new THREE.Raycaster();

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x00fffc, 1.2);
      directionalLight.position.set(5, 5, 0);
      scene.add(directionalLight);

      const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 2);
      scene.add(hemisphereLight);

      const onMouseClick = (event) => {
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, false);

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

          setSelectedObject(selectedObject);
        } else {
          setSelectedObject(null);
        }
      };

      window.addEventListener("mousedown", onMouseClick);

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

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

          console.log(displayedShapes);

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = shape.position.x;
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

      renderScene();

      return () => {
        while (canvasRef.current && canvasRef.current.firstChild) {
          canvasRef.current.removeChild(canvasRef.current.firstChild);
        }
        if (guiRef.current) {
          guiRef.current.destroy();
        }
      };
    }
  }, [displayedShapes]);

  const setPositionsToLocalStorage = ({ targetProperty, targetValue }) => {
    setShapes((prevState) => {
      return prevState.map((object) => {
        if (object.nameId === selectedObject.name) {
          return {
            ...object,
            position: {
              ...object.position,
              [targetProperty]: targetValue,
            },
          };
        }
        return object;
      });
    });
  };

  const setScalesToLocalStorage = ({ targetProperty, targetValue }) => {
    setShapes((prevState) => {
      return prevState.map((object) => {
        if (object.nameId === selectedObject.name) {
          return {
            ...object,
            scale: {
              ...object.scale,
              [targetProperty]: targetValue,
            },
          };
        }
        return object;
      });
    });
  };

  const setPropertToLocalStorage = ({ targetProperty, targetValue }) => {
    setShapes((prevState) => {
      return prevState.map((object) => {
        if (object.nameId === selectedObject.name) {
          return {
            ...object,
            [targetProperty]: targetValue,
          };
        }
        return object;
      });
    });
  };

  useEffect(() => {
    if (selectedObject) {
      if (guiRef.current) {
        guiRef.current.destroy();
      }
      const gui = new GUI();

      const positionFolder = gui.addFolder("Position");
      const scaleFolder = gui.addFolder("Scale");
      const materialFolder = gui.addFolder("Material");

      positionFolder
        .add(selectedObject.position, "x")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setPositionsToLocalStorage({
            targetProperty: "x",
            targetValue: value,
          })
        );
      positionFolder
        .add(selectedObject.position, "y")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setPositionsToLocalStorage({
            targetProperty: "y",
            targetValue: value,
          })
        );
      positionFolder
        .add(selectedObject.position, "z")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setPositionsToLocalStorage({
            targetProperty: "z",
            targetValue: value,
          })
        );
      scaleFolder
        .add(selectedObject.scale, "x")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setScalesToLocalStorage({ targetProperty: "x", targetValue: value })
        );
      scaleFolder
        .add(selectedObject.scale, "y")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setScalesToLocalStorage({ targetProperty: "y", targetValue: value })
        );
      scaleFolder
        .add(selectedObject.scale, "z")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setScalesToLocalStorage({ targetProperty: "z", targetValue: value })
        );

      materialFolder
        .addColor(selectedObject.material, "color")
        .onFinishChange((value) => {
          setPropertToLocalStorage({
            targetProperty: "color",
            targetValue: value,
          });
        });
      materialFolder
        .add(selectedObject.material, "wireframe")
        .onFinishChange((value) => {
          setPropertToLocalStorage({
            targetProperty: "wireframe",
            targetValue: value,
          });
        });

      guiRef.current = gui;
    }
  }, [selectedObject]);

  if (displayedShapes.length > 0) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
          }}
          color="primary"
          onClick={() => setDisplayedShapes([])}
        >
          <CancelRoundedIcon />
        </IconButton>
        <div
          ref={canvasRef}
          style={{ width: window.innerWidth, height: window.innerHeight }}
        />
      </div>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowDialog(true)}
        sx={{ marginRight: "10px" }}
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
    </>
  );
}

export default App;
