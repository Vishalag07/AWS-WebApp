import React from 'react';
import './Docs.css';

const Docs = () => {
  return (
    <main className="docs-page" role="main">
      <div className="docs-container">
        <header className="docs-header">
          <h1>API Documentation</h1>
          <p className="docs-subtitle">
            Complete guide to integrating with the AWS Serverless API
          </p>
        </header>

        <section className="docs-section" aria-labelledby="endpoints">
          <h2 id="endpoints">API Endpoints</h2>
          <div className="endpoint-list">
            <article className="endpoint-card">
              <div className="endpoint-header">
                <span className="method method-get">GET</span>
                <code className="endpoint-path">/users</code>
              </div>
              <p className="endpoint-description">Retrieve all users from DynamoDB</p>
              <div className="endpoint-example">
                <strong>Response:</strong>
                <pre>{`{
  "success": true,
  "users": [...],
  "count": 10
}`}</pre>
              </div>
            </article>

            <article className="endpoint-card">
              <div className="endpoint-header">
                <span className="method method-post">POST</span>
                <code className="endpoint-path">/user</code>
              </div>
              <p className="endpoint-description">Create a new user</p>
              <div className="endpoint-example">
                <strong>Request Body:</strong>
                <pre>{`{
  "userId": "user123",
  "name": "John Doe"
}`}</pre>
              </div>
            </article>

            <article className="endpoint-card">
              <div className="endpoint-header">
                <span className="method method-put">PUT</span>
                <code className="endpoint-path">/user/{'{userId}'}</code>
              </div>
              <p className="endpoint-description">Update an existing user</p>
              <div className="endpoint-example">
                <strong>Request Body:</strong>
                <pre>{`{
  "name": "Jane Doe"
}`}</pre>
              </div>
            </article>

            <article className="endpoint-card">
              <div className="endpoint-header">
                <span className="method method-delete">DELETE</span>
                <code className="endpoint-path">/user/{'{userId}'}</code>
              </div>
              <p className="endpoint-description">Delete a user from DynamoDB</p>
            </article>
          </div>
        </section>

        <section className="docs-section" aria-labelledby="integration">
          <h2 id="integration">Integration Guide</h2>
          <div className="integration-content">
            <h3>Base URL</h3>
            <code className="base-url">https://ai0iev6eil.execute-api.us-east-1.amazonaws.com/prod</code>
            
            <h3>Using AWS Amplify</h3>
            <pre className="code-block">{`import { API } from 'aws-amplify';

const response = await API.get('UserManagementAPI', '/users');`}</pre>

            <h3>Using Fetch</h3>
            <pre className="code-block">{`fetch('https://ai0iev6eil.execute-api.us-east-1.amazonaws.com/prod/users')
  .then(res => res.json())
  .then(data => console.log(data));`}</pre>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Docs;

