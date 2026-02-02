import { useState } from "react";
import { allocateAsset } from "../api/assetApi";

export default function AllocateAsset() {
  const [form, setForm] = useState({
    assetNo: "",
    empCode: "",
    remarks: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.assetNo || !form.empCode) {
      setError("Asset No and Employee Code are mandatory");
      return;
    }

    try {
      setLoading(true);
      const res = await allocateAsset(form);

      if (res.success) {
        setMessage("Asset allocated successfully");
        setForm({ assetNo: "", empCode: "", remarks: "" });
      } else {
        setError(res.error || "Allocation failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>Allocate Asset</h2>

      <input
        name="assetNo"
        placeholder="Asset No"
        value={form.assetNo}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="empCode"
        placeholder="Employee Code"
        value={form.empCode}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="remarks"
        placeholder="Remarks"
        value={form.remarks}
        onChange={handleChange}
      />
      <br /><br />

      <button disabled={loading}>
        {loading ? "Allocating..." : "Allocate"}
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
