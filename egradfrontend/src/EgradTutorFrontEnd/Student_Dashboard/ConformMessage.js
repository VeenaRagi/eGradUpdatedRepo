

// ConfirmModal.js
import React from 'react';

const ConformMessage = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>OK</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConformMessage;
