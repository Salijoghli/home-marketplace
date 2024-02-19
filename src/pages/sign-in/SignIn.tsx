import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "../../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../../assets/svg/visibilityIcon.svg";

export type SignIn = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignIn>({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome back!</p>
        </header>

        <main>
          <form>
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

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <Link to="/sign-up" className="registerLink">
            sign up instead
          </Link>
        </main>
      </div>
    </>
  );
};

export default SignIn;
