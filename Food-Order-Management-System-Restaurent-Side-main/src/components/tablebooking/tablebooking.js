import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Footer from "../Footer/Footer";

export default function TableBooking() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    bookingDate: "",
    bookingTime: "",
    numberOfGuests: 1,
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "ProfessionalDB"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
      setLoading(false);
    }
    fetchRestaurants();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectRestaurant(id) {
    const rest = restaurants.find((r) => r.id === id);
    setSelectedRestaurant(rest);
    setMessage("");
  }

async function handleSubmit(e) {
  e.preventDefault();
  if (!selectedRestaurant) {
    setMessage("Please select a restaurant first.");
    return;
  }
  if (
    !formData.userName ||
    !formData.userEmail ||
    !formData.bookingDate ||
    !formData.bookingTime
  ) {
    setMessage("Please fill in all fields.");
    return;
  }

  try {
    // Save booking to Firestore
    await addDoc(collection(db, "tableBookings"), {
      restaurantId: selectedRestaurant.id,
      restaurantName: selectedRestaurant.name,
      userName: formData.userName,
      userEmail: formData.userEmail,
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      numberOfGuests: parseInt(formData.numberOfGuests, 10),
      createdAt: serverTimestamp(),
    });

    // Call backend API to send booking email to restaurant
    try {
      const response = await fetch("https://foodserver-eta.vercel.app/send-tablebooking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantEmail: selectedRestaurant.email,
          restaurantName: selectedRestaurant.shopName,
          userName: formData.userName,
          userEmail: formData.userEmail,
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          numberOfGuests: parseInt(formData.numberOfGuests, 10),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Email sending failed");
      console.log("Booking email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send booking email:", emailError);
      setMessage("Booking saved but failed to send email notification.");
    }

    // Show success modal
    setShowModal(true);

    // Reset form and restaurant selection
    setFormData({
      userName: "",
      userEmail: "",
      bookingDate: "",
      bookingTime: "",
      numberOfGuests: 1,
    });
    setSelectedRestaurant(null);
    setMessage("");
  } catch (error) {
    console.error("Error saving booking:", error);
    setMessage("Failed to save booking. Please try again.");
  }
}


  // Close modal handler
  function closeModal() {
    setShowModal(false);
  }

  if (loading) return <div style={styles.loading}>Loading restaurants...</div>;

  return (
    <div>
      <div style={styles.pageContainer}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Book a Table</h2>

          <label htmlFor="restaurant" style={styles.label}>
            Select Restaurant
          </label>
          <select
            id="restaurant"
            value={selectedRestaurant?.id || ""}
            onChange={(e) => handleSelectRestaurant(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Select --</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.shopName} — {r.shopAddress}
              </option>
            ))}
          </select>

          {selectedRestaurant && (
            <div style={styles.restaurantCard}>
              <img
                src={selectedRestaurant.imageURL}
                alt={selectedRestaurant.shopName}
                style={styles.restaurantImage}
              />
              <p>
                <strong>Address:</strong> {selectedRestaurant.shopAddress}
              </p>
              <p>
                <strong>Contact:</strong> {selectedRestaurant.number}
              </p>
              <p>
                <strong>Closing Time:</strong> {selectedRestaurant.shopClose}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Your full name"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                style={styles.input}
                placeholder="example@email.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                style={styles.input}
                required
                min={today}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Booking Time</label>
              <input
                type="time"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Number of Guests</label>
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                min={1}
                max={20}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Book Table
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: 15,
                color: message.includes("success") ? "#28a745" : "#dc3545",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ marginBottom: 15 }}>Booking Done!</h3>
              <p style={{ marginBottom: 20 }}>
                Your booking is successful. Please wait for restaurant
                confirmation.
              </p>
              <button onClick={closeModal} style={styles.modalButton}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <br />
      <Footer />
    </div>
  );
}

const styles = {
  //... your existing styles here, plus:

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    maxWidth: 400,
    width: "90%",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  modalButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
  },
  pageContainer: {
    backgroundColor: "#fff",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: "#fafafa",
    maxWidth: 700,
    width: "100%",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    padding: 30,
    boxSizing: "border-box",
  },
  heading: {
    marginBottom: 25,
    fontWeight: "700",
    fontSize: 28,
    color: "#333",
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    color: "#555",
    fontSize: 14,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.8px solid #ccc",
    marginBottom: 20,
    outline: "none",
    transition: "border-color 0.3s",
    cursor: "pointer",
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    padding: 15,
    marginBottom: 25,
    color: "#444",
  },
  restaurantImage: {
    width: "100%",
    borderRadius: 10,
    objectFit: "cover",
    marginBottom: 15,
    maxHeight: 200,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: 18,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.8px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 0",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: 10,
  },
  loading: {
    fontSize: 18,
    fontWeight: 600,
    color: "#555",
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
  },
};
