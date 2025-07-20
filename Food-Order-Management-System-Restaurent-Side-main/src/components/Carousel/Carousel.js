import React, { useEffect, useState } from "react";
import "./Carousel.css";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("https://foodserver-eta.vercel.app/api/images")
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Image fetch error:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("next");
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const goToPrev = () => {
    setDirection("prev");
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setDirection("next");
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div id="carouselControls" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {images.map((imgSrc, index) => (
          <div
            key={index}
            className={`carousel-item ${
              activeIndex === index ? "active" : ""
            } ${direction === "prev" ? "fadeOut" : ""} ${
              direction === "next" ? "fadeIn" : ""
            }`}
          >
            <img
              src={imgSrc}
              className="d-block w-100 carouselImg"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev center-btn"
        type="button"
        onClick={goToPrev}
      >
        <span className="material-icons">arrow_back_ios</span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next center-btn"
        type="button"
        onClick={goToNext}
      >
        <span className="material-icons">arrow_forward_ios</span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
