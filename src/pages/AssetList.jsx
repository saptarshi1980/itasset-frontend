import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Paper, Typography } from "@mui/material";
import { listAssets } from "../api/assetApi";
import { useNavigate } from "react-router-dom";

export default function AssetList() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const data = await listAssets();
    setRows(Array.isArray(data) ? data : []);
  };

  const columns = [
    { field: "assetNo", headerName: "Asset No", flex: 1 },
    { field: "assetType", headerName: "Type", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
    { field: "serialNo", headerName: "Serial No", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            navigate("/assets/master", { state: params.row })
          }
        >
          Edit
        </Button>
      )
    }
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Asset List
      </Typography>

      <div style={{ height: 450 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.assetNo}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </Paper>
  );
}
