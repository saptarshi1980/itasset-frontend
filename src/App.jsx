// // import { useState } from "react";   // ✅ ADD THIS
// // import AllocateAsset from "./pages/AllocateAsset";
// // import ReturnAsset from "./pages/ReturnAsset";
// // import ReplaceSpare from "./pages/ReplaceSpare";
// // import Login from "./pages/Login";

// // export default function App() {
// //   const [token, setToken] = useState(localStorage.getItem("token") || null);

// //   if (!token) {
// //     return <Login onLogin={setToken} />;
// //   }

// //   return (
// //     <>
// //       <h2>Welcome to IT Asset Management</h2>
// //       <AllocateAsset />
// //       <ReturnAsset />
// //       <ReplaceSpare />
// //     </>
// //   );
// // }


// import { useState } from "react";
// import AllocateAsset from "./pages/AllocateAsset";
// import ReturnAsset from "./pages/ReturnAsset";
// import ReplaceSpare from "./pages/ReplaceSpare";
// import Login from "./pages/Login";

// export default function App() {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [screen, setScreen] = useState("allocate");

//   if (!token) {
//     return <Login onLogin={setToken} />;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>IT Asset Management</h2>

//       {/* 🔘 Navigation */}
//       <button onClick={() => setScreen("allocate")}>Allocate</button>
//       <button onClick={() => setScreen("return")}>Return</button>
//       <button onClick={() => setScreen("replace")}>Replace</button>

//       <hr />

//       {/* 📄 Screens */}
//       {screen === "allocate" && <AllocateAsset />}
//       {screen === "return" && <ReturnAsset />}
//       {screen === "replace" && <ReplaceSpare />}
//     </div>
//   );
// }




import { useState } from "react";
import Login from "./pages/Login";
import AllocateAsset from "./pages/AllocateAsset";
import ReturnAsset from "./pages/ReturnAsset";
import AssetMaster from "./pages/AssetMaster";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [screen, setScreen] = useState("ALLOCATE");

  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <div>
      {/* -------- MENU -------- */}
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setScreen("ASSET_MASTER")}>
          Asset Master
        </button>

        <button onClick={() => setScreen("ALLOCATE")}>
          Allocate Asset
        </button>

        <button onClick={() => setScreen("RETURN")}>
          Return Asset
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
        >
          Logout
        </button>
      </nav>

      {/* -------- SCREENS -------- */}
      {screen === "ASSET_MASTER" && <AssetMaster />}
      {screen === "ALLOCATE" && <AllocateAsset />}
      {screen === "RETURN" && <ReturnAsset />}
    </div>
  );
}
