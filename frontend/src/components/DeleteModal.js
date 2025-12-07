import React from 'react';
import './DeleteModal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, userName, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Delete</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <p>
            Are you sure you want to delete <strong>{userName}</strong>?
          </p>
          <p className="modal-subtext">
            User ID: <code>{userId}</code>
          </p>
          <p className="modal-warning">
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-delete" onClick={onConfirm}>
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

