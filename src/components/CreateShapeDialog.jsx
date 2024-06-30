import { useState } from "react";
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
      <DialogContent sx={{ width: "400px" }}>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Please enter the details for the new shape.
        </DialogContentText>
        <TextField
          sx={{ marginBottom: 1 }}
          required
          autoFocus
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          sx={{ marginBottom: 1 }}
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
      <DialogActions sx={{ paddingX: 3, paddingY: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!shapeType || !name}
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
