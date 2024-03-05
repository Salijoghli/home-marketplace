import { Link } from "react-router-dom";
import DeleteIcon from "../../assets/svg/deleteIcon.svg?react";
import bedIcon from "../../assets//svg/bedIcon.svg";
import bathtubIcon from "../../assets//svg/bathtubIcon.svg";

type Type = "rent" | "sale";

type GeoLocation = {
  lat: number;
  lng: number;
};

export type Data = {
  name: string;
  type: Type;
  userRef: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number;
  location: string;
  geoLocation: GeoLocation;
  imgUrls: Array<string>;
};

export type Listing = {
  id: string;
  data: Data;
  onDelete?: (id: string, name: string) => void;
};

export type Listings = Array<Listing>;

export const ListingItem = ({ data, id, onDelete }: Listing) => {
  return (
    <li className="categoryListing">
      <Link to={`/category/${data.type}/${id}`} className="categoryListingLink">
        <img
          src={data.imgUrls[0]}
          alt={data.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{data.location}</p>
          <p className="categoryListingName">{data.name}</p>
          <p className="categoryListingPrice">
            ${data.offer ? data.discountedPrice : data.regularPrice}
            {data.type === "rent" && "/ Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="bed" />
            <p className="categoryListingInfoText">
              {data.bedrooms > 1 ? `${data.bedrooms} Bedrooms` : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bath" />
            <p className="categoryListingInfoText">
              {data.bathrooms > 1
                ? `${data.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onClick={() => {
            onDelete(id, data.name);
          }}
        />
      )}
    </li>
  );
};
