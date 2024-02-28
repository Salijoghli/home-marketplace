import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";
import { OAuth } from "../../components/oauth/OAuth";
import ArrowRightIcon from "../../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";
import { TSignIn } from "../sign-in/SignIn";

export type TSignUp = TSignIn & {
  name: string;
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<TSignUp>({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, {
          displayName: name,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formDataNoPass: any = { ...formData };
        delete formDataNoPass.password;
        formDataNoPass.timestamp = serverTimestamp();
        await setDoc(doc(db, "users", user.uid), formDataNoPass);
      } else {
        toast.error("Something went wrong");
      }
      navigate("/");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome back!</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />

              <img
                src={visibilityIcon}
                alt="showPassword"
                className="showPassword"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>

            <Link to="forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>

          <OAuth />

          <Link to="/sign-in" className="registerLink">
            sign in instead
          </Link>
        </main>
      </div>
    </>
  );
};

export default SignUp;
