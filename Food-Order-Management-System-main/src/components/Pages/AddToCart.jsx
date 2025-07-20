import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [couponRedeemed, setCouponRedeemed] = useState(false);


  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    contact: "",
    address: "",
    flat: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      const fetchLoyaltyPoints = async () => {
        const usersRef = collection(db, "userLogin");
        const q = query(usersRef, where("email", "==", userEmail));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const points = userDoc.data().loyaltyPoints || 0;
          setLoyaltyPoints(points);
        }
      };

      fetchLoyaltyPoints();
    }
  }, []);

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const incrementQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decrementQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.Price),
    0
  );

  const discount = couponRedeemed && subtotal > 300 ? 300 : 0;
  const totalPrice = subtotal - discount;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return alert("Cart is empty!");

    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      // Redirect to login if email is not found
      window.location.href = "/login";
      return;
    }

    setShowModal(true); // Show delivery modal if email exists
  };

  const handleOrderSubmit = async () => {
    const { name, contact, address, flat, paymentMethod } = deliveryDetails;
    if (!name || !contact || !address || !flat || !paymentMethod) {
      return alert(
        "Please fill all delivery details and select payment method."
      );
    }

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      return alert("User not logged in.");
    }

    const groupedByRestaurant = cartItems.reduce((acc, item) => {
      if (!acc[item.shopName]) acc[item.shopName] = [];
      acc[item.shopName].push(item);
      return acc;
    }, {});

    try {
      for (const [restaurant, items] of Object.entries(groupedByRestaurant)) {
        await addDoc(collection(db, "orders", restaurant, "items"), {
          restaurant,
          items,
          total: items.reduce(
            (sum, item) => sum + item.quantity * Number(item.Price),
            0
          ),
          deliveryDetails,
          UserOrderedFrom: userEmail,
          status: {
            active: true,
            delivered: false,
          },
          createdAt: new Date(),
        });
      }

      // 🟨 LOYALTY POINTS LOGIC START
      const usersRef = collection(db, "userLogin");
      const q = query(usersRef, where("email", "==", userEmail));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const currentPoints = userDoc.data().loyaltyPoints || 0;
        let newPoints;

        if (couponRedeemed) {
          newPoints = 20; // Reset to 20 if coupon was used
        } else {
          newPoints = currentPoints + 20; // Else, add 20 normally
        }

        await updateDoc(doc(db, "userLogin", userDoc.id), {
          loyaltyPoints: newPoints,
        });

        // Update local state so UI reflects change immediately (optional)
        setLoyaltyPoints(newPoints);
      }
      // 🟨 LOYALTY POINTS LOGIC END

      localStorage.removeItem("cart");
      setCartItems([]);
      setShowModal(false);
      window.dispatchEvent(new Event("cartUpdated"));

      await fetch("https://foodserver-eta.vercel.app/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userEmail,
          name,
          cartItems,
          total: cartItems.reduce(
            (sum, item) => sum + item.quantity * Number(item.Price),
            0
          ),
          address: `${flat}, ${address}`,
        }),
      });

      if (paymentMethod === "Card") {
        window.location.href =
          "https://buy.stripe.com/test_28EfZgdMfc2o4dQcJf1Nu03";
      } else {
        alert("Order placed successfully!");
      }

      navigate("/order");

      window.location.reload();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div>
    <div style={styles.container}>
      <h2
  style={{
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#333",
    letterSpacing: "0.5px",
    gap: "10px",
    animation: "fadeSlideDown 0.6s ease",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }}
>
  <span role="img" aria-label="cart" style={{ fontSize: "1.8rem" }}>
    🛒
  </span>
  Your Cart
