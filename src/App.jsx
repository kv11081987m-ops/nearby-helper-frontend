import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import HelperDashboard from "./pages/HelperDashboard";

function App() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={token ? <Navigate to={`/${user?.role || "user"}`} /> : <Login />}
        />

        {/* USER DASHBOARD */}
        <Route
          path="/user"
          element={token ? <UserDashboard /> : <Navigate to="/login" />}
        />

        {/* HELPER DASHBOARD */}
        <Route
          path="/helper"
          element={token ? <HelperDashboard /> : <Navigate to="/login" />}
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to={token ? `/${user?.role || "user"}` : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
