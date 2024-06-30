import { ShapeTable } from "./components/ShapeTable";
import { CreateShapeDialog } from "./components/CreateShapeDialog";
import { Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { use3dScene } from "./hooks/use3dScene";
import { useDebugGui } from "./hooks/useDebugGui";
import { IconButton } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

function App() {
  const canvasRef = useRef(null);

  const [shapes = [], setShapes] = useLocalStorage("shapes", []);

  const [displayedShapes, setDisplayedShapes] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedShapeMeshInfo, setSelectedShapeMeshInfo] = useState(null);

  const selectedDisplayedShape = displayedShapes?.find(
    (shape) => shape.nameId === selectedShapeMeshInfo?.name
  );

  const { handleRemoveGui } = useDebugGui({
    selectedShapeName: selectedDisplayedShape?.name,
    setShapes,
    selectedShapeMeshInfo,
  });
  const renderScene = use3dScene();

  useEffect(() => {
    const cleanup = renderScene({
      canvas: canvasRef.current,
      displayedShapes,
      onShapeSelect: setSelectedShapeMeshInfo,
      onShapeDeselect: () => {
        setSelectedShapeMeshInfo(null);
        handleRemoveGui();
      },
    });

    return cleanup;
  }, [renderScene, displayedShapes, setSelectedShapeMeshInfo, handleRemoveGui]);

  const handleShapeDelete = (id) => {
    setShapes((prevState) => prevState.filter((item) => item.nameId !== id));
  };

  const handleShapeRender = (id) => {
    const selectedShape = shapes.filter((item) => item.nameId === id);
    setDisplayedShapes(selectedShape);
  };
  const handleCreate = ({ name, shapeType }) => {
    const nameId = shapes?.length ? shapes[shapes.length - 1].nameId + 1 : 1;

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
          onClick={() => {
            setDisplayedShapes([]);
            handleRemoveGui();
          }}
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
