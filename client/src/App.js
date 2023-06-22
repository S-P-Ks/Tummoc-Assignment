import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useCookies } from "react-cookie";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./store/auth";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [cookie, setCookie] = useCookies(["jwt"]);

  const getUser = async () => {
    try {
      setisLoading(true);

      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;

      const { data } = await axios
        .get(url, { withCredentials: true })
        .finally(() => {
          setisLoading(false);
        });

      // console.log(res);

      dispatch(setCredentials({ ...data }));

      setisLoading(false);
      //   setUser(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <Toaster />
      <Routes>
        <Route
          exact
          path="/"
          element={auth.user ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/login"
          element={auth.user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={auth.user ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </div>
  );
}

export default App;
