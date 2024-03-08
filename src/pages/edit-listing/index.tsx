import {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { db } from "../../firebase.config";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "../../components/loading-spinner/Spinner";
import { Data } from "../../components/listing-item/ListingItem";
import { toast } from "react-toastify";

type FormInput = Omit<Data, "imgUrls"> & {
  images: FileList | null;
};

const defaultFormData: FormInput = {
  type: "rent",
  bathrooms: 1,
  bedrooms: 1,
  discountedPrice: 0,
  furnished: false,
  location: "",
  name: "",
  regularPrice: 0,
  geoLocation: { lat: 0, lng: 0 },
  offer: false,
  parking: false,
  userRef: "",
  images: {} as FileList,
};

const EditListing = () => {
  const [listing, setListing] = useState<Data>();
  const [formData, setFormData] = useState<FormInput>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const { listingId } = useParams();
  const isMounted = useRef(true);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser?.uid) {
      toast.error("You can't edit this listing");
      navigate("/");
    }
  }, [auth.currentUser?.uid, listing, navigate]);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else navigate("/");
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  //fetch listing
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "listings", listingId ?? "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data() as Data);
          setFormData(docSnap.data() as FormInput);
          setLoading(false);
        } else {
          toast.error("Could't find the listing");
          setLoading(false);
          navigate("/");
        }
      } catch (error) {
        toast.error("Could't fetch the listing");
        navigate("/");
      }
    };
    fetchListing();
  }, [listingId, navigate]);

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    location,
    offer,
    regularPrice,
    discountedPrice,
    images,
    geoLocation,
  } = formData;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if (images && images.length > 6) {
      setLoading(false);
      toast.error("Max is 6 images");
      return;
    }
    const storeImage = async (image: File) =>
      new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });

    let imgUrls;

    if (images) {
      imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false);
        toast.error("Can't upload images");
        return;
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formDataCopy: any = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    try {
      const docRef = doc(db, "listings", listingId ?? "");
      await updateDoc(docRef, formDataCopy);
      setLoading(false);
      toast.success("Listing has been created");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      toast.error("Could't save the listing");
      setLoading(false);
    }
  };

  const onMutate = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | MouseEvent<HTMLButtonElement>
  ) => {
    let boolean: boolean | null = null;
    const input = e.currentTarget as HTMLInputElement;
    const type = input.type;
    //booleans
    if (type === "button") {
      if (e.currentTarget.value === "true") boolean = true;
      if (e.currentTarget.value === "false") boolean = false;
    }

    //files
    if (type === "file") {
      if (input.files) {
        setFormData((prevData) => ({
          ...prevData,
          images: input.files,
        }));
      }
    }

    if (input.id === "lat" || input.id === "lng") {
      setFormData((prevData) => ({
        ...prevData,
        geoLocation: {
          ...prevData.geoLocation,
          [input.id]: parseFloat(input.value),
        },
      }));
    } else if (!input.files) {
      setFormData((prevData) => ({
        ...prevData,
        [input.id]: boolean ?? input.value,
      }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength={32}
            minLength={10}
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value="true"
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value="false"
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value="true"
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value="false"
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            id="location"
            value={location}
            onChange={onMutate}
            required
          />

          <div className="formLatLng flex">
            <div>
              <label className="formLabel">Latitude</label>
              <input
                className="formInputSmall"
                type="number"
                id="lat"
                value={geoLocation.lat}
                onChange={onMutate}
                required
              />
            </div>
            <div>
              <label className="formLabel">Longitude</label>
              <input
                className="formInputSmall"
                type="number"
                id="lng"
                value={geoLocation.lng}
                onChange={onMutate}
                required
              />
            </div>
          </div>

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value="true"
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value="false"
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditListing;
