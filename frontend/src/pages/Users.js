import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import DeleteModal from '../components/DeleteModal';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.userId);
    setEditName(user.name);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName('');
  };

  const handleUpdate = async (userId) => {
    if (!editName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setActionLoading(userId);
    setError(null);
    try {
      await userService.updateUser(userId, { name: editName.trim() });
      await fetchUsers();
      setEditingUser(null);
      setEditName('');
    } catch (err) {
      setError(err.message || 'Failed to update user. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return;

    setActionLoading(deleteModal.user.userId);
    setError(null);
    try {
      await userService.deleteUser(deleteModal.user.userId);
      await fetchUsers();
      setDeleteModal({ isOpen: false, user: null });
    } catch (err) {
      setError(err.message || 'Failed to delete user. Please try again.');
      setDeleteModal({ isOpen: false, user: null });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>All Users</h1>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>All Users</h1>
          <p className="page-subtitle">Manage your user database</p>
        </div>
        <button 
          onClick={fetchUsers} 
          className="btn btn-refresh"
          disabled={loading}
        >
          <span>🔄</span>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
          <p>Get started by adding your first user</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.userId} className="user-card">
              {editingUser === user.userId ? (
                <div className="edit-mode">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter user name"
                      className="edit-input"
                      autoFocus
                    />
                  </div>
                  <div className="edit-actions">
                    <button
                      className="btn btn-save"
                      onClick={() => handleUpdate(user.userId)}
                      disabled={actionLoading === user.userId}
                    >
                      {actionLoading === user.userId ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="btn btn-cancel-edit"
                      onClick={handleCancelEdit}
                      disabled={actionLoading === user.userId}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="user-header">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <p className="user-id">ID: {user.userId}</p>
                    </div>
                  </div>
                  {user.createdAt && (
                    <div className="user-meta">
                      <span className="meta-item">
                        📅 Created: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      {user.updatedAt && (
                        <span className="meta-item">
                          ✏️ Updated: {new Date(user.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="user-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(user)}
                      disabled={actionLoading !== null}
                    >
                      <span>✏️</span> Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteClick(user)}
                      disabled={actionLoading !== null}
                    >
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteConfirm}
        userName={deleteModal.user?.name}
        userId={deleteModal.user?.userId}
      />
    </div>
  );
};

export default Users;
