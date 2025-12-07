const AWS = require('aws-sdk');

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Get table name from environment variable
const TABLE_NAME = process.env.TABLE_NAME || 'WebAppUsers';

/**
 * Lambda handler to add a new user to DynamoDB
 * 
 * Expected event body:
 * {
 *   "userId": "string",
 *   "name": "string"
 * }
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
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    // Parse request body
    let body;
    try {
      // AWS_PROXY integration passes body as a string
      if (event.body) {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } else {
        // If body is not present, try to get from event directly (for testing)
        body = event;
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid JSON in request body',
        }),
      };
    }

    // Validate required fields
    if (!body || !body.userId || !body.name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields: userId and name are required',
        }),
      };
    }

    // Trim and validate input
    const userId = body.userId.trim();
    const name = body.name.trim();

    if (!userId || !name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'userId and name cannot be empty',
        }),
      };
    }

    // Check if user already exists
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
      },
    };

    const existingUser = await dynamodb.get(getParams).promise();

    if (existingUser.Item) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          success: false,
          message: `User with ID "${userId}" already exists`,
        }),
      };
    }

    // Prepare item for DynamoDB
    const item = {
      userId: userId,
      name: name,
      createdAt: new Date().toISOString(),
    };

    // Put item into DynamoDB
    const putParams = {
      TableName: TABLE_NAME,
      Item: item,
    };

    await dynamodb.put(putParams).promise();

    // Return success response
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User added successfully',
        data: item,
      }),
    };
  } catch (error) {
    console.error('Error adding user:', error);

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


