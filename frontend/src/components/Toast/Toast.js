import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';

const Toast = ({ show, message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      minWidth: '300px'
    }}>
      <Alert 
        color={type} 
        isOpen={visible} 
        toggle={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
      >
        {message}
      </Alert>
    </div>
  );
};

export default Toast;
