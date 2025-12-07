const AWS = require('aws-sdk');

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Get table name from environment variable
const TABLE_NAME = process.env.TABLE_NAME || 'WebAppUsers';

/**
 * Lambda handler to delete a user from DynamoDB
 * 
 * Path parameter: userId
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  console.log('Delete User Handler - Received event:', JSON.stringify(event, null, 2));

  // Handle preflight OPTIONS request
  const method = event.httpMethod || event.requestContext?.http?.method;
  if (method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  try {
    // Extract userId from path parameters (support different param names)
    let userId = undefined;
    if (event.pathParameters) {
      userId = event.pathParameters.userId || event.pathParameters.id || Object.values(event.pathParameters)[0];
    }
    if (!userId && event.path) {
      const parts = event.path.split('/').filter(Boolean);
      userId = parts.length ? parts[parts.length - 1] : undefined;
    }
    if (userId) userId = String(userId).trim();

    console.log('Extracted userId:', userId);

    if (!userId || userId.toLowerCase() === 'user') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'User ID is required in path parameters',
        }),
      };
    }

    // Check if user exists
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
      },
    };

    const existingUser = await dynamodb.get(getParams).promise();

    if (!existingUser.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: `User with ID "${userId}" not found`,
        }),
      };
    }

    // Delete item from DynamoDB
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
      },
    };

    await dynamodb.delete(deleteParams).promise();

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User deleted successfully',
        data: {
          userId: userId,
        },
      }),
    };
  } catch (error) {
    console.error('Error deleting user:', error);

    // Return error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};


