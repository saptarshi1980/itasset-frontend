import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

import { createAsset, updateAsset, listAssets } from "../api/assetApi";

export default function AssetMaster() {
  const [form, setForm] = useState({
    assetNo: "",
    assetType: "",
    model: "",
    serialNo: "",
    status: "AVAILABLE"
  });

  const [editMode, setEditMode] = useState(false);
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch assets from server
  const fetchAssets = async () => {
    try {
      const allAssets = await listAssets();
      setAssets(Array.isArray(allAssets) ? allAssets : []);
    } catch (err) {
      console.error("Failed to load assets", err);
      setAssets([]);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "assetNo") value = value.toUpperCase();
    setForm({ ...form, [e.target.name]: value });
  };

  const handleEdit = (asset) => {
    setForm({
      assetNo: asset.assetNo,
      assetType: asset.assetType,
      model: asset.model || "",
      serialNo: asset.serialNo || "",
      status: asset.status
    });
    setEditMode(true);
  };

  const resetForm = () => {
    setForm({
      assetNo: "",
      assetType: "",
      model: "",
      serialNo: "",
      status: "AVAILABLE"
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateAsset(form.assetNo, form);
        setMessage("Asset updated successfully!");
      } else {
        await createAsset(form);
        setMessage("Asset created successfully!");
      }
      resetForm();
      fetchAssets();
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error saving asset");
    }
  };

  // Filtered & paginated assets
  const filteredAssets = assets.filter(
    (a) =>
      a.assetNo.toLowerCase().includes(search.toLowerCase()) ||
      (a.assetType || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / pageSize);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Asset Master
      </Typography>

      {/* ---------- Form ---------- */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Asset Number"
              name="assetNo"
              value={form.assetNo}
              onChange={handleChange}
              fullWidth
              required
              disabled={editMode} // prevent changing assetNo on edit
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Asset Type"
              name="assetType"
              value={form.assetType}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Serial No"
              name="serialNo"
              value={form.serialNo}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="AVAILABLE">Available</MenuItem>
              <MenuItem value="ALLOCATED">Allocated</MenuItem>
              <MenuItem value="RETURNED">Returned</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" type="submit">
              {editMode ? "Update Asset" : "Create Asset"}
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={resetForm}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

      {message && <Typography color="primary" sx={{ mb: 2 }}>{message}</Typography>}

      {/* ---------- Search ---------- */}
      <TextField
        label="Search by Asset No / Type"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* ---------- Asset Table ---------- */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Asset No</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Serial No</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAssets.map((a) => (
            <TableRow key={a.assetNo}>
              <TableCell>{a.assetNo}</TableCell>
              <TableCell>{a.assetType}</TableCell>
              <TableCell>{a.model}</TableCell>
              <TableCell>{a.serialNo}</TableCell>
              <TableCell>{a.status}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleEdit(a)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {paginatedAssets.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No assets found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ---------- Pagination Controls ---------- */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Typography sx={{ mt: 1 }}>
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
}



















// // // // import { useState, useEffect } from "react";
// // // // import { createAsset, updateAsset, listAssets } from "../api/assetApi";

// // // // export default function AssetMaster() {
// // // //   const [form, setForm] = useState({
// // // //     assetNo: "",
// // // //     assetType: "",
// // // //     brand: "",
// // // //     model: "",
// // // //     serialNo: "",
// // // //     purchaseDate: "",
// // // //     warrantyExp: "",
// // // //     status: "AVAILABLE",
// // // //     remarks: ""
// // // //   });
// // // //   const [message, setMessage] = useState("");
// // // //   const [assets, setAssets] = useState([]);
// // // //   const [editMode, setEditMode] = useState(false);

// // // //   // ---------- Pagination ----------
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const pageSize = 5;

// // // //   // ---------- Search ----------
// // // //   const [search, setSearch] = useState("");

// // // //   useEffect(() => {
// // // //     fetchAssets();
// // // //   }, []);

// // // //   const fetchAssets = async () => {
// // // //   try {
// // // //     const allAssets = await listAssets();
// // // //     setAssets(Array.isArray(allAssets) ? allAssets : []);
// // // //   } catch (err) {
// // // //     console.error("Failed to load assets", err);
// // // //     setAssets([]);
// // // //   }
// // // // };

// // // //   const handleChange = (e) => {
// // // //     let value = e.target.value;
// // // //     if (e.target.name === "assetNo") value = value.toUpperCase(); // auto uppercase
// // // //     setForm({ ...form, [e.target.name]: value });
// // // //   };

// // // //  const handleEdit = (asset) => {
// // // //   setForm({
// // // //     assetNo: asset.assetNo,
// // // //     assetType: asset.assetType,
// // // //     brand: asset.brand || "",
// // // //     model: asset.model || "",
// // // //     serialNo: asset.serialNo || "",
// // // //     purchaseDate: asset.purchaseDate?.slice(0, 10) || "",
// // // //     warrantyExp: asset.warrantyExp?.slice(0, 10) || "",
// // // //     status: asset.status,
// // // //     remarks: asset.remarks || ""
// // // //   });
// // // //   setEditMode(true);
// // // // };

// // // //   const validateForm = () => {
// // // //     if (!form.assetNo.trim()) return "Asset Number is required";
// // // //     if (!form.assetType.trim()) return "Asset Type is required";
// // // //     if (!editMode && assets.some(a => a.assetNo === form.assetNo)) {
// // // //       return "Asset Number already exists";
// // // //     }
// // // //     return null;
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     const error = validateForm();
// // // //     if (error) {
// // // //       setMessage(error);
// // // //       return;
// // // //     }
// // // //     try {
// // // //       if (editMode) {
// // // //         await updateAsset(form.assetNo, form);
// // // //         setMessage("Asset updated successfully!");
// // // //       } else {
// // // //         await createAsset(form);
// // // //         setMessage("Asset created successfully!");
// // // //       }
// // // //       resetForm();
// // // //       fetchAssets();
// // // //     } catch (err) {
// // // //       setMessage(err.message);
// // // //     }
// // // //   };

// // // //   const resetForm = () => {
// // // //     setForm({
// // // //       assetNo: "",
// // // //       assetType: "",
// // // //       brand: "",
// // // //       model: "",
// // // //       serialNo: "",
// // // //       purchaseDate: "",
// // // //       warrantyExp: "",
// // // //       status: "AVAILABLE",
// // // //       remarks: ""
// // // //     });
// // // //     setEditMode(false);
// // // //   };

// // // //   // ---------- Search & Pagination Helpers ----------
// // // //   const filteredAssets = Array.isArray(assets)
// // // //   ? assets.filter(a =>
// // // //       a.assetNo?.includes(search.toUpperCase()) ||
// // // //       (a.assetType || "").toLowerCase().includes(search.toLowerCase())
// // // //     )
// // // //   : [];


// // // //   const totalPages = Math.ceil(filteredAssets.length / pageSize);
// // // //   const paginatedAssets = filteredAssets.slice(
// // // //     (currentPage - 1) * pageSize,
// // // //     currentPage * pageSize
// // // //   );

// // // //   return (
// // // //     <div style={{ maxWidth: 700 }}>
// // // //       <h2>Asset Master</h2>

// // // //       {/* ---------- Form ---------- */}
// // // //       <form onSubmit={handleSubmit}>
// // // //         <input
// // // //           name="assetNo"
// // // //           placeholder="Asset No"
// // // //           value={form.assetNo}
// // // //           onChange={handleChange}
// // // //           required
// // // //         />
// // // //         <input
// // // //           name="assetType"
// // // //           placeholder="Asset Type"
// // // //           value={form.assetType}
// // // //           onChange={handleChange}
// // // //           required
// // // //         />
// // // //         <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
// // // //         <input name="model" placeholder="Model" value={form.model} onChange={handleChange} />
// // // //         <input name="serialNo" placeholder="Serial No" value={form.serialNo} onChange={handleChange} />
// // // //         <input name="purchaseDate" type="date" value={form.purchaseDate} onChange={handleChange} />
// // // //         <input name="warrantyExp" type="date" value={form.warrantyExp} onChange={handleChange} />
// // // //         <select name="status" value={form.status} onChange={handleChange}>
// // // //           <option value="AVAILABLE">Available</option>
// // // //           <option value="ALLOCATED">Allocated</option>
// // // //           <option value="RETURNED">Returned</option>
// // // //         </select>
// // // //         <input name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} />
// // // //         <button type="submit">{editMode ? "Update Asset" : "Create Asset"}</button>
// // // //       </form>

// // // //       {message && <p style={{ color: editMode ? "blue" : "red" }}>{message}</p>}

// // // //       <hr />
// // // //       <h3>Existing Assets</h3>

// // // //       {/* ---------- Search Box ---------- */}
// // // //       <input
// // // //         placeholder="Search by Asset No or Type"
// // // //         value={search}
// // // //         onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
// // // //         style={{ marginBottom: 10, width: "50%" }}
// // // //       />

// // // //       {/* ---------- Paginated Asset List ---------- */}
// // // //       <ul>
// // // //         {paginatedAssets.map((a) => (
// // // //           <li key={a.assetNo}>
// // // //             {a.assetNo} | {a.assetType} | {a.status}

// // // //             <button onClick={() => handleEdit(a)} style={{ marginLeft: 10 }}>Edit</button>
// // // //           </li>
// // // //         ))}
// // // //       </ul>

// // // //       {/* ---------- Pagination Controls ---------- */}
// // // //       <div style={{ marginTop: 10 }}>
// // // //         <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
// // // //           Prev
// // // //         </button>
// // // //         <span style={{ margin: "0 10px" }}>Page {currentPage} of {totalPages}</span>
// // // //         <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
// // // //           Next
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }


// // // import {
// // //   Box,
// // //   Paper,
// // //   TextField,
// // //   Button,
// // //   Grid,
// // //   Typography,
// // //   MenuItem
// // // } from "@mui/material";

// // // <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
// // //   <Typography variant="h5" gutterBottom>
// // //     Asset Master
// // //   </Typography>

// // //   <Box component="form" onSubmit={handleSubmit}>
// // //     <Grid container spacing={2}>
// // //       <Grid item xs={12} sm={6}>
// // //         <TextField
// // //           label="Asset Number"
// // //           name="assetNo"
// // //           value={form.assetNo}
// // //           onChange={handleChange}
// // //           fullWidth
// // //           required
// // //         />
// // //       </Grid>

// // //       <Grid item xs={12} sm={6}>
// // //         <TextField
// // //           label="Asset Type"
// // //           name="assetType"
// // //           value={form.assetType}
// // //           onChange={handleChange}
// // //           fullWidth
// // //           required
// // //         />
// // //       </Grid>

// // //       <Grid item xs={12} sm={6}>
// // //         <TextField
// // //           label="Model"
// // //           name="model"
// // //           value={form.model}
// // //           onChange={handleChange}
// // //           fullWidth
// // //         />
// // //       </Grid>

// // //       <Grid item xs={12} sm={6}>
// // //         <TextField
// // //           label="Serial No"
// // //           name="serialNo"
// // //           value={form.serialNo}
// // //           onChange={handleChange}
// // //           fullWidth
// // //         />
// // //       </Grid>

// // //       <Grid item xs={12} sm={6}>
// // //         <TextField
// // //           select
// // //           label="Status"
// // //           name="status"
// // //           value={form.status}
// // //           onChange={handleChange}
// // //           fullWidth
// // //         >
// // //           <MenuItem value="AVAILABLE">Available</MenuItem>
// // //           <MenuItem value="ALLOCATED">Allocated</MenuItem>
// // //           <MenuItem value="RETURNED">Returned</MenuItem>
// // //         </TextField>
// // //       </Grid>

// // //       <Grid item xs={12}>
// // //         <Button variant="contained" type="submit">
// // //           {editMode ? "Update Asset" : "Create Asset"}
// // //         </Button>
// // //       </Grid>
// // //     </Grid>
// // //   </Box>
// // // </Paper>


// // import { useState, useEffect } from "react";
// // import { useLocation } from "react-router-dom";
// // import {
// //   Box,
// //   Paper,
// //   TextField,
// //   Button,
// //   Grid,
// //   Typography,
// //   MenuItem
// // } from "@mui/material";

// // import { createAsset, updateAsset, listAssets } from "../api/assetApi";

// // export default function AssetMaster() {
// //   const [form, setForm] = useState({
// //     assetNo: "",
// //     assetType: "",
// //     model: "",
// //     serialNo: "",
// //     status: "AVAILABLE"
// //   });

// //   const [editMode, setEditMode] = useState(false);

// //   const handleChange = (e) => {
// //     let value = e.target.value;
// //     if (e.target.name === "assetNo") value = value.toUpperCase();
// //     setForm({ ...form, [e.target.name]: value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (editMode) {
// //       await updateAsset(form.assetNo, form);
// //     } else {
// //       await createAsset(form);
// //     }
// //   };

// //   return (
// //     <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
// //       <Typography variant="h5" gutterBottom>
// //         Asset Master
// //       </Typography>

// //       <Box component="form" onSubmit={handleSubmit}>
// //         <Grid container spacing={2}>
// //           <Grid item xs={12} sm={6}>
// //             <TextField
// //               label="Asset Number"
// //               name="assetNo"
// //               value={form.assetNo}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //             />
// //           </Grid>

// //           <Grid item xs={12} sm={6}>
// //             <TextField
// //               label="Asset Type"
// //               name="assetType"
// //               value={form.assetType}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //             />
// //           </Grid>

// //           <Grid item xs={12} sm={6}>
// //             <TextField
// //               label="Model"
// //               name="model"
// //               value={form.model}
// //               onChange={handleChange}
// //               fullWidth
// //             />
// //           </Grid>

// //           <Grid item xs={12} sm={6}>
// //             <TextField
// //               label="Serial No"
// //               name="serialNo"
// //               value={form.serialNo}
// //               onChange={handleChange}
// //               fullWidth
// //             />
// //           </Grid>

// //           <Grid item xs={12} sm={6}>
// //             <TextField
// //               select
// //               label="Status"
// //               name="status"
// //               value={form.status}
// //               onChange={handleChange}
// //               fullWidth
// //             >
// //               <MenuItem value="AVAILABLE">Available</MenuItem>
// //               <MenuItem value="ALLOCATED">Allocated</MenuItem>
// //               <MenuItem value="RETURNED">Returned</MenuItem>
// //             </TextField>
// //           </Grid>

// //           <Grid item xs={12}>
// //             <Button variant="contained" type="submit">
// //               {editMode ? "Update Asset" : "Create Asset"}
// //             </Button>
// //           </Grid>
// //         </Grid>
// //       </Box>
// //     </Paper>
// //   );
// // }







// import { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   TextField,
//   Button,
//   Grid,
//   Typography,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow
// } from "@mui/material";

// import { createAsset, updateAsset, listAssets } from "../api/assetApi";

// export default function AssetMaster() {
//   const [form, setForm] = useState({
//     assetNo: "",
//     assetType: "",
//     model: "",
//     serialNo: "",
//     status: "AVAILABLE"
//   });

//   const [editMode, setEditMode] = useState(false);
//   const [assets, setAssets] = useState([]);
//   const [message, setMessage] = useState("");

//   // ---------- Fetch assets ----------
//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   const fetchAssets = async () => {
//     try {
//       const allAssets = await listAssets();
//       setAssets(Array.isArray(allAssets) ? allAssets : []);
//     } catch (err) {
//       console.error("Failed to load assets", err);
//       setAssets([]);
//     }
//   };

//   // ---------- Form Handlers ----------
//   const handleChange = (e) => {
//     let value = e.target.value;
//     if (e.target.name === "assetNo") value = value.toUpperCase();
//     setForm({ ...form, [e.target.name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMode) {
//         await updateAsset(form.assetNo, form);
//         setMessage("Asset updated successfully!");
//       } else {
//         await createAsset(form);
//         setMessage("Asset created successfully!");
//       }
//       resetForm();
//       fetchAssets();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       assetNo: "",
//       assetType: "",
//       model: "",
//       serialNo: "",
//       status: "AVAILABLE"
//     });
//     setEditMode(false);
//   };

//   const handleEdit = (asset) => {
//     setForm({
//       assetNo: asset.assetNo,
//       assetType: asset.assetType,
//       model: asset.model || "",
//       serialNo: asset.serialNo || "",
//       status: asset.status
//     });
//     setEditMode(true);
//   };

//   // ---------- Render ----------
//   return (
//     <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
//       <Typography variant="h5" gutterBottom>
//         Asset Master
//       </Typography>

//       {/* ---------- Form ---------- */}
//       <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Asset Number"
//               name="assetNo"
//               value={form.assetNo}
//               onChange={handleChange}
//               fullWidth
//               required
//               disabled={editMode} // cannot edit assetNo in edit mode
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Asset Type"
//               name="assetType"
//               value={form.assetType}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Model"
//               name="model"
//               value={form.model}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Serial No"
//               name="serialNo"
//               value={form.serialNo}
//               onChange={handleChange}
//               fullWidth
//             />
//           </Grid>

//           <Grid item xs={12} sm={6}>
//             <TextField
//               select
//               label="Status"
//               name="status"
//               value={form.status}
//               onChange={handleChange}
//               fullWidth
//             >
//               <MenuItem value="AVAILABLE">Available</MenuItem>
//               <MenuItem value="ALLOCATED">Allocated</MenuItem>
//               <MenuItem value="RETURNED">Returned</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid item xs={12}>
//             <Button variant="contained" type="submit">
//               {editMode ? "Update Asset" : "Create Asset"}
//             </Button>
//             <Button
//               variant="outlined"
//               sx={{ ml: 2 }}
//               onClick={resetForm}
//             >
//               Reset
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>

//       {message && <Typography color="primary">{message}</Typography>}

//       {/* ---------- Asset List ---------- */}
//       <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
//         Existing Assets
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Asset No</TableCell>
//               <TableCell>Asset Type</TableCell>
//               <TableCell>Model</TableCell>
//               <TableCell>Serial No</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Edit</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {assets.map((a) => (
//               <TableRow key={a.assetNo}>
//                 <TableCell>{a.assetNo}</TableCell>
//                 <TableCell>{a.assetType}</TableCell>
//                 <TableCell>{a.model}</TableCell>
//                 <TableCell>{a.serialNo}</TableCell>
//                 <TableCell>{a.status}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     onClick={() => handleEdit(a)}
//                   >
//                     Edit
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// }
