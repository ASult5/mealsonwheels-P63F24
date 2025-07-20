import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./SearchHome.css"; // Add this new CSS file

const SearchHome = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("search");
  };

  return (
    <div className="search-home-container mt-5 mb-5">
      <div>
        <h6 className="text-center">
  <span
    className="border py-2 ps-2 salon-title"
    style={{ borderColor: "black", color: "white", borderWidth: "2px", borderStyle: "solid" }}
  >
    SEARCH{" "}
    <span
      className="py-2 px-2 text-white"
      style={{ backgroundColor: "#e29521" }}
    >
      RESTAURENTS
    </span>
  </span>
</h6>

      </div>
      <div className="d-flex justify-content-center mt-5">
        <div className="search-box border responsiveSearchHome">
          <NavLink to={"/search"}>
            <form className="align-items-center d-flex">
              <input
                placeholder="Search Your Restaurant..."
                type="search"
                id="HomeSearch"
                className="search-input text-dark w-100 border-0 ms-2 me-2 py-3"
              />
              <button
                className="search-button bg-hotpink text-white py-3 px-3 border-0"
                type="submit"
                onClick={handleSearch}
              >
                search
              </button>
            </form>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SearchHome;
