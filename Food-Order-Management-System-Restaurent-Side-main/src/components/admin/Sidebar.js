import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import store from "../../Redux/reduxStore";
import { addAuth } from "../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import { professionalLogOut } from "../../Redux/Slices/professionalRedux";
import { message } from "antd";

const Sidebar = () => {
  const imgPath =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxBkPEWMJMGTnabQLDiysWBsnOpnvKa4cGTw&s";
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, context] = message.useMessage();

  const sendMessage = (varient, messageText) => {
    messageApi.open({ type: varient, content: messageText });
  };

  const HandleSignOut = () => {
    signOut(auth)
      .then(() => {
        sendMessage("success", "Professional SignOut !!!");
        setTimeout(() => {
          navigate("/");
          dispatch(professionalLogOut());
        }, 1200);
      })
      .catch((err) => {
        sendMessage("error", err.message);
      });

    setTimeout(() => {
      store.dispatch(addAuth.deleteState(null));
    }, 2000);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #fff, #fff4e6)",
        height: "100vh",
        width: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid #ddd",
        boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
        padding: "20px 10px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {context}

      {/* Profile Image */}
      <div>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img
            src={imgPath}
            alt="Profile"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "3px solid #ff7e00",
              transition: "transform 0.3s",
            }}
          />
        </div>

        {/* Sidebar Links */}
        {[
          { to: "/dashboard", icon: "person", label: "Profile Page" },
          { to: "add-services", icon: "design_services", label: "Add Menu" },
          { to: "schedules-professional", icon: "calendar_month", label: "My Orders" },
          { to: "tablebooking", icon: "receipt_long", label: "Order Bookings" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.to}
            id="SideBtn"
            className="py-2 my-3 ps-3 d-flex align-items-center text-white"
            style={{
              background: "linear-gradient(to right, #ff7e00, #ff4b2b)",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span className="material-icons-outlined me-2">{item.icon}</span>
            <span id="sidebarMenuName">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div style={{ padding: "10px" }}>
        <div
          onClick={HandleSignOut}
          style={{
            background: "linear-gradient(to right, #ff7e00, #ff4b2b)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span className="material-icons-outlined" style={{ marginRight: "8px" }}>
            logout
          </span>
          Logout
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    style={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#ff69b4",
      color: "white",
      padding: "10px 14px",
      margin: "12px 0",
      borderRadius: "12px",
      fontWeight: "600",
      textDecoration: "none",
      transition: "transform 0.3s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <span className="material-icons-outlined" style={{ marginRight: "10px" }}>
      {icon}
    </span>
    {label}
  </Link>
);

export default Sidebar;
