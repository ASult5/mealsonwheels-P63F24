import React from "react";
import "./MobileMenu.css";
import { Link } from "react-router-dom";
const MobileMenu = () => {
  return (
    <div className="py-3 d-flex justify-content-center ">
      <div className="m-menu text-white">
        <div className="d-flex justify-content-between align-items-center px-4 py-1">
          <Link to={"add-services"}>
            <span className="material-icons-outlined">rule</span>
            <span id="menutext">Add Update Menu</span>
          </Link>
          <Link to={"schedules-professional"}>
            <span className="material-icons-outlined">
              published_with_changes
            </span>
            <span id="menutext">Orders</span>
          </Link>
          <Link to={"/dashboard"} className="">
            <span className="material-icons-outlined">person</span>
            <span id="menutext">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
