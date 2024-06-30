import GUI from "lil-gui";
import { useRef, useEffect, useCallback } from "react";

export const useDebugGui = ({
  selectedShapeMeshInfo,
  setShapes,
  selectedShapeName,
}) => {
  const guiRef = useRef(null);

  const handleRemoveGui = useCallback(() => {
    if (guiRef.current) {
      guiRef.current.destroy();
    }
  }, []);

  const setPositionsToLocalStorage = useCallback(
    ({ targetProperty, targetValue }) => {
      setShapes((prevState) =>
        prevState.map((object) => {
          if (object.nameId === selectedShapeMeshInfo.name) {
            return {
              ...object,
              position: {
                ...object.position,
                [targetProperty]: targetValue,
              },
            };
          }
          return object;
        })
      );
    },
    [selectedShapeMeshInfo, setShapes]
  );

  const setScalesToLocalStorage = useCallback(
    ({ targetProperty, targetValue }) => {
      setShapes((prevState) =>
        prevState.map((object) => {
          if (object.nameId === selectedShapeMeshInfo.name) {
            return {
              ...object,
              scale: {
                ...object.scale,
                [targetProperty]: targetValue,
              },
            };
          }
          return object;
        })
      );
    },
    [selectedShapeMeshInfo, setShapes]
  );

  const setPropertyToLocalStorage = useCallback(
    ({ targetProperty, targetValue }) => {
      setShapes((prevState) =>
        prevState.map((object) => {
          if (object.nameId === selectedShapeMeshInfo.name) {
            return {
              ...object,
              [targetProperty]: targetValue,
            };
          }
          return object;
        })
      );
    },
    [selectedShapeMeshInfo, setShapes]
  );

  useEffect(() => {
    if (selectedShapeMeshInfo) {
      if (guiRef.current) {
        guiRef.current.destroy();
      }

      const gui = new GUI({ title: "Control Panel" });
      gui.domElement.style.position = "absolute";
      gui.domElement.style.left = "0px";

      const nameFolder = gui.addFolder("Info");
      const positionFolder = gui.addFolder("Position");
      const scaleFolder = gui.addFolder("Scale");
      const materialFolder = gui.addFolder("Material");

      positionFolder
        .add(selectedShapeMeshInfo.position, "x")
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
        .add(selectedShapeMeshInfo.position, "y")
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
        .add(selectedShapeMeshInfo.position, "z")
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
        .add(selectedShapeMeshInfo.scale, "x")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setScalesToLocalStorage({ targetProperty: "x", targetValue: value })
        );
      scaleFolder
        .add(selectedShapeMeshInfo.scale, "y")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setScalesToLocalStorage({ targetProperty: "y", targetValue: value })
        );
      scaleFolder
        .add(selectedShapeMeshInfo.scale, "z")
        .min(-10)
        .max(10)
        .step(0.1)
        .onFinishChange((value) =>
          setScalesToLocalStorage({ targetProperty: "z", targetValue: value })
        );

      nameFolder
        .add({ name: selectedShapeName }, "name")
        .onFinishChange((value) =>
          setPropertyToLocalStorage({
            targetProperty: "name",
            targetValue: value,
          })
        );

      materialFolder
        .add(selectedShapeMeshInfo.material, "wireframe")
        .onFinishChange((value) => {
          setPropertyToLocalStorage({
            targetProperty: "wireframe",
            targetValue: value,
          });
        });

      guiRef.current = gui;
    }
  }, [
    selectedShapeMeshInfo,
    setScalesToLocalStorage,
    setPositionsToLocalStorage,
    setPropertyToLocalStorage,
    selectedShapeName,
  ]);

  return { handleRemoveGui };
};
