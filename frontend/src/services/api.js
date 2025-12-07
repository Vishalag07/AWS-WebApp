import { API } from 'aws-amplify';
import { userServiceDirect } from './apiDirect';

// API Gateway endpoint name from amplifyconfiguration.json
const API_NAME = 'UserManagementAPI';

// Use Amplify API to handle CORS properly
const USE_DIRECT_API = false;

/**
 * Helper function to handle API errors with detailed logging
 */
const handleApiError = (error) => {
  console.error('API Error Details:', {
    message: error.message,
    status: error.response?.status,
    body: error.response?.body,
    data: error.response?.data,
    errorType: error.__type,
  });
  
  let message = 'An error occurred';
  
  // Handle Amplify error response
  if (error.response) {
    const body = error.response.body || error.response.data;
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        message = parsed.message || parsed.error || body;
      } catch (e) {
        message = body;
      }
    } else if (body && typeof body === 'object') {
      message = body.message || body.error || error.message;
    } else {
      message = error.message;
    }
  } else if (error.message) {
    message = error.message;
  }
  
  throw new Error(message);
};

export const userService = {
  /**
   * Add a new user to the database
   * @param {Object} userData - User data containing userId and name
   * @returns {Promise} API response
   */
  addUser: async (userData) => {
    try {
      console.log('Adding user:', userData);
      const response = await API.post(API_NAME, '/user', {
        body: userData,
      });
      console.log('Add response:', response);
      return response;
    } catch (error) {
      console.error('Add error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Get all users from the database
   * @returns {Promise} API response with users array
   */
  getAllUsers: async () => {
    try {
      console.log('Getting all users');
      const response = await API.get(API_NAME, '/users');
      console.log('Get response:', response);
      return response;
    } catch (error) {
      console.error('Get error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Update an existing user
   * @param {string} userId - User ID to update
   * @param {Object} userData - Updated user data
   * @returns {Promise} API response
   */
  updateUser: async (userId, userData) => {
    try {
      console.log('Updating user:', { userId, userData });
      // Provide explicit headers so API Gateway receives the correct content type
      const response = await API.put(API_NAME, `/user/${userId}`, {
        body: userData,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Update response:', response);
      return response;
    } catch (error) {
      console.error('Update error:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Delete a user from the database
   * @param {string} userId - User ID to delete
   * @returns {Promise} API response
   */
  deleteUser: async (userId) => {
    try {
      console.log('Deleting user:', { userId });
      // Provide an init object to ensure Amplify uses correct headers
      const response = await API.del(API_NAME, `/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Delete response:', response);
      return response;
    } catch (error) {
      console.error('Delete error:', error);
      throw handleApiError(error);
    }
  },
};

export default userService;

