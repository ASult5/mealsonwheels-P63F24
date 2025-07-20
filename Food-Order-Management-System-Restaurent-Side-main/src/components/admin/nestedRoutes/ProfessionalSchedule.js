import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const OrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const db = getFirestore();
        const localUser = JSON.parse(localStorage.getItem("data"));
        const localShopName = localUser?.shopName;
        if (!localShopName) {
          setError("Shop name not found in local storage.");
          setLoading(false);
          return;
        }
        const ordersRef = collection(db, "orders", localShopName, "items");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
  const db = getFirestore();
  const localUser = JSON.parse(localStorage.getItem("data"));
  const localShopName = localUser?.shopName;
  if (!localShopName) {
    setError("Shop name not found in local storage.");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this order?")) return;

  try {
    await deleteDoc(doc(db, "orders", localShopName, "items", orderId));
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  } catch (err) {
    console.error("Error deleting order:", err);
    setError("Failed to delete the order.");
  }
};


  const toggleExpand = (id) => {
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // Handle checkbox toggle for delivered status
const handleDeliveredChange = async (orderId, currentDeliveredStatus) => {
  const db = getFirestore();
  const localUser = JSON.parse(localStorage.getItem("data"));
  const localShopName = localUser?.shopName;
  if (!localShopName) {
    setError("Shop name not found in local storage.");
    return;
  }

  // Update local state
  setOrders((prevOrders) =>
    prevOrders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: {
              ...order.status,
              active: false,
              delivered: !currentDeliveredStatus,
            },
          }
        : order
    )
  );

  try {
    const orderDocRef = doc(db, "orders", localShopName, "items", orderId);
    await updateDoc(orderDocRef, {
      status: {
        active: true,
        delivered: !currentDeliveredStatus,
      },
    });

    // ✅ Send email only when changed to "delivered"
    if (!currentDeliveredStatus) {
      const updatedOrder = orders.find(order => order.id === orderId);
      const response = await fetch("https://foodserver-eta.vercel.app/send-delivery-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: updatedOrder.UserOrderedFrom,
          name: updatedOrder.deliveryDetails?.name,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send delivery email.");
      }
    }
  } catch (err) {
    console.error("Error updating order status:", err);
    setError("Failed to update order status.");
  }
};


  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!orders.length) return <p>No orders found for your shop.</p>;

  return (
    <div className="container">
      <h2 className="title">
        Orders for {JSON.parse(localStorage.getItem("data"))?.shopName || "Shop"}
      </h2>

      <div className="table-scroll-wrapper">
        <table className="orders-table" role="table" aria-label="Orders Table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Email</th>
              <th scope="col">Payment</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Is Delivered</th> {/* New column */}
              <th scope="col">Date</th>
              <th scope="col">Items</th>
              <th scope="col">Address</th>
              <th scope="col">Contact</th>
              <th scope="col">Flat</th>
              <th scope="col">Customer</th>
              <th>Action</th>
            </tr>
          </thead>

        <tbody>
  {orders.map((order) => {
    const isExpanded = expandedOrderIds.includes(order.id);
    // Check if delivered is false
    const isDeliveredNo = order.status && order.status.delivered === false;

    // Style for the entire row if delivered is No
    const rowStyle = isDeliveredNo
      ? { backgroundColor: "#a8e6a3", fontWeight: "700" }
      : {};

    return (
      <React.Fragment key={order.id}>
        <tr
          className="order-row"
          onClick={() => toggleExpand(order.id)}
          title="Click to expand/collapse items"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleExpand(order.id);
          }}
          style={rowStyle} // apply style to the whole row
        >
          <td style={rowStyle}>{order.id || "N/A"}</td>
          <td style={rowStyle}>{order.UserOrderedFrom || "N/A"}</td>
          <td style={rowStyle}>{order.deliveryDetails?.paymentMethod || "N/A"}</td>
          <td style={{ ...rowStyle, textAlign: "right" }}>{order.total || "N/A"}</td>
          <td style={rowStyle}>
            {order.status ? (
              <>Delivered: {order.status.delivered ? "Yes" : "No"}</>
            ) : (
              "No status"
            )}
          </td>

          <td style={rowStyle}>
            <input
              type="checkbox"
              checked={order.status?.delivered || false}
              onChange={() =>
                handleDeliveredChange(order.id, order.status?.delivered || false)
              }
              onClick={(e) => e.stopPropagation()} // Prevent row expand on click checkbox
              aria-label={`Mark order ${order.id} as delivered`}
            />
          </td>
          <td style={rowStyle}>
            {order.createdAt?.toDate
              ? order.createdAt.toDate().toLocaleString()
              : "N/A"}
          </td>
          <td style={{ ...rowStyle, textAlign: "center" }}>
            {order.items?.length || 0}
          </td>
          <td style={rowStyle}>{order.deliveryDetails?.address || "N/A"}</td>
          <td style={rowStyle}>{order.deliveryDetails?.contact || "N/A"}</td>
          <td style={rowStyle}>{order.deliveryDetails?.flat || "N/A"}</td>
          <td style={rowStyle}>{order.deliveryDetails?.name || "N/A"}</td>
          <td style={rowStyle}>
  <button
    onClick={(e) => {
      e.stopPropagation(); // prevent row toggle
      handleDeleteOrder(order.id);
    }}
    style={{ background: "#dc2626", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px" }}
  >
    X
  </button>
</td>

        </tr>

        {isExpanded && order.items && (
          <tr className="items-row">
            <td colSpan="12">
              <div className="items-table-wrapper">
                <table className="items-table" role="table" aria-label="Order Items">
                  <thead>
                    <tr>
                      <th scope="col">Service Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Description</th>
                      <th scope="col">Price (PKR)</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Payment Option</th>
                      <th scope="col">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.ServiceName || "N/A"}</td>
                        <td>{item.Category || "N/A"}</td>
                        <td title={item.Description}>{item.Description || "N/A"}</td>
                        <td className="right-align">{item.Price || "N/A"}</td>
                        <td className="center-align">{item.quantity || "N/A"}</td>
                        <td>{order.deliveryDetails?.paymentMethod || "N/A"}</td>
                        <td>
                          {item.ServiceImage ? (
                            <img
                              src={item.ServiceImage}
                              alt={item.ServiceName}
                              className="item-image"
                            />
                          ) : (
                            "No image"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  })}
</tbody>

        </table>
      </div>

      
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 15px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 700;
          color: #222;
          user-select: none;
          flex-shrink: 0;
        }
        .table-scroll-wrapper {
          flex-grow: 1;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          min-width: 1900px;
          table-layout: fixed;
        }
        thead tr {
          background-color: #1e3a8a; /* Indigo-900 */
          color: #fff;
          user-select: none;
          position: sticky;
          top: 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          z-index: 2;
        }
        th,
        td {
          padding: 12px 16px;
          border: 1px solid #ddd;
          text-align: left;
          vertical-align: middle;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        th {
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.03em;
        }
        .order-row {
          cursor: pointer;
          transition: background-color 0.25s ease;
        }
        .order-row:hover,
        .order-row:focus {
          background-color: #f3f4f6; /* Light gray */
          outline: none;
        }
        .items-row td {
          background-color: #f9fafb;
          padding: 0;
          border: none;
        }
        .items-table-wrapper {
          padding: 15px 20px;
          overflow-x: auto;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
          table-layout: fixed;
        }
        .items-table th,
        .items-table td {
          padding: 10px 12px;
          border: 1px solid #ddd;
          font-size: 0.9rem;
          word-break: break-word;
        }
        .items-table th {
          background-color: #2563eb; /* Blue-600 */
          color: #fff;
          font-weight: 600;
        }
        .right-align {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .center-align {
          text-align: center;
        }
        .item-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .container {
            max-width: 100%;
            padding: 0 10px;
          }
          table {
            min-width: 800px;
          }
          .items-table {
            min-width: 600px;
          }
        }

        @media (max-width: 768px) {
          .title {
            font-size: 1.4rem;
          }
          table {
            min-width: 1900px;
            font-size: 0.85rem;
          }
          .items-table {
            min-width: 600px;
            font-size: 0.8rem;
          }
          th,
          td {
            padding: 8px 10px;
          }
          .item-image {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 1.2rem;
          }
          table {
            min-width: 1500px;
            font-size: 0.75rem;
          }
          .items-table {
            min-width: 550px;
            font-size: 0.7rem;
          }
          th,
          td {
            padding: 6px 8px;
          }
          .item-image {
            width: 35px;
            height: 35px;
          }
          /* For mobile: add some bottom padding to rows */
          .order-row {
            line-height: 1.2;
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersComponent;
