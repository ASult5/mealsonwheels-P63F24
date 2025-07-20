import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [cartCount, setCartCount] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const path = location.pathname;
  const displayName = email ? email.split("@")[0].replace(/[0-9]/g, "") : "";

   useEffect(() => {
      const script = document.createElement("script");
      script.src = "//code.tidio.co/prhna9cfxdbxlsuioyzyzbyq4exusfkt.js";
      script.async = true;
      document.body.appendChild(script);
    }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cartItems.length);
    };
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      try {
        const userEmail = localStorage.getItem("email");
        if (!userEmail) return;
        const q = query(collection(db, "userLogin"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setLoyaltyPoints(data.loyaltyPoints || 0);
        }
      } catch (error) {
        console.error("Error fetching loyalty points:", error);
      }
    };
    fetchLoyaltyPoints();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("email");
      setEmail(null);
      navigate("/");
    }
  };

  if (["/dashboard", "/login"].includes(path)) return null;

  const navStyle = (active) => ({
    padding: "10px 18px",
    color: active ? "#fff" : "#ccc",
    backgroundColor: active ? "#ff6600" : "transparent",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: active ? "bold" : "500",
    fontSize: "14px",
    transition: "0.3s",
  });

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          fontFamily: "Segoe UI, sans-serif",
          backgroundColor: "#0d0d0d",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          color: "#fff",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: "#ff6600",
            textAlign: "center",
            padding: "6px",
            fontSize: "13px",
            letterSpacing: "0.8px",
            fontWeight: 500,
          }}
        >
          ❤️ Taste the Best — Fresh Flavors, Just for You!
        </div>

        {/* Main Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 30px",
            backgroundColor: "#121212",
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            <span style={{ color: "#ff6600" }}>🍽️ Meals On Wheels</span>
          </Link>

          {/* Hamburger Icon */}
          <div
            className="hamburger"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </div>

          {/* Main Navigation */}
          <div className={`main-nav ${showMenu ? "show" : ""}`}>
            <Link to="/search" style={navStyle(path === "/search")}>Restaurants</Link>
            <Link to="/tablebooking" style={navStyle(path === "/tablebooking")}>Book Table</Link>
            <Link to="/order" style={navStyle(path === "/order")}>Orders</Link>
            <Link to="/Profile" style={navStyle(path === "/Profile")}>Profile</Link>
            <Link to="/addtocart" style={navStyle(path === "/cart")}>🛒 Cart ({cartCount})</Link>

            <div style={{
              backgroundColor: "#1e1e1e",
              padding: "8px 14px",
              borderRadius: "8px",
              color: "#ff6600",
              fontWeight: "bold",
              fontSize: "14px",
              minWidth: "120px",
              textAlign: "center",
              marginTop: "10px"
            }}>
              🎁 Loyalty: {loyaltyPoints}
            </div>

            {email ? (
              <>
                <span style={{ fontSize: "13px", color: "#ccc" }}>
                  👋 Hello, <b style={{ color: "#fff" }}>{displayName}</b>
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: "#ff6600",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "14px",
                    marginTop: "10px",
                    transition: "background 0.3s",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  backgroundColor: "#ff6600",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CSS styles */}
      <style>{`
        .hamburger {
          display: none;
          font-size: 26px;
          color: white;
          cursor: pointer;
        }

        .main-nav {
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        @media (max-width: 767px) {
          .hamburger {
            display: block;
          }
          .main-nav {
            display: none;
            flex-direction: column;
            width: 100%;
            padding: 20px;
            background-color: #1a1a1a;
            border-top: 1px solid #333;
          }
          .main-nav.show {
            display: flex;
          }
        }

       @media (min-width: 1400px) {
  .hamburger {
    display: none !important;
  }
  .main-nav {
    display: flex !important;
    flex-direction: row;
    position: static;
    background-color: transparent;
    padding: 0;
    box-shadow: none;
  }
}


        @media (min-width: 768px) and (max-width: 1399px) {
          .hamburger {
            display: none;
          }
          .main-nav {
            display: flex !important;
            position: static;
            flex-direction: row;
            background-color: transparent;
            padding: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
