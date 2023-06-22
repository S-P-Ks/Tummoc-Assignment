import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../store/auth";
import { useLoginMutation } from "../../store/authAPISlice";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const [cookie, setCookie] = useCookies(["jwt"]);

  //   useEffect(() => {
  //     if (cookie) {
  //       navigate("/");
  //     }
  //   }, []);

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const googleAuth = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );
  };

  const auth = useSelector((state) => state.auth);

  const emailLogin = async (e) => {
    console.log(process.env.REACT_APP_API_URL);
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      toast.success("Login Successful!");
    } catch (error) {
      toast.error("Somthing went wrong!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Log in Form</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/login.jpg" alt="login" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Members Log in</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            onChange={(val) => setemail(val.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            onChange={(val) => setpassword(val.target.value)}
          />
          <button className={styles.btn} onClick={emailLogin}>
            Log In
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            <img src="./images/google.png" alt="google icon" />
            <span>Sign in with Google</span>
          </button>
          <p className={styles.text}>
            New Here ? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
