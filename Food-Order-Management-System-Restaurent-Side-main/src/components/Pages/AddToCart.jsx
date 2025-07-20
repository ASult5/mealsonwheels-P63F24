import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * Number(item.Price),
    0
  );

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return alert("Cart is empty!");
    setShowModal(true);
  };

const handleOrderSubmit = async () => {
  const { name, contact, address, flat, paymentMethod } = deliveryDetails;
  if (!name || !contact || !address || !flat || !paymentMethod) {
    return alert("Please fill all delivery details and select payment method.");
  }

  const userEmail = localStorage.getItem("email"); // <-- Get user email from localStorage

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
        UserOrderedFrom: userEmail || "Unknown", // <-- Save email here
        status: {
          active: true,
          delivered: false,
        },
        createdAt: new Date(),
      });
    }

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
      window.location.href = "https://www.google.com/"; // Replace with actual card payment URL
    } else {
      alert("Order placed successfully!");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Failed to place order.");
  }
};




  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p style={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
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
                <td style={{ textAlign: "center" }}>Rs {totalPrice.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <button
            style={{
              marginTop: 30,
              padding: "12px 24px",
              backgroundColor: "#ff4da6",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16,
            }}
            onClick={handleCheckoutClick}
          >
            Checkout
          </button>

        {showModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div
      style={{
        background: "#ffffff",
        padding: "30px 25px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <h2 style={{ marginBottom: 20, textAlign: "center", color: "#333" }}>
        Delivery Information
      </h2>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Full Name"
          value={deliveryDetails.name}
          onChange={(e) =>
            setDeliveryDetails({ ...deliveryDetails, name: e.target.value })
          }
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Contact Number"
          value={deliveryDetails.contact}
          onChange={(e) =>
            setDeliveryDetails({ ...deliveryDetails, contact: e.target.value })
          }
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Flat / House No."
          value={deliveryDetails.flat}
          onChange={(e) =>
            setDeliveryDetails({ ...deliveryDetails, flat: e.target.value })
          }
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <textarea
          placeholder="Full Address"
          value={deliveryDetails.address}
          onChange={(e) =>
            setDeliveryDetails({ ...deliveryDetails, address: e.target.value })
          }
          style={{ ...inputStyle, height: 80, resize: "none" }}
        ></textarea>
      </div>

      {/* Payment Method */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: "bold", marginBottom: 5, display: "block" }}>
          Payment Method:
        </label>
        <div style={{ display: "flex", gap: 15 }}>
          <label>
            <input
              type="radio"
              value="Cash"
              checked={deliveryDetails.paymentMethod === "Cash"}
              onChange={(e) =>
                setDeliveryDetails({ ...deliveryDetails, paymentMethod: e.target.value })
              }
            />
            <span style={{ marginLeft: 6 }}>Cash</span>
          </label>
          <label>
            <input
              type="radio"
              value="Card"
              checked={deliveryDetails.paymentMethod === "Card"}
              onChange={(e) =>
                setDeliveryDetails({ ...deliveryDetails, paymentMethod: e.target.value })
              }
            />
            <span style={{ marginLeft: 6 }}>Card</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#28a745",
            color: "#fff",
            width: "48%",
          }}
          onClick={handleOrderSubmit}
        >
          Submit
        </button>
        <button
          style={{
            ...buttonStyle,
            backgroundColor: "#f5f5f5",
            color: "#333",
            width: "48%",
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
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 6,
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: "30px 20px",
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    borderBottom: "3px solid #ff4da6",
    paddingBottom: 8,
    marginBottom: 30,
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 12px",
  },
  th: {
    textAlign: "left",
    padding: "12px 15px",
    fontWeight: "600",
    fontSize: 14,
    color: "#666",
    borderBottom: "2px solid #ff4da6",
  },
  td: {
    backgroundColor: "#fafafa",
    padding: "12px 15px",
    verticalAlign: "middle",
    fontSize: 14,
    color: "#444",
    borderRadius: 8,
  },
  img: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  itemInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  description: {
    margin: 0,
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  quantityButton: {
    border: "1.5px solid #ff4da6",
    backgroundColor: "#fff",
    color: "#ff4da6",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 18,
    userSelect: "none",
    transition: "all 0.3s ease",
  },
  quantityButtonHover: {
    backgroundColor: "#ff4da6",
    color: "#fff",
  },
  removeButton: {
    background: "transparent",
    border: "none",
    color: "#ff4da6",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 22,
    transition: "color 0.3s ease",
  },
  removeButtonHover: {
    color: "#e60073",
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
