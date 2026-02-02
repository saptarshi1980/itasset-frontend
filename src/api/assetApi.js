const BASE_URL = "http://localhost:3000/api/assets";

function authHeader() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  };
}

export async function allocateAsset(data) {
  const res = await fetch(`${BASE_URL}/allocate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function returnAsset(data) {
  const res = await fetch(`${BASE_URL}/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getAssetByAssetNo(assetNo) {
  const res = await fetch(`${BASE_URL}/current/${assetNo}`);
  return res.json();
}

export async function getAssetsByEmployee(empCode) {
  const res = await fetch(`${BASE_URL}/by-employee/${empCode}`);
  return res.json();
}

export async function createAsset(data) {
  const res = await fetch(`${BASE_URL}/master`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateAsset(assetNo, data) {
  const res = await fetch(`${BASE_URL}/master/${assetNo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function listAssets() {
  const res = await fetch(`${BASE_URL}/master`);
  return res.json();
}