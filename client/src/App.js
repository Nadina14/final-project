import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext"; 
import Home from "./pages/Home/Home.jsx";
import Hotel from "./pages/Hotel/Hotel.jsx";
import List from "./pages/List/List.jsx";
import User from "./components/user/User.jsx";
import RoomForm from "./components/roomForm/RoomForm.jsx";

function App() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={!user ? <User type="signup" /> : <Navigate to="/" />} />
      <Route path="/login" element={!user ? <User type="login" /> : <Navigate to="/" />} />
      <Route path="/hotels" element={<List />} />
      <Route path="/hotels/:id" element={<Hotel />} />
      <Route path="/rooms/:hotelId" element={user && user.isAdmin ? <RoomForm /> : <Navigate to="/" />} />
      <Route path="/rooms/:roomId/hotelId" element={user && user.isAdmin ? <RoomForm /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
