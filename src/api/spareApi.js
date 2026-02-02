// src/api/spareApi.js
export async function replaceSpare(data) {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/spares/replace", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
