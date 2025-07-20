import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Who We Are Section */}
      <div className="container section">
        <h3 className="text-center animate-header hotpink-text">
          <span className="highlight-border">Who We Are ?</span>
        </h3>
        <div className="row align-items-center mt-4">
          <div className="col-12 col-sm-6 animate-fade">
           <p className="about-text">
  Welcome to <strong className="hotpink-text">Meals On Wheel</strong>, your
  go-to destination for ordering delicious food from your favorite restaurants!
  Our mission is to connect you with the best eateries in your area and make
  ordering your next meal quick and easy. Thank you for choosing{" "}
  <strong className="hotpink-text">Meals On Wheel!</strong>
</p>

          </div>
          <div className="col-12 col-sm-6 animate-zoom">
            <img
              src="https://media.istockphoto.com/id/1446478827/photo/a-chef-is-cooking-in-his-restaurants-kitchen.jpg?s=612x612&w=0&k=20&c=jwKJmGErrLe2XsTWNYEEyiNicudYVA4j8jvnTiJdp58="
              alt="RESTAURENT"
              className="w-100 rounded-shadow"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container section animate-fade-up">
        <div className="stats-container">
          <div className="stat-card animate-scale">
            <h2>2K+</h2>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card animate-scale">
            <h2>#1</h2>
            <p>Worldwide Ranking</p>
          </div>
          <div className="stat-card animate-scale">
            <h2>500+</h2>
            <p>Partnered Shops</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonial-section section">
        <h3 className="text-center hotpink-text animate-header">
          What Our Clients Say
        </h3>
        <div className="testimonial-container">
          <div className="testimonial-card animate-fade">
            <p>
              "I love how easy it is to find RESTAURENTS through Meals On Wheel!
              Their platform is user-friendly and always up-to-date."
            </p>
            <h5>- Sarah J.</h5>
          </div>
          <div className="testimonial-card animate-fade-up">
            <p>
              "The best experience ever! The reviews helped me choose the
              perfect RESTAURENT for my makeover."
            </p>
            <h5>- Emily R.</h5>
          </div>
          <div className="testimonial-card animate-fade">
            <p>
              "I can’t imagine going back to the old ways of finding RESTAURENTS.
              Meals On Wheel makes everything so convenient!"
            </p>
            <h5>- Olivia P.</h5>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="container section animate-fade-up">
        <h3 className="text-center hotpink-text">Our Mission</h3>
        <p className="text-center mission-text">
          At Meals On Wheel, our mission is to empower individuals to express
          themselves through their style. We aim to bridge the gap between
          clients and top-notch RESTAURENTS, ensuring every experience is a memorable
          one. Whether it’s a quick trim or a complete transformation, we are
          here to make it happen.
        </p>
      </div>
    </div>
  );
};

export default About;
