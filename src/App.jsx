import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import EvaluatorPage from "./pages/EvaluatorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <EvaluatorPage />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </>
  );
}

export default App;