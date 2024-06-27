import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const shapeOptions = ["Sphere", "Cylinder", "Cube", "Cone"];

export function CreateShapeDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [shapeType, setShapeType] = useState("");

  const handleCreate = () => {
    onCreate({ name, shapeType });
    setName("");
    setShapeType("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Shape</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the details for the new shape.
        </DialogContentText>
        <TextField
          required
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          required
          margin="dense"
          label="Shape Type"
          fullWidth
          value={shapeType}
          onChange={(e) => setShapeType(e.target.value)}
        >
          {shapeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          disabled={!shapeType || !name}
          onClick={handleCreate}
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
