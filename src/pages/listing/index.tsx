import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase.config";
import { Spinner } from "../../components/loading-spinner/Spinner";
import shareIcon from "../../assets/svg/shareIcon.svg";
import { Data } from "../../components/listing-item/ListingItem";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

const defaultListing: Data = {
  bathrooms: 1,
  bedrooms: 1,
  discountedPrice: 0,
  furnished: true,
  geoLocation: { lat: 0, lng: 0 },
  imgUrls: [],
  location: "",
  name: "",
  offer: false,
  parking: true,
  regularPrice: 0,
  type: "rent",
  userRef: "",
};

const Listing = () => {
  const [listing, setListing] = useState<Data>(defaultListing);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const { listingId } = useParams();
  const auth = getAuth();

  const position = listing.geoLocation;

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", listingId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data() as Data);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) return <Spinner />;

  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                height: "100%",
                maxHeight: "400px",
                width: "100%",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Link Copied</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer ? listing.discountedPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">{listing.location}</p>
        <div className="leafletContainer">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
