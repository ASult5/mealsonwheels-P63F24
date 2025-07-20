import React, { useEffect, useState } from "react";
import { collectionGroup, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import moment from "moment";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) return;
      try {
        const q = query(
          collectionGroup(db, "items"),
          where("UserOrderedFrom", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userEmail]);

  const openModal = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  if (!userEmail) {
    return (
      <div style={styles.centeredMessage}>
        Please log in to view your orders.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🧾 Order History</h2>

      {orders.length === 0 ? (
        <p style={styles.noOrders}>No orders found.</p>
      ) : (
        <div style={styles.cardGrid}>
          {orders.map((order, index) => (
            <div key={index} onClick={() => openModal(order)} style={styles.card}>
              <h3 style={styles.restaurant}>{order.restaurant}</h3>
              <p style={styles.date}>
                {order.createdAt
                  ? moment(order.createdAt.toDate()).format("MMM Do YYYY, h:mm a")
                  : "N/A"}
              </p>
              <p style={styles.amount}>Rs. {order.total}</p>
              <span
                style={{
                  ...styles.status,
                  backgroundColor: order.status?.delivered ? "#28a74533" : "#ffc10733",
                  color: order.status?.delivered ? "#28a745" : "#ffc107",
                }}
              >
                {order.status?.delivered ? "Delivered" : "Pending"}
              </span>
              <p style={styles.viewDetails}>View details →</p>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeModal}>
              &times;
            </button>

            <h2 style={styles.modalTitle}>Order Details</h2>
            <p><strong>Restaurant:</strong> {selectedOrder.restaurant}</p>
            <p><strong>Date:</strong>{" "}
              {selectedOrder.createdAt
                ? moment(selectedOrder.createdAt.toDate()).format("MMMM Do YYYY, h:mm a")
                : "N/A"}
            </p>
            <p><strong>Total:</strong> Rs. {selectedOrder.total}</p>
            <p><strong>Status:</strong> {selectedOrder.status?.delivered ? "Delivered" : "Pending"}</p>

            <div style={styles.section}>
              <h3>Delivery Info</h3>
              <p><strong>Name:</strong> {selectedOrder.deliveryDetails?.name}</p>
              <p><strong>Contact:</strong> {selectedOrder.deliveryDetails?.contact}</p>
              <p><strong>Address:</strong> {selectedOrder.deliveryDetails?.address}</p>
              <p><strong>Flat:</strong> {selectedOrder.deliveryDetails?.flat}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.deliveryDetails?.paymentMethod}</p>
            </div>

            <div style={styles.section}>
              <h3>Items</h3>
              <div style={styles.itemsList}>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} style={styles.itemCard}>
                    <img
                      src={item.ServiceImage}
                      alt={item.ServiceName}
                      style={styles.itemImage}
                    />
                    <div>
                      <p style={{ margin: 0 }}>
                        <strong>{item.ServiceName}</strong>
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>
                        {item.quantity} x Rs. {item.Price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Modern inline styles
const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#333",
  },
  header: {
    textAlign: "center",
    fontSize: "30px",
    marginBottom: "30px",
  },
  noOrders: {
    textAlign: "center",
    fontSize: "18px",
    color: "#777",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  restaurant: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
  },
  date: {
    fontSize: "14px",
    color: "#777",
    margin: "5px 0",
  },
  amount: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#444",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    display: "inline-block",
    marginTop: "10px",
    fontWeight: "500",
  },
  viewDetails: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#007bff",
    fontWeight: "500",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "30px",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "12px",
    right: "20px",
    fontSize: "28px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#999",
  },
  modalTitle: {
    fontSize: "24px",
    marginBottom: "15px",
  },
  section: {
    marginTop: "25px",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "10px",
  },
  itemCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "10px",
    borderRadius: "10px",
    backgroundColor: "#f5f5f5",
  },
  itemImage: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  centeredMessage: {
    background: "#fff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Segoe UI, sans-serif",
    fontSize: "18px",
    color: "#555",
  },
};

export default OrderHistory;
