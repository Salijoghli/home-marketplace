import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import { Spinner } from "../../components/loading-spinner/Spinner";
import {
  ListingItem,
  Listings,
  Data,
} from "../../components/listing-item/ListingItem";
const Offers = () => {
  const [listings, setListings] = useState<Listings>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //ref
        const listingsRef = collection(db, "listings");

        //query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc")
          // limit(10)
        );
        const querySnap = await getDocs(q);
        const listings: Listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data() as Data,
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Couldn't fetch a data");
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} {...listing} />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No current offers</p>
      )}
    </div>
  );
};

export default Offers;
