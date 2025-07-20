import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase";
import Loader from "../../Loader/loader";

const TableBooking = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const localData = JSON.parse(localStorage.getItem("data"));
        const userEmail = localData?.email || null;
        const userName = localData?.name || null;

        if (!userEmail && !userName) {
          console.error("Email or Name not found in localStorage");
          return;
        }

        const professionalsRef = collection(db, "ProfessionalDB");
        const q = query(
          professionalsRef,
          where(userEmail ? "email" : "name", "==", userEmail || userName)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.error("No matching restaurant found for this user.");
          return;
        }

        const professionalDoc = querySnapshot.docs[0];
        const restaurantId = professionalDoc.id;
        const restaurant = professionalDoc.data();
        setRestaurantData(restaurant);

        const bookingsRef = collection(db, "tableBookings");
        const bookingsQuery = query(
          bookingsRef,
          where("restaurantId", "==", restaurantId)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);

        const bookingsData = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle checkbox toggle
const handleConfirmChange = async (bookingId, checked, booking) => {
  try {
    // Update in Firestore
    const bookingDocRef = doc(db, "tableBookings", bookingId);
    await updateDoc(bookingDocRef, {
      Confirm: checked ? "Confirmed" : "Not Confirmed Yet",
    });

    // Update local state
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, Confirm: checked ? "Confirmed" : "Not Confirmed Yet" } : b
      )
    );

    // If confirmed, call API to send email
    if (checked) {
      // Send booking info to API
      await fetch("foodserver-eta.vercel.app/send-confirmtablebooking-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantEmail: restaurantData?.email,
          restaurantName: restaurantData?.name,
          userName: booking.userName,
          userEmail: booking.userEmail,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          numberOfGuests: booking.numberOfGuests,
        }),
      });
    }
  } catch (error) {
    console.error("Error updating confirmation status or sending email:", error);
  }
};


  if (loading) return <Loader />;

  return (
    <div>
      <h3 className="mb-3">Table Reservations</h3>
      {bookings.length > 0 ? (
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Booking Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Is Confirmed</th>
                <th>Confirm Now</th> {/* New column */}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.bookingTime}</td>
                  <td>{booking.numberOfGuests}</td>
                  <td>{booking.userName}</td>
                  <td>{booking.userEmail}</td>
                  <td
                    className={
                      booking.Confirm &&
                      booking.Confirm.trim().toLowerCase() === "not confirmed yet"
                        ? "bg-danger text-white"
                        : booking.Confirm &&
                          booking.Confirm.trim().toLowerCase() === "confirmed"
                        ? "bg-success text-white"
                        : ""
                    }
                  >
                    {booking.Confirm}
                  </td>
                  <td>
                    <input
  type="checkbox"
  checked={booking.Confirm?.toLowerCase() === "confirmed"}
  onChange={(e) => handleConfirmChange(booking.id, e.target.checked, booking)}
/>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-danger">No bookings found for this restaurant.</p>
      )}
    </div>
  );
};

export default TableBooking;
