// 
import { useState } from "react";
import {
  getAssetByAssetNo as fetchAssetByNo,
  getAssetsByEmployee as fetchAssetsByEmployee,
  returnAsset
} from "../api/assetApi";

export default function ReturnAsset() {
  const [mode, setMode] = useState("ASSET"); // "ASSET" | "EMP"
  const [assetNo, setAssetNo] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [assetDetails, setAssetDetails] = useState(null);
  const [assetList, setAssetList] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");

  /* ---------------- Fetch by Asset No ---------------- */
  const handleFetchByAsset = async () => {
    setMessage("");
    try {
      const res = await fetchAssetByNo(assetNo);
      if (!res || Object.keys(res).length === 0) {
        setAssetDetails(null);
        setMessage("Asset not currently allocated");
      } else {
        setAssetDetails(res);
      }
    } catch (err) {
      setAssetDetails(null);
      setMessage(err.message || "Error fetching asset");
    }
  };

  /* ---------------- Fetch by Employee ---------------- */
  const handleFetchByEmployee = async () => {
    setMessage("");
    try {
      const res = await fetchAssetsByEmployee(empCode);
      if (!res || res.length === 0) {
        setAssetList([]);
        setMessage("No assets allocated to this employee");
      } else {
        setAssetList(res);
      }
    } catch (err) {
      setAssetList([]);
      setMessage(err.message || "Error fetching assets");
    }
  };

  /* ---------------- Return Asset ---------------- */
  const handleReturn = async () => {
    const assetToReturn = mode === "ASSET" ? assetNo : selectedAsset;

    if (!assetToReturn) {
      alert("Please select an asset");
      return;
    }

    try {
      const res = await returnAsset({
        assetNo: assetToReturn,
        remarks
      });
      alert("Asset returned successfully");
      resetForm();
    } catch (err) {
      alert(err.message || "Failed to return asset");
    }
  };

  /* ---------------- Reset Form ---------------- */
  const resetForm = () => {
    setAssetNo("");
    setEmpCode("");
    setAssetDetails(null);
    setAssetList([]);
    setSelectedAsset("");
    setRemarks("");
    setMessage("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Return Asset</h2>

      {/* ---------- MODE SELECTION ---------- */}
      <label>
        <input
          type="radio"
          value="ASSET"
          checked={mode === "ASSET"}
          onChange={() => setMode("ASSET")}
        />
        By Asset Number
      </label>

      <label style={{ marginLeft: 20 }}>
        <input
          type="radio"
          value="EMP"
          checked={mode === "EMP"}
          onChange={() => setMode("EMP")}
        />
        By Employee Code
      </label>

      <hr />

      {/* ---------- RETURN BY ASSET ---------- */}
      {mode === "ASSET" && (
        <>
          <input
            placeholder="Asset Number"
            value={assetNo}
            onChange={(e) => setAssetNo(e.target.value)}
          />
          <button onClick={handleFetchByAsset}>Fetch</button>

          {assetDetails && (
            <div style={{ marginTop: 10, border: "1px solid #ccc", padding: 10 }}>
              <p><b>Asset No:</b> {assetDetails.ASSET_NO}</p>
              <p><b>Employee Code:</b> {assetDetails.EMP_CODE}</p>
              <p><b>Allocated On:</b> {new Date(assetDetails.TXN_DATE).toLocaleString()}</p>
              <p><b>Remarks:</b> {assetDetails.REMARKS}</p>
            </div>
          )}
        </>
      )}

      {/* ---------- RETURN BY EMPLOYEE ---------- */}
      {mode === "EMP" && (
        <>
          <input
            placeholder="Employee Code"
            value={empCode}
            onChange={(e) => setEmpCode(e.target.value)}
          />
          <button onClick={handleFetchByEmployee}>Fetch</button>

          {assetList.length > 0 && (
            <ul style={{ marginTop: 10 }}>
              {assetList.map((a) => (
                <li key={a.ASSET_NO}>
                  <label>
                    <input
                      type="radio"
                      name="asset"
                      value={a.ASSET_NO}
                      onChange={() => setSelectedAsset(a.ASSET_NO)}
                    />
                    {a.ASSET_NO} | {a.TXN_TYPE} | {new Date(a.TXN_DATE).toLocaleString()}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <br />
      <input
        placeholder="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />
      <button onClick={handleReturn}>Return Asset</button>

      {message && <p style={{ color: "red", marginTop: 10 }}>{message}</p>}
    </div>
  );
}
