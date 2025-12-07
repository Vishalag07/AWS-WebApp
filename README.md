# AWS Full-Stack Web Application

A production-ready full-stack application built with AWS services, featuring a React frontend, serverless Lambda backend, DynamoDB database, and secure IAM roles.

## Architecture Overview

```
┌─────────────────┐
│  AWS Amplify    │  ← Frontend Hosting (React)
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│  API Gateway     │  ← REST API Endpoint
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Lambda  │   │ Lambda  │   │ Lambda  │
    │ addUser │   │getUsers │   │  (CORS) │
    └────┬────┘   └────┬────┘   └─────────┘
         │             │
         └──────┬──────┘
                ▼
         ┌─────────────┐
         │  DynamoDB    │
         │ WebAppUsers  │
         └─────────────┘
```

## Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **AWS Amplify** - Frontend hosting and deployment

### Backend
- **AWS Lambda** - Serverless compute
- **API Gateway** - REST API management
- **DynamoDB** - NoSQL database
- **IAM** - Secure access control

## Project Structure

```
AWS/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── AddUser.js
│   │   │   └── Users.js
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── backend/                  # Lambda functions
│   ├── lambda/
│   │   ├── addUser/
│   │   │   └── index.js
│   │   └── getUsers/
│   │       └── index.js
│   └── package.json
│
├── infrastructure/           # Infrastructure as Code
│   ├── api-gateway.yaml     # OpenAPI spec
│   ├── iam-policy.json      # IAM policy document
│   ├── dynamodb-setup.sh    # DynamoDB table creation
│   └── lambda-role-setup.sh # IAM role creation
│
├── README.md
└── .gitignore
```

## Prerequisites

- **AWS Account** with appropriate permissions
- **AWS CLI** installed and configured
- **Node.js** (v16 or higher) and npm
- **Git** for version control

## Setup Instructions

### 1. Configure AWS CLI

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Default output format (e.g., `json`)

### 2. Create DynamoDB Table

```bash
cd infrastructure
chmod +x dynamodb-setup.sh
./dynamodb-setup.sh
```

Or manually:

```bash
aws dynamodb create-table \
  --table-name WebAppUsers \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 3. Create IAM Role for Lambda

```bash
cd infrastructure
chmod +x lambda-role-setup.sh
./lambda-role-setup.sh
```

**Note the Role ARN** - you'll need it when creating Lambda functions.

### 4. Deploy Lambda Functions

#### Option A: Using AWS CLI

**Package and deploy addUser function:**

```bash
cd backend/lambda/addUser
zip -r addUser.zip index.js
```

```bash
aws lambda create-function \
  --function-name addUser \
  --runtime nodejs18.x \
  --role arn:aws:iam::352196746417:role/LambdaDynamoDBWebAppRole \
  --handler index.handler \
  --zip-file fileb://addUser.zip \
  --environment Variables={TABLE_NAME=WebAppUsers} \
  --timeout 30 \
  --region us-east-1
```

**Package and deploy getUsers function:**

```bash
cd backend/lambda/getUsers
zip -r getUsers.zip index.js
```

```bash
aws lambda create-function \
  --function-name getUsers \
  --runtime nodejs18.x \
  --role arn:aws:iam::352196746417:role/LambdaDynamoDBWebAppRole \
  --handler index.handler \
  --zip-file fileb://getUsers.zip \
  --environment Variables={TABLE_NAME=WebAppUsers} \
  --timeout 30 \
  --region us-east-1
