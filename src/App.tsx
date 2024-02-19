import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/navbar/Navbar";
import Explore from "./pages/explore/Explore";
import Offers from "./pages/offers/Offers";
import Profile from "./pages/profile/Profile";
import SignIn from "./pages/sign-in/SignIn";
import SignUp from "./pages/sign-up/SignUp";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="offers" element={<Offers />} />
          <Route path="/profile" element={<SignIn />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>
    </>
  );
}

export default App;
