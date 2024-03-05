import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  startAfter,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import { Spinner } from "../../components/loading-spinner/Spinner";
import {
  ListingItem,
  Listings,
  Data,
} from "../../components/listing-item/ListingItem";
const Category = () => {
  const [listings, setListings] = useState<Listings>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //ref
        const listingsRef = collection(db, "listings");

        //query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
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
  }, [params.categoryName]);

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
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
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
