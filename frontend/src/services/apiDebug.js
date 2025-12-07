/**
 * API Debug and diagnostic utilities
 * Use this to test API endpoints directly
 */

const API_ENDPOINT = 'https://37ces8ubrl.execute-api.us-east-1.amazonaws.com/prod';

/**
 * Test PUT request (Update User)
 * @param {string} userId - User ID to update
 * @param {Object} data - Data to send
 */
export const testUpdateUserDirect = async (userId, data) => {
  try {
    console.log('Testing PUT /user/:id directly...');
    const url = `${API_ENDPOINT}/user/${userId}`;
    console.log('URL:', url);
    console.log('Payload:', data);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', responseData);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || 'Update failed'}`);
    }

    return responseData;
  } catch (error) {
    console.error('Direct PUT test failed:', error);
    throw error;
  }
};

/**
 * Test DELETE request (Delete User)
 * @param {string} userId - User ID to delete
 */
export const testDeleteUserDirect = async (userId) => {
  try {
    console.log('Testing DELETE /user/:id directly...');
    const url = `${API_ENDPOINT}/user/${userId}`;
    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    const responseData = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', responseData);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || 'Delete failed'}`);
    }

    return responseData;
  } catch (error) {
    console.error('Direct DELETE test failed:', error);
    throw error;
  }
};

/**
 * Test GET request (Get All Users)
 */
export const testGetUsersDirect = async () => {
  try {
    console.log('Testing GET /users directly...');
    const url = `${API_ENDPOINT}/users`;
    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    const responseData = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', responseData);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || 'Get users failed'}`);
    }

    return responseData;
  } catch (error) {
    console.error('Direct GET test failed:', error);
    throw error;
  }
};

/**
 * Test POST request (Add User)
 * @param {Object} data - User data
 */
export const testAddUserDirect = async (data) => {
  try {
    console.log('Testing POST /user directly...');
    const url = `${API_ENDPOINT}/user`;
    console.log('URL:', url);
    console.log('Payload:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', responseData);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || 'Add user failed'}`);
    }

    return responseData;
  } catch (error) {
    console.error('Direct POST test failed:', error);
    throw error;
  }
};
