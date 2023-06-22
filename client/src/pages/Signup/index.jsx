import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSignUpMutation } from "../../store/authAPISlice";
import { setCredentials } from "../../store/auth";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Signup() {
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const [cookie, setCookie] = useCookies(["jwt"]);

  const dispatch = useDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();

  const auth = useSelector((state) => state.auth);

  const handlesignUp = async () => {
    try {
      const res = await signUp({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Sign Up successfull!");
    } catch (error) {
      toast.error("Somthing went wrong!");
    }
  };

  const googleAuth = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign up Form</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/signup.jpg" alt="signup" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Create Account</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            onChange={(e) => setname(e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <button className={styles.btn} onClick={handlesignUp}>
            Sign Up
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            <img src="./images/google.png" alt="google icon" />
            <span>Sing up with Google</span>
          </button>
          <p className={styles.text}>
            Already Have Account ? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
