import { useState, useEffect } from "react";
import { TSignUp } from "../sign-up/SignUp";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../../assets/svg/homeIcon.svg";
import {
  Data,
  ListingItem,
  Listings,
} from "../../components/listing-item/ListingItem";

export type TProfile = Omit<TSignUp, "password">;

const Profile = () => {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listings>([]);
  const [profile, setProfile] = useState<TProfile>({
    name: auth.currentUser?.displayName ?? "",
    email: auth.currentUser?.email ?? "",
  });

  const { name, email } = profile;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("userRef", "==", auth.currentUser?.uid),
          orderBy("timestamp", "desc")
        );
        const docSnap = await getDocs(q);
        const listings: Listings = [];
        docSnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data() as Data,
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Could't get your listings");
      }
    };
    fetchUserListings();
  }, [auth.currentUser?.uid]);

  const onLogut = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser && auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
        toast.success("Successfully updated the profile");
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove it?")) {
      try {
        await deleteDoc(doc(db, "listings", id));
        const updatedListings = listings.filter((listing) => listing.id !== id);
        setListings(updatedListings);
        toast.success("Successfully deleted");
      } catch (error) {
        toast.error("Couldn't delete the listing");
      }
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Profile</p>
        <button type="button" className="logOut" onClick={onLogut}>
          Logout
        </button>
      </header>
      <main>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            <p
              className="changePersonalDetails"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prev) => !prev);
              }}
            >
              {changeDetails ? "done" : "change"}
            </p>
          </div>

          <div className="profileCard">
            <form>
              <input
                type="text"
                id="name"
                className={changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
              />
              <input
                type="email"
                id="email"
                className={
                  changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
              />
            </form>
          </div>
          <Link to="/create-listing" className="createListing">
            <img src={homeIcon} alt="home" />
            <p>Sell or rent</p>
            <img src={arrowRight} alt="arrow right" />
          </Link>
        </div>

        {!loading && listings.length > 0 && (
          <>
            <p className="listingText">Your listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  {...listing}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => navigate(`/edit-listing/${listing.id}`)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
