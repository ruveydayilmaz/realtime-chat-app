import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { useSelector } from "react-redux";
import Chat from "./pages/Chat/Chat";

function App() {
  const user = useSelector((state) => state.authReducer.authData);
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Chat /> : <Navigate to="../auth" />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="../" /> : <Auth />}
      />
      {/* <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      /> */}
    </Routes>
  )
}

export default App
