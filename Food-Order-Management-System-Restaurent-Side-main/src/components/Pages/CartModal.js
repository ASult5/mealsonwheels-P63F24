import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CartModal = ({ show, handleClose, serviceName }) => {
  const [hover, setHover] = useState(false);

  const styles = {
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: '2rem 2.5rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#1a1a1a',
      minWidth: 380,
      textAlign: 'center',
      animation: 'slideFadeIn 0.3s ease forwards',
    },
    header: {
      fontWeight: '700',
      fontSize: '1.6rem',
      color: '#212529',
      borderBottom: 'none',
      paddingBottom: '1rem',
    },
    bodyText: {
      fontSize: '1.1rem',
      marginBottom: '2rem',
      color: '#4a4a4a',
      lineHeight: 1.6,
    },
    serviceName: {
      fontWeight: '700',
      color: '#007bff', // bootstrap primary blue accent
    },
    footer: {
      borderTop: 'none',
      display: 'flex',
      justifyContent: 'center',
      paddingTop: 0,
    },
    button: {
      backgroundColor: hover ? '#0056b3' : '#007bff',
      border: 'none',
      padding: '0.7rem 2.2rem',
      fontWeight: '600',
      fontSize: '1rem',
      borderRadius: 6,
      cursor: 'pointer',
      color: '#fff',
      transition: 'background-color 0.25s ease',
      boxShadow: '0 6px 15px rgba(0, 123, 255, 0.3)',
      userSelect: 'none',
    },
  };

  return (
    <>
      <style>{`
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-content {
          border-radius: 12px !important;
        }
        .btn-close {
          filter: brightness(0.6);
          transition: filter 0.2s ease;
        }
        .btn-close:hover {
          filter: brightness(1);
        }
      `}</style>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
          <Modal.Title style={styles.header}>Added to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalContent}>
          <p style={styles.bodyText}>
            <span style={styles.serviceName}>{serviceName}</span> has been successfully added to your cart.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CartModal;
