import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";

export const ShapeTable = ({ data, onShapeDelete, onShapeRender }) => {
  return (
    <TableContainer
      component={Paper}
      style={{ marginTop: "20px", minWidth: "500px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Shape Type</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.nameId}>
                <TableCell>{row.nameId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.shapeType}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onShapeDelete(row.nameId)}
                    style={{ marginRight: "10px" }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onShapeRender(row.nameId)}
                  >
                    Render
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
