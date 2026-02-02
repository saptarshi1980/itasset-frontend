import { useState } from "react";
import { replaceSpare } from "../api/spareApi";


export default function ReplaceSpare() {
  const [form, setForm] = useState({
    assetNo: "",
    oldSpareId: "",
    newSpareId: "",
    remarks: ""
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await replaceSpare(form);
    alert(res.success ? "Spare Replaced" : res.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Replace Spare</h2>
      <input name="assetNo" placeholder="Asset No" onChange={handleChange} />
      <input name="oldSpareId" placeholder="Old Spare ID" onChange={handleChange} />
      <input name="newSpareId" placeholder="New Spare ID" onChange={handleChange} />
      <input name="remarks" placeholder="Remarks" onChange={handleChange} />
      <button>Replace</button>
    </form>
  );
}