```

#### Option B: Using AWS Console

1. Go to AWS Lambda Console
2. Create function → Author from scratch
3. Configure:
   - Function name: `addUser` or `getUsers`
   - Runtime: Node.js 18.x
   - Architecture: x86_64
4. Under "Change default execution role":
   - Use existing role: `LambdaDynamoDBWebAppRole`
5. Upload the code from `backend/lambda/[function-name]/index.js`
6. Add environment variable: `TABLE_NAME = WebAppUsers`
7. Save and deploy

### 5. Create API Gateway REST API

#### Option A: Using AWS Console

1. Go to API Gateway Console
2. Create API → REST API → Build
3. Choose "REST" protocol
4. Create resources:
   - `/user` (POST method)
   - `/users` (GET method)
5. For each method:
   - Integration type: Lambda Function
   - Select the corresponding Lambda function
   - Enable CORS
6. Deploy API to a stage (e.g., `prod`)
7. **Note the API endpoint URL** (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

#### Option B: Using OpenAPI Spec

```bash
aws apigateway import-rest-api \
  --body file://infrastructure/api-gateway.yaml \
  --region us-east-1
```

**Note:** You'll need to update the Lambda ARNs in the YAML file first.

### 6. Configure Frontend

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your API Gateway URL:

```env
REACT_APP_API_URL=https://ai0iev6eil.execute-api.us-east-1.amazonaws.com/prod
```

5. Start development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

### 7. Deploy Frontend with AWS Amplify

#### Option A: Using Amplify Console (Recommended)

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect your Git repository (GitHub, GitLab, Bitbucket)
4. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. Add environment variable:
   - `REACT_APP_API_URL` = Your API Gateway URL
6. Save and deploy

#### Option B: Using Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
amplify init
amplify add hosting
amplify publish
```

## API Endpoints

### POST /user
Add a new user to the database.

**Request Body:**
```json
{
  "userId": "user123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User added successfully",
  "data": {
    "userId": "user123",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400/409/500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET /users
Retrieve all users from the database.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "users": [
    {
      "userId": "user123",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

## Security Best Practices

1. **IAM Least Privilege**: Lambda functions only have access to the specific DynamoDB table
2. **CORS Configuration**: Properly configured for frontend domain
3. **Input Validation**: All user inputs are validated before processing
4. **Error Handling**: Sensitive error details are hidden in production
5. **Environment Variables**: Sensitive data stored in environment variables

## Cost Optimization

- **DynamoDB**: Using PAY_PER_REQUEST billing mode (pay only for what you use)
- **Lambda**: Free tier includes 1M requests/month
- **API Gateway**: Free tier includes 1M API calls/month
- **Amplify**: Free tier includes 5GB storage and 15GB transfer/month

## Monitoring & Logging

- **CloudWatch Logs**: All Lambda functions log to CloudWatch
- **API Gateway Logs**: Enable access logging for API monitoring
- **DynamoDB Metrics**: Monitor table usage in CloudWatch

## Troubleshooting

### Frontend can't connect to API
- Verify `REACT_APP_API_URL` is set correctly
- Check API Gateway CORS configuration
- Verify API Gateway is deployed to the correct stage

### Lambda function errors
- Check CloudWatch Logs for error details
- Verify IAM role has correct permissions
- Ensure `TABLE_NAME` environment variable is set

### DynamoDB access denied
- Verify IAM role policy includes DynamoDB permissions
- Check resource ARN matches your table name
- Ensure table exists in the correct region

## Development

### Local Development

1. **Frontend**: `npm start` in `frontend/` directory
2. **Backend**: Use AWS SAM or Serverless Framework for local Lambda testing
3. **Database**: Use DynamoDB Local for local development

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## Production Deployment Checklist

- [ ] DynamoDB table created and configured
- [ ] IAM roles and policies created
- [ ] Lambda functions deployed with correct environment variables
- [ ] API Gateway configured with CORS enabled
- [ ] Frontend environment variables configured
- [ ] Amplify hosting configured
- [ ] Domain name configured (optional)
- [ ] SSL certificate configured (automatic with Amplify)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented

## Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [React Documentation](https://react.dev/)

## License

This project is provided as-is for educational and production use.

## Support

For issues or questions:
1. Check CloudWatch Logs for errors
2. Verify all prerequisites are met
3. Review AWS service quotas and limits
4. Consult AWS documentation for service-specific issues

---

**Built with ❤️ using AWS Serverless Architecture**


