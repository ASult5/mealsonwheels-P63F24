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
  const [searchTerm, setSearchTerm] = useState("");

  const [hoveredId, setHoveredId] = useState(null); // ✅ Add here safely
  const [noMatch, setNoMatch] = useState(false);

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
  const [isHovering, setIsHovering] = useState(false);

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

        if (data.length === 0) {
          alert("No restaurants are available at the moment.");
        }
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

    // 🔒 Check if email exists in localStorage
    const localEmail = localStorage.getItem("email");
    if (!localEmail) {
      setMessage("Please log in before booking a table.");
      return;
    }

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
      await addDoc(collection(db, "tableBookings"), {
        restaurantId: selectedRestaurant.id,
        restaurantName: selectedRestaurant.name,
        userName: formData.userName,
        userEmail: formData.userEmail,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        numberOfGuests: parseInt(formData.numberOfGuests, 10),
        Confirm: "Not Confirmed Yet",
        createdAt: serverTimestamp(),
      });

      try {
        const response = await fetch(
          "https://foodserver-eta.vercel.app/send-tablebooking-email",
          {
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
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Email sending failed");
        console.log("Booking email sent successfully.");
        window.location.href =
          "https://buy.stripe.com/test_aFa4gy5fJ7M85hUfVr1Nu04";
      } catch (emailError) {
        console.error("Failed to send booking email:", emailError);
        setMessage("Booking saved but failed to send email notification.");
      }

      // setShowModal(true);
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

  const currentTime = new Date();
  const formattedCurrentTime = currentTime
    .toTimeString()
    .split(" ")[0]
    .slice(0, 5); // HH:MM format

  const isTodaySelected = formData.bookingDate === today;
  const minTime = isTodaySelected ? formattedCurrentTime : "00:00";
  const filteredRestaurants = restaurants.filter((r) =>
    r.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={styles.pageContainer}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Book a Table</h2>
          <style>
            {`
    input:hover {
      border-color: #3b82f6 !important;
      cursor: pointer;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    input:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    ul li:hover {
      background-color: #3b82f6 !important;
      color: white !important;
    }
  `}
          </style>

          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              id="search"
              placeholder="Type restaurant name..."
              style={{
                width: "100%",
                padding: "10px",
                fontWeight: "bold",
                backgroundColor: searchTerm ? "#007bff" : "#fff",
                color: searchTerm ? "#fff" : "#000",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);

                const filtered = restaurants.filter((r) =>
                  r.shopName.toLowerCase().includes(value.toLowerCase())
                );

                if (value && filtered.length === 0) {
                  alert("No matching restaurant found.");
                }
              }}
            />
            {searchTerm && (
              <div
                style={{
                  marginTop: "5px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {filteredRestaurants.length > 0
                  ? "Matching restaurants found!"
                  : "No match found."}
              </div>
            )}

            {searchTerm && filteredRestaurants.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "8px 0 0",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  maxHeight: "200px",
                  overflowY: "auto",
                  position: "absolute",
                  width: "100%",
                  zIndex: 10,
                }}
              >
                {filteredRestaurants.map((r) => (
                  <li
                    key={r.id}
                    onClick={() => {
                      handleSelectRestaurant(r.id);
                      setSearchTerm("");
                    }}
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      fontWeight: hoveredId === r.id ? "bold" : "normal",
                      backgroundColor: hoveredId === r.id ? "#3b82f6" : "#fff",
                      color: hoveredId === r.id ? "#fff" : "#1f2937",
                      transition: "background-color 0.2s ease",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {r.shopName} — {r.shopAddress}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
                min={minTime}
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

            <button
              type="submit"
              disabled={!selectedRestaurant || noMatch}
              style={{
                ...styles.button,
                ...(isHovering ? styles.buttonHover : {}),
                ...(noMatch || !selectedRestaurant
                  ? { opacity: 0.5, cursor: "not-allowed" }
                  : {}),
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px 25px",
    borderRadius: 16,
    boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
    maxWidth: 420,
    width: "90%",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  dropdown: {
    marginTop: 5,
    border: "1px solid #ccc",
    borderRadius: 8,
    maxHeight: 200,
    overflowY: "auto",
    backgroundColor: "#fff",
    listStyle: "none",
    padding: 0,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
    position: "absolute",
    width: "100%",
  },

  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    color: "#1f2937",
    transition: "background-color 0.2s ease",
  },

  modalButton: {
    backgroundColor: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    transition: "background-color 0.3s ease",
  },
  pageContainer: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    padding: 24,
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    backgroundColor: "#ffffff",
    maxWidth: 900,
    width: "100%",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    padding: 40,
    boxSizing: "border-box",
  },
  heading: {
    marginBottom: 30,
    fontWeight: 700,
    fontSize: 30,
    color: "#1f2937",
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 500,
    color: "#374151",
    fontSize: 14,
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 10,
    border: "1.5px solid #d1d5db",
    marginBottom: 22,
    outline: "none",
    transition: "border-color 0.3s ease",
    cursor: "pointer",
  },
  restaurantCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    padding: 20,
    marginBottom: 25,
    color: "#374151",
  },
  restaurantImage: {
    width: "100%",
    borderRadius: 10,
    objectFit: "cover",
    marginBottom: 12,
    maxHeight: 180,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 10,
    border: "1.5px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box",
  },
  button: {
    background: "linear-gradient(135deg, #ff7e00, #ff4b2b)", // orange to reddish-orange gradient
    color: "#fff",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundSize: "200% 200%",
    backgroundPosition: "0% 50%",
  },
  buttonHover: {
    backgroundPosition: "100% 50%", // animate gradient shift
    transform: "scale(1.03)",
    boxShadow: "0 6px 16px rgba(255, 75, 43, 0.4)",
  },

  loading: {
    fontSize: 20,
    fontWeight: 600,
    color: "#4b5563",
    display: "flex",
    justifyContent: "center",
    marginTop: 50,
  },
};
