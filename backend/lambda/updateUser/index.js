const AWS = require('aws-sdk');

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Get table name from environment variable
const TABLE_NAME = process.env.TABLE_NAME || 'WebAppUsers';

/**
 * Lambda handler to update an existing user in DynamoDB
 * 
 * Expected event body:
 * {
 *   "name": "string" (optional - only fields to update)
 * }
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

  console.log('Update User Handler - Received event:', JSON.stringify(event, null, 2));

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
    // Extract userId from path parameters (support different parameter names)
    let userId = undefined;
    if (event.pathParameters) {
      userId = event.pathParameters.userId || event.pathParameters.id || Object.values(event.pathParameters)[0];
    }
    // Fallback: try to extract last segment of path
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

    // Parse request body
    let body;
    try {
      if (event.body) {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } else {
        body = {};
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

    // Prepare update expression
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Update name if provided
    if (body.name !== undefined) {
      const trimmedName = body.name.trim();
      if (!trimmedName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Name cannot be empty',
          }),
        };
      }
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = trimmedName;
    }

    // Update updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    if (updateExpressions.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No fields provided to update',
        }),
      };
    }

    // Update item in DynamoDB
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamodb.update(updateParams).promise();

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'User updated successfully',
        data: result.Attributes,
      }),
    };
  } catch (error) {
    console.error('Error updating user:', error);

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

