import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAuthSlice } from "../../../../Redux/Slices/AuthSlice";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/firebase";

const ServicesList = ({ noImage, data, onUpdate }) => {
  const {
    ServiceImage,
    ServiceName,
    Price,
    Description,
    category,
    Category,
    id,
  } = data;

  const authID = useSelector(getAuthSlice);
  const ProID = authID[0].id;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: ServiceName || "",
    price: Price || "",
    description: Description || "",
    category: category || Category || "",
  });

  const DeleteHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "ProfessionalDB", `${ProID}`, "Services", `${id}`))
      .then(() => {
        alert(`Service with ID ${id} has been deleted successfully.`);
      })
      .catch((err) => console.log(err));
  };

  const UpdateHandler = () => {
    setShowModal(true); // Open the modal when the update button is clicked
  };

  const onFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    const docRef = doc(
      db,
      "ProfessionalDB",
      ProID, // the professional's ID
      "Services",
      id
    );

    await updateDoc(docRef, {
      ServiceName: formData.serviceName,
      Price: formData.price,
      Description: formData.description,
      Category: formData.category,
    });

    alert("Menu updated successfully!");
    setShowModal(false); // Close modal after updating
  };

  return (
    <>
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .serviceImg {
          object-fit: contain;
          width: 100px;
          height: 120px;
        }

        @media (max-width: 576px) {
          .serviceImg {
            width: 70px !important;
            height: 90px !important;
          }
        }

        .servicebtn {
          cursor: pointer;
          font-size: 22px;
        }

        .modal {
          background-color: rgba(0,0,0,0.5);
        }

        .modal-dialog {
          max-width: 500px;
        }
      `,
    }}
  />

      <div
    className="row border-bottom pb-2 mt-2"
    style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}
  >
        <div className="col-3 col-sm-2 d-flex align-items-center">
          <img
            alt="Service"
            src={
              ServiceImage ||
              "https://static.thenounproject.com/png/3445536-200.png"
            }
            className="rounded shadow ripple serviceImg"
            style={{ objectFit: "contain", width: "100px", height: "120px" }}
          />
        </div>
        <div className="col-7 col-sm-8 d-flex align-items-center">
          <div>
            <li className="fw-semibold">{ServiceName}</li>
            <li>Rs. {Price}</li>
            <li>{Description}</li>
            <li className="text-muted small">
              Category: {category || Category || "Not specified"}
            </li>
          </div>
        </div>
        <div className="col-2 col-sm-2 d-flex align-items-center">
          <span
            className="material-icons-outlined py-1 px-1 bg-warning text-white ripple shadow rounded servicebtn me-2"
            onClick={UpdateHandler}
            title="Update Service"
          >
            edit_note
          </span>
          <span
            className="material-icons-outlined py-1 px-1 bg-danger text-white ripple shadow rounded servicebtn"
            onClick={DeleteHandler}
            title="Delete Service"
          >
            delete
          </span>
        </div>
      </div>

      {/* Modal for Updating Service */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5 className="modal-title">Update Service</h5>

              <select
                className="form-control mt-2 mb-2"
                name="category"
                value={formData.category}
                onChange={onFormChange}
              >
              <option value="">Select Food Category</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Bakery & Desserts">Bakery</option>
              <option value="Beverages">Beverages</option>
              <option value="Seafood">Seafood</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="BBQ & Grills">BBQ & Grills</option>
              <option value="Traditional Cuisine">Traditional Cuisine</option>
              <option value="Healthy & Organic">Healthy & Organic</option>
              <option value="Pakistani">Pakistani</option>
              <option value="Chinese">Chinese</option>
              <option value="Desserts">Desserts</option>
              <option value="Frozen Item">Frozen Item</option>
              <option value="Salads">Salads</option>
              </select>

              <input
                className="form-control"
                placeholder="Enter Service Name"
                name="serviceName"
                value={formData.serviceName}
                onChange={onFormChange}
              />
              <input
                className="form-control mt-2"
                placeholder="Enter Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={onFormChange}
              />
              <textarea
                className="form-control mt-2"
                placeholder="Enter Description"
                name="description"
                value={formData.description}
                onChange={onFormChange}
              ></textarea>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={handleUpdateSubmit}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesList;
