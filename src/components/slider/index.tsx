import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, limit, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Spinner } from "../loading-spinner/Spinner";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Data, Listings } from "../listing-item/ListingItem";
import { toast } from "react-toastify";
export const Slider = () => {
  const [listings, setListings] = useState<Listings>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
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
        toast.error("Couldn't fetch the listings");
      }
    };
    fetchListings();
  }, []);
  if (loading) return <Spinner />;

  return (
    listings.length > 0 && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <img
                src={data.imgUrls[0]}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  maxHeight: "300px",
                  width: "100%",
                }}
              />
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                {data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / Month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};
