import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const config = {
  apiKey: "AIzaSyAd0K-Y8AnNXSJXQRZeQtphPZQPOkSAgmo",
  authDomain: "foodplanet-82388.firebaseapp.com",
  projectId: "foodplanet-82388",
  storageBucket: "foodplanet-82388.firbasestorage.app",
  messagingSenderId: "898880937459",
  appId: "1:898880937459:web:2c23717c73ffdf2eef8686",
  measurementId: "G-CPEP0M2EXG",
};

const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
const db = getFirestore(app);

const Profile = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentEmail = localStorage.getItem("email");
        if (!currentEmail) {
          console.error("No email found in localStorage.");
          return;
        }

        const userQuery = query(
          collection(db, "UserDB"),
          where("email", "==", currentEmail)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUserData({ ...doc.data(), id: doc.id });
          });
        } else {
          console.error("No user found with the given email.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const userDocRef = doc(db, "UserDB", userData.id);
      await updateDoc(userDocRef, userData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .hover-button:hover {
            background: linear-gradient(135deg, #dcefff, #cce7ff);
            color: #000;
            transform: scale(1.05);
            transition: all 0.3s ease-in-out;
          }

          .fade-in {
            animation: fadeIn 0.7s ease-in-out;
          }

          input:focus {
            border-color: #4fc3f7;
            box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.2);
          }
        `}
      </style>

      <div style={styles.container}>
        {/* <div style={styles.marqueeContainer}>
          <marquee style={styles.marquee}>
            Welcome to your profile ⚡ Update your details and stay connected 🚀
          </marquee>
        </div> */}

        <div style={styles.card} className="fade-in">
          <h2 style={styles.title}>MY PROFILE</h2>
          {Object.keys(userData).map(
            (key) =>
              key !== "id" && (
                <div key={key} style={styles.field}>
                  <label style={styles.label}>
                    {key === "email"
                      ? "✉️ Email"
                      : key === "phone"
                      ? "📞 Phone"
                      : key === "address"
                      ? "🏠 Address"
                      : key === "name"
                      ? "👤 Name"
                      : key}
                  </label>
                  {isEditing ? (
                    <input
                      type={key === "password" ? "password" : "text"}
                      name={key}
                      value={userData[key]}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    <span style={styles.value}>
                      {key === "password" ? "********" : userData[key]}
                    </span>
                  )}
                </div>
              )
          )}
          <div style={styles.buttonContainer}>
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={styles.saveButton}
                className="hover-button"
              >
                {isSaving ? "Saving..." : "💾 Save Profile"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
                className="hover-button"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};
const styles = {
  container: {
    backgroundColor: "#f4f7fc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  marqueeContainer: {
    width: "100%",
    fontSize: "1.1rem",
    fontWeight: "500",
    marginBottom: "20px",
    color: "#333",
  },
  marquee: {
    animation: "scroll 15s linear infinite",
  },
  card: {
    width: "95%",
    maxWidth: "900px",
    background: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "25px",
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  field: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eaeaea",
    padding: "12px 0",
    marginBottom: "15px",
  },
  label: {
    fontWeight: "500",
    fontSize: "1rem",
    width: "30%",
    color: "#555",
  },
  input: {
    padding: "10px 12px",
    width: "60%",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none",
    background: "#fff",
    fontSize: "1rem",
    color: "#333",
  },
  value: {
    fontSize: "1rem",
    color: "#666",
    width: "60%",
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },

  // 🔶 ORANGE THEME BUTTONS
  editButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #ff7e00, #ff4b2b)", // Orange Gradient
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
  },
  saveButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #ff7e00, #ff4b2b)", // Orange Gradient
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
  },
};


export default Profile;
