import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import ArrowRightIcon from "../../assets/svg/keyboardArrowRightIcon.svg?react";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email has been sent");
    } catch (error) {
      toast.error("Error sending password reset email");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="emailInput"
          />
          <Link className="forgotPasswordLink" to="/sign-In">
            Sign in
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width={"34px"} height={"34px"} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ForgotPassword;
