/**
 * Direct API Service using Fetch
 * This is a fallback for Amplify's REST API client
 * Uses native fetch to avoid any Amplify-related issues
 */

const API_ENDPOINT = 'https://37ces8ubrl.execute-api.us-east-1.amazonaws.com/prod';

const handleApiResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      typeof data === 'object' && data.message
        ? data.message
        : `HTTP ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const userServiceDirect = {
  /**
   * Add a new user to the database
   */
  addUser: async (userData) => {
    const response = await fetch(`${API_ENDPOINT}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(userData),
    });
    return handleApiResponse(response);
  },

  /**
   * Get all users from the database
   */
  getAllUsers: async () => {
    const response = await fetch(`${API_ENDPOINT}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    return handleApiResponse(response);
  },

  /**
   * Update an existing user
   */
  updateUser: async (userId, userData) => {
    console.log('Direct update request:', { userId, userData });
    const response = await fetch(`${API_ENDPOINT}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(userData),
    });
    const result = await handleApiResponse(response);
    console.log('Direct update response:', result);
    return result;
  },

  /**
   * Delete a user from the database
   */
  deleteUser: async (userId) => {
    console.log('Direct delete request:', { userId });
    const response = await fetch(`${API_ENDPOINT}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });
    const result = await handleApiResponse(response);
    console.log('Direct delete response:', result);
    return result;
  },
};