</h2>

      {cartItems.length === 0 ? (
        <p style={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: "35%" }}>Item</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Restaurant</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 15 }}
                    >
                      <img
                        src={item.ServiceImage}
                        alt={item.ServiceName}
                        style={styles.img}
                      />
                      <div style={styles.itemInfo}>
                        <strong>{item.ServiceName}</strong>
                        <p style={styles.description}>{item.Description}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {item.Category}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {item.shopName}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    Rs {item.Price}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={styles.quantityControls}>
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        style={styles.quantityButton}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        style={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    Rs {(item.quantity * Number(item.Price)).toFixed(2)}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={styles.removeButton}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={styles.totalRow}>
                <td colSpan="5" style={styles.totalLabel}>
                  Total:
                </td>
                <td style={{ textAlign: "center" }}>
                  Rs {totalPrice.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
          </div>
          {loyaltyPoints > 200 && !couponRedeemed && (
            <button
              onClick={() => setCouponRedeemed(true)}
              style={{
                marginTop: 15,
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Redeem Coupon (300 Rs OFF)
            </button>
          )}
          <br></br>
          {couponRedeemed && (
            <p style={{ color: "#28a745", marginTop: 10 }}>
              Coupon Applied: ₹300 Discount
            </p>
          )}
<button
  style={{
    marginTop: 30,
    padding: "12px 24px",
    backgroundColor: "#ff6b00", // orange
    color: "#fff",
    fontWeight: "bold",
    border: `2px solid #ff6b00`, // orange border
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#e65c00")} // darker orange on hover
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6b00")}
  onClick={handleCheckoutClick}
>
  Checkout
</button>

<style>
{`
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
`}
</style>


    {showModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      animation: "fadeIn 0.3s ease-in-out",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "40px 30px",
        borderRadius: "16px",
        width: "95%",
        maxWidth: "460px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
        border: "1px solid #eaeaea",
        transform: "translateY(0)",
        transition: "transform 0.3s ease",
      }}
    >
      <h2
        style={{
          marginBottom: 24,
          textAlign: "center",
          color: "#111",
          fontWeight: "bold",
          fontSize: "1.9rem",
        }}
      >
        🛒 Delivery Information
      </h2>

      {[
        { placeholder: "Full Name", field: "name" },
        { placeholder: "Contact Number", field: "contact" },
        { placeholder: "Flat / House No.", field: "flat" },
      ].map((input, i) => (
        <input
          key={i}
          type="text"
          placeholder={input.placeholder}
          value={deliveryDetails[input.field]}
          onChange={(e) =>
            setDeliveryDetails({
              ...deliveryDetails,
              [input.field]: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "12px 14px",
            marginBottom: 14,
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 15,
            outline: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        />
      ))}

      <textarea
        placeholder="Full Address"
        value={deliveryDetails.address}
        onChange={(e) =>
          setDeliveryDetails({
            ...deliveryDetails,
            address: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "12px 14px",
          height: 80,
          resize: "none",
          borderRadius: 10,
          border: "1px solid #ccc",
          fontSize: 15,
          marginBottom: 16,
          outline: "none",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      ></textarea>

      <div style={{ marginBottom: 22 }}>
        <label
          style={{
            fontWeight: "bold",
            marginBottom: 10,
            display: "block",
            color: "#444",
            fontSize: 15,
          }}
        >
          Payment Method:
        </label>
        <div style={{ display: "flex", gap: 20 }}>
          {["Cash", "Card"].map((method) => (
            <label
              key={method}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 15,
              }}
            >
              <input
                type="radio"
                value={method}
                checked={deliveryDetails.paymentMethod === method}
                onChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    paymentMethod: e.target.value,
                  })
                }
              />
              {method}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "none",
            fontWeight: "bold",
            backgroundColor: "#ff6b00",
            color: "#fff",
            width: "48%",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "#e65c00")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "#ff6b00")
          }
          onClick={handleOrderSubmit}
        >
          Submit
        </button>

        <button
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#333",
            width: "48%",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

        </>
      )}
    </div>
     <br></br>
            <Footer />
    </div>
  );
};


const isMobile = window.innerWidth < 768;
const pink = "#000";
const black = "#000";
const white = "#fff";



const inputStyle = {
  width: "100%",
  padding: isMobile ? "8px" : "10px",
  borderRadius: 6,
  border: `1px solid ${pink}`,
  fontSize: isMobile ? 13 : 14,
  outline: "none",
  transition: "all 0.3s ease",
};

const styles = {
  container: {
    maxWidth: "100%",
    margin: "20px auto",
    padding: isMobile ? "20px 12px" : "30px 24px",
    backgroundColor: white,
    borderRadius: 16,
    boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: black,
    overflowX: "auto",
  },
  heading: {
    fontSize: isMobile ? "1.5rem" : "2rem",
    fontWeight: "700",
    borderBottom: `3px solid ${pink}`,
    paddingBottom: 8,
    marginBottom: 20,
    color: black,
    textAlign: isMobile ? "center" : "left",
  },
table: {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1000px", // Force horizontal scroll when space is tight
},
  th: {
    textAlign: "left",
    padding: isMobile ? "10px" : "12px 15px",
    fontWeight: "600",
    fontSize: 14,
    color: black,
    borderBottom: `2px solid ${pink}`,
  },
  td: {
    backgroundColor: "#fff",
    padding: isMobile ? "10px" : "12px 15px",
    verticalAlign: "middle",
    fontSize: 14,
    color: "#333",
    borderRadius: 8,
  },
  img: {
    width: isMobile ? 60 : 70,
    height: isMobile ? 60 : 70,
    objectFit: "cover",
    borderRadius: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
 itemInfo: {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 250,
  maxWidth: 350,
  wordBreak: "break-word",
},

description: {
  margin: 0,
  fontSize: 12,
  color: "#777",
  fontStyle: "italic",
  overflowWrap: "break-word",
  wordBreak: "break-word",
},

  quantityControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  quantityButton: {
    border: `1.5px solid ${pink}`,
    backgroundColor: white,
    color: pink,
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
    userSelect: "none",
    transition: "all 0.3s ease",
  },
  removeButton: {
    background: "transparent",
    border: "none",
    color: pink,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 22,
    transition: "color 0.3s ease",
  },
  totalRow: {
    fontWeight: "700",
    fontSize: 16,
    color: "#222",
  },
  totalLabel: {
    textAlign: "right",
    paddingRight: 15,
  },
  emptyCart: {
    fontStyle: "italic",
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },

};

export default AddToCartPage;
