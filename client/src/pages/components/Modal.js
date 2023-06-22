import React, { useCallback } from "react";
import styles from "./modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import { useEffect, useState, useReducer, useRef } from "react";
import Modal1 from "react-modal";
import InfiniteScroll from "react-infinite-scroller";

const Modal = ({ setIsOpen, isOpen, selectedCities, addCities }) => {
  const initialized = useRef(false);
  const [isLastPage, setisLastPage] = useState(false);

  const [cities, setcities] = useState([]);
  const [page, setpage] = useState(0);

  const [sCity, setsCity] = useState([]);

  const limit = 10;

  const fetchCities = async (type) => {
    if (isLastPage) {
      return;
    }

    if (type === "Previous") {
      setpage(page - 1);
    } else if (type === "Next") {
      setpage(page + 1);
    }

    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/city?page=${
        type === "Previous" ? page - 1 : page + 1
      }&limit=${limit}`
    );

    if (data.length < limit) {
      setisLastPage(true);
    }
    setcities([...data]);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchCities("Next");
    }

    var s = selectedCities.map((sc) => sc._id);

    setsCity([...sCity, ...s]);
  }, [isOpen]);

  const onSelect = (idx) => {
    if (sCity.includes(cities[idx]._id)) {
      let c = sCity.filter((c) => c != cities[idx]._id);

      setsCity(c);
    } else {
      setsCity([...sCity, cities[idx]._id]);
    }
  };

  return (
    <div style={{ padding: "5px" }}>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={`${styles.modal} modal-content`}>
          {cities.map((city, idx) => (
            <div
              onClick={() => onSelect(idx)}
              key={city._id}
              style={{
                color: "black",
                display: "flex",
                justifyContent: "space-between",
                background: `${sCity.includes(city._id) ? "grey" : "white"}`,
              }}
            >
              {city.name}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button disabled={page == 1} onClick={() => fetchCities("Previous")}>
            Previous
          </button>
          <button disabled={isLastPage} onClick={() => fetchCities("Next")}>
            Next
          </button>
        </div>

        <button
          className={styles.buttonSubmit}
          onClick={() => {
            addCities(sCity);
            setIsOpen(false);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Modal;
