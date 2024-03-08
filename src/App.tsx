import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { Navbar } from "./components/navbar/Navbar";
import { PrivateRoute } from "./components/private-route/PrivateRoute";
import Explore from "./pages/explore/Explore";
import Category from "./pages/category/Category";
import Offers from "./pages/offers/Offers";
import Profile from "./pages/profile/Profile";
import SignIn from "./pages/sign-in/SignIn";
import SignUp from "./pages/sign-up/SignUp";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import CreateListing from "./pages/create-listing/CreateListing";
import Listing from "./pages/listing";
import Contact from "./pages/contact";
import EditListing from "./pages/edit-listing";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="offers" element={<Offers />} />
          <Route path="category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/edit-listing/:listingId" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/contact/:ownerId" element={<Contact />} />
          <Route path="/*" element={<Navigate to={"/"} replace />} />
        </Routes>

        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
