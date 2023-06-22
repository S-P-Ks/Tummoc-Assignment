import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.module.css";
import axios from "axios";
import { setCredentials } from "../../store/auth";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { toast } from "react-hot-toast";

function Home() {
  //   const user = userDetails.user;

  const auth = useSelector((state) => state.auth);
  const currcities = useSelector((state) => state.cities);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileUpload, setfileUpload] = useState(null);

  const [cookie, setCookie, removeCookie] = useCookies(["jwt"]);

  const logout = async () => {
    await axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
    removeCookie("jwt");
    // console.log("CWW");
    dispatch(setCredentials({ user: null, token: null }));
  };

  useEffect(() => {
    // getUser();
  }, []);

  const uploadFile = async () => {
    let formData = new FormData();
    formData.append("file", fileUpload);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("file added successfully !");
      })
      .catch((err) => {
        toast.error("Somthing went wrong!");
      });
  };

  // console.log(auth.user.name);

  const s = useSelector((state) => state);
  const getCities = async () => {
    setIsOpen(true);
  };

  const [isOpen, setIsOpen] = useState(false);

  const addCities = async (cities) => {
    console.log(process.env.REACT_APP_API_URL);
    await axios
      .post(`${process.env.REACT_APP_API_URL}/city`, cities, {
        withCredentials: true,
      })
      .then((res) => {
        navigate(0);
        toast.success("Cities added successfully !");
      })
      .catch((err) => {
        toast.error("Somthing went wrong!");
      });
  };

  return (
    <div>
      <h1 className={styles.heading}>Home</h1>

      <div>
        <h2>Profile</h2>
        <div>{auth.user != null && auth.user.name}</div>
        <div>{auth.user != null && auth.user.email}</div>
        <h2>File Upload</h2>
        <input
          type="file"
          name="imgUpload"
          onChange={(e) => {
            console.log(e.target.files[0]);
            setfileUpload(e.target.files[0]);
          }}
        />
        <div onClick={uploadFile} style={{ cursor: "pointer" }}>
          Upload File
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2>Cities</h2>
          <div style={{ cursor: "pointer" }} onClick={getCities}>
            Add Cities
          </div>
        </div>

        {isOpen && (
          <Modal
            setIsOpen={setIsOpen}
            selectedCities={auth.user.cities}
            isOpen={isOpen}
            addCities={addCities}
          />
        )}

        <div>
          {auth.user.cities.map((city) => (
            <div key={city._id}>{city.name}</div>
          ))}
        </div>

        <button className={styles.btn} onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Home;
