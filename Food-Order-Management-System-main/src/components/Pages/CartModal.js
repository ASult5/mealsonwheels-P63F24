import React, { useEffect } from 'react';

const CartModal = ({ show, handleClose, serviceName }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, handleClose]);

  if (!show) return null;

  return (
    <>
      <style>
        {`
          @keyframes fadeSlideIn {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '2rem 2.5rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            width: '90%',
            maxWidth: '400px',
            animation: 'fadeSlideIn 0.4s ease-out',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.6rem',
              color: '#111',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            ✅ Added to Cart
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: '#555',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 600, color: '#007bff' }}>{serviceName}</span> has been successfully added to your cart.
          </p>
        </div>
      </div>
    </>
  );
};

export default CartModal;
