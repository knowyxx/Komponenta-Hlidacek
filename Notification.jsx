import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    // Notifikace automaticky zmizí po 4 sekundách
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  // Jednoduché styly podle typu notifikace
  const styles = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 24px',
    borderRadius: '4px',
    color: '#fff',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    backgroundColor: type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={styles}>
      {message}
    </div>
  );
};

export default Notification;