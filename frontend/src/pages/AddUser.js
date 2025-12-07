import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './AddUser.css';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.userId.trim() || !formData.name.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await userService.addUser(formData);
      setSuccess(`User "${formData.name}" added successfully!`);
      setFormData({ userId: '', name: '' });
      
      // Redirect to users page after 2 seconds
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-page-header">
        <h1>Add New User</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="user-form">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              {success}
              <p className="redirect-message">Redirecting to users page...</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="userId">
              User ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Enter unique user ID (e.g., user001)"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter user's full name"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Adding User...
                </>
              ) : (
                <>
                  <span>➕</span>
                  Add User
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/users')}
              disabled={loading}
            >
              View All Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
