const AWS = require('aws-sdk');

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Get table name from environment variable
const TABLE_NAME = process.env.TABLE_NAME || 'WebAppUsers';

/**
 * Lambda handler to retrieve all users from DynamoDB
 * 
 * @param {Object} event - API Gateway event
 * @param {Object} context - Lambda context
 * @returns {Object} API Gateway response
 */
exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }; 
  }

  try {
    // Scan DynamoDB table to get all users
    // Note: For production with large datasets, consider using pagination
    const scanParams = {
      TableName: TABLE_NAME,
    };

    const result = await dynamodb.scan(scanParams).promise();

    // Format response
    const users = result.Items || [];

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Users retrieved successfully',
        users: users,
        count: users.length,
      }),
    };
  } catch (error) {
    console.error('Error retrieving users:', error);

    // Return error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        users: [],
      }),
    };
  }
};


