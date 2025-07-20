import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ShopCard.css";
import Slider from "react-slick/lib/slider";
import Loader from "../Loader/loader";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase configuration
const config = {
  apiKey: "AIzaSyAd0K-Y8AnNXSJXQRZeQtphPZQPOkSAgmo",
  authDomain: "foodplanet-82388.firebaseapp.com",
  projectId: "foodplanet-82388",
  storageBucket: "foodplanet-82388.firebasestorage.app",
  messagingSenderId: "898880937459",
  appId: "1:898880937459:web:2c23717c73ffdf2eef8686",
  measurementId: "G-CPEP0M2EXG",
};

// Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

const ShopCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ProfessionalDB"));
        const servicesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(servicesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    useTransform: true,
    draggable: true,
    centerMode: false,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: false,
          arrows: true,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="responsiveWidth mt-n5 px-4 card pt-3 pb-3 shop-card-bg">
        <div className="mb-2">
          <h6 className="text-center">
            <span className="border py-2 ps-2 salon-title">
              Top 10{" "}
              <span className="py-2 px-2 bg-hotpink text-white">Salons</span>
            </span>
          </h6>
        </div>
        {loading || !data.length ? ( // Check both loading and data validity
          <Loader />
        ) : (
          <Slider className="" {...settings}>
            {data.map((doc) => (
              <div className="" key={doc.id}>
                <Link to={`/shop/${doc.id}`}>
                  <div className="d-flex card mx-2 shop-card">
                    <div className="shop-logo-container">
                      <img
                        src={require("../../assets/logo.png")}
                        className="shop-logo"
                        alt="Shop Logo"
                      />
                    </div>
                    <div className="position-absolute bottom-0 start-0 card-info-bg">
                      <h6 className="fw-semibold">{doc.shopName}</h6>
                      <p className="fs-6">{doc.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default ShopCard;
