import React from 'react';
import './Modal.css';

// 1. Destructure the new 'customClass' prop
export default function Modal({ isOpen, onClose, title, children, customClass }) {
  if (!isOpen) return null;

  return (
    // 2. Apply the customClass to the main modal container/overlay
    // This allows styling the *entire* modal wrapper from the parent component.
    <div className={`modal-overlay ${customClass || ''}`}> 
      
      {/* 3. It's often better to apply size to the inner content container */}
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}