import GUI from "lil-gui";
import { useRef, useEffect, useCallback } from "react";

export const useDebugGui = ({ selectedObject, setShapes }) => {
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
        })
      );
    },
    [selectedObject, setShapes]
  );

  const setScalesToLocalStorage = useCallback(
    ({ targetProperty, targetValue }) => {
      setShapes((prevState) =>
        prevState.map((object) => {
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
        })
      );
    },
    [selectedObject, setShapes]
  );

  const setPropertToLocalStorage = useCallback(
    ({ targetProperty, targetValue }) => {
      setShapes((prevState) =>
        prevState.map((object) => {
          if (object.nameId === selectedObject.name) {
            return {
              ...object,
              [targetProperty]: targetValue,
            };
          }
          return object;
        })
      );
    },
    [selectedObject, setShapes]
  );

  useEffect(() => {
    if (selectedObject) {
      if (guiRef.current) {
        guiRef.current.destroy();
      }

      const gui = new GUI();
      gui.domElement.style.position = "absolute";
      gui.domElement.style.left = "0px";

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
        .add(selectedObject.material, "wireframe")
        .onFinishChange((value) => {
          setPropertToLocalStorage({
            targetProperty: "wireframe",
            targetValue: value,
          });
        });

      guiRef.current = gui;
    }
  }, [
    selectedObject,
    setScalesToLocalStorage,
    setPositionsToLocalStorage,
    setPropertToLocalStorage,
  ]);

  return { handleRemoveGui };
};
