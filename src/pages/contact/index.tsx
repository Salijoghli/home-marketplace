import { useState, useEffect } from "react";
import { Params, useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";

import { TSignUp } from "../sign-up/SignUp";

type Owner = Omit<TSignUp, "password">;

const Contact = () => {
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState<Owner>({
    email: "",
    name: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const { ownerId } = useParams();

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, "users", ownerId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) console.log(docSnap.data());
    };
    getOwner();
  }, [ownerId]);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Owner</p>
      </header>
      {owner !== null && (
        <main>
          <div className="contactLandLord">
            <p className="landLordName">Contact {owner.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <a
              href={`mailto:${owner.email}?Subject=${searchParams.get(
                "listingName"
              )}&bod=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
