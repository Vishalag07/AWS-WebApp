# Project Structure

```
AWS/
│
├── frontend/                          # React Frontend Application
│   ├── public/
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.js               # Landing page
│   │   │   ├── AddUser.js            # Add user form
│   │   │   └── Users.js              # Users list page
│   │   ├── services/
│   │   │   └── api.js                # API service layer (Axios)
│   │   ├── App.js                    # Main app component with routing
│   │   ├── App.css                   # App styles
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── package.json                  # Frontend dependencies
│   └── env.example                   # Environment variables template
│
├── backend/                           # Lambda Backend Functions
│   ├── lambda/
│   │   ├── addUser/
│   │   │   └── index.js              # Lambda: Create user in DynamoDB
│   │   ├── getUsers/
│   │   │   └── index.js              # Lambda: Get all users from DynamoDB
│   │   └── deploy.sh                 # Deployment script for Lambda functions
│   └── package.json                  # Backend dependencies
│
├── infrastructure/                    # Infrastructure as Code
│   ├── api-gateway.yaml              # OpenAPI 3.0 spec for API Gateway
│   ├── iam-policy.json               # IAM policy for Lambda functions
│   ├── dynamodb-setup.sh             # Script to create DynamoDB table
│   └── lambda-role-setup.sh          # Script to create IAM role
│
├── README.md                          # Main documentation
├── DEPLOYMENT.md                      # Step-by-step deployment guide
├── ARCHITECTURE.md                    # Architecture documentation
├── PROJECT_STRUCTURE.md               # This file
├── package.json                       # Root package.json with scripts
└── .gitignore                        # Git ignore rules
```

## File Descriptions

### Frontend Files

- **Home.js**: Welcome page with application overview
- **AddUser.js**: Form component to add new users with validation
- **Users.js**: Component to display all users with refresh functionality
- **api.js**: Centralized API service using Axios with error handling
- **App.js**: Main application component with React Router setup

### Backend Files

- **addUser/index.js**: Lambda function to create users in DynamoDB
  - Validates input
  - Checks for duplicates
  - Returns structured JSON responses
  
- **getUsers/index.js**: Lambda function to retrieve all users
  - Scans DynamoDB table
  - Returns users array with count

### Infrastructure Files

- **api-gateway.yaml**: OpenAPI specification for API Gateway
  - Defines POST /user and GET /users endpoints
  - Includes CORS configuration
  - Lambda integration settings

- **iam-policy.json**: IAM policy document
  - DynamoDB permissions (PutItem, GetItem, Scan)
  - CloudWatch Logs permissions
  - Least privilege principle

- **dynamodb-setup.sh**: Bash script to create DynamoDB table
  - Creates WebAppUsers table
  - Configures partition key
  - Sets up on-demand billing

- **lambda-role-setup.sh**: Bash script to create IAM role
  - Creates Lambda execution role
  - Attaches DynamoDB policy
  - Returns role ARN

## Key Features

### Frontend
✅ React Router for navigation
✅ Form validation and error handling
✅ Loading states and user feedback
✅ Responsive design
✅ Environment-based API configuration
✅ Axios interceptors for error handling

### Backend
✅ Input validation
✅ Duplicate user checking
✅ Error handling with proper HTTP status codes
✅ CORS support
✅ Environment variable configuration
✅ Structured JSON responses

### Infrastructure
✅ Infrastructure as Code scripts
✅ IAM least privilege policies
✅ DynamoDB on-demand scaling
✅ API Gateway REST API
✅ CORS configuration

## Quick Start Commands

```bash
# Install all dependencies
npm run install-all

# Start frontend development server
npm start

# Build frontend for production
npm run build

# Deploy Lambda functions (after configuration)
cd backend/lambda
chmod +x deploy.sh
./deploy.sh
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://ai0iev6eil.execute-api.us-east-1.amazonaws.com/prod
```

### Lambda Functions
```
TABLE_NAME=WebAppUsers
```

## Next Steps

1. Review all files
2. Configure AWS CLI
3. Follow DEPLOYMENT.md for step-by-step setup
4. Read ARCHITECTURE.md for detailed architecture
5. Deploy and test the application


