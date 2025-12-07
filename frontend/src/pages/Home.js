import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useParallax } from '../hooks/useParallax';
import './Home.css';

const Home = () => {
  const parallaxOffset = useParallax(0.3);
  const heroSectionRef = useRef(null);

  // Parallax effect for hero background
  useEffect(() => {
    if (heroSectionRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        heroSectionRef.current.style.setProperty('--parallax-offset', `${parallaxOffset}px`);
      }
    }
  }, [parallaxOffset]);

  const awsServices = [
    {
      name: 'AWS Amplify',
      description: 'Frontend hosting and deployment with global CDN',
      icon: '🚀',
      badge: 'Hosting',
      link: 'https://aws.amazon.com/amplify/'
    },
    {
      name: 'API Gateway',
      description: 'RESTful API management and endpoint routing',
      icon: '🌐',
      badge: 'API',
      link: 'https://aws.amazon.com/api-gateway/'
    },
    {
      name: 'AWS Lambda',
      description: 'Serverless compute for scalable backend functions',
      icon: '⚡',
      badge: 'Compute',
      link: 'https://aws.amazon.com/lambda/'
    },
    {
      name: 'DynamoDB',
      description: 'Fast and flexible NoSQL database service',
      icon: '💾',
      badge: 'Database',
      link: 'https://aws.amazon.com/dynamodb/'
    },
    {
      name: 'IAM',
      description: 'Secure access control and identity management',
      icon: '🔒',
      badge: 'Security',
      link: 'https://aws.amazon.com/iam/'
    }
  ];

  const featurePills = [
    { id: 1, icon: '☁️', text: 'Cloud Hosting' },
    { id: 2, icon: '⚡', text: 'Serverless' },
    { id: 3, icon: '🔒', text: 'Secure' },
    { id: 4, icon: '📊', text: 'Scalable' }
  ];

  return (
    <main className="home-page" role="main">
      {/* Hero Section */}
      <section 
        ref={heroSectionRef}
        className="hero-section" 
        aria-label="Hero section"
      >
        <div className="hero-background-parallax" aria-hidden="true"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title hero-title-animate">
                Build Scalable Applications with{' '}
                <span className="gradient-text">AWS Serverless</span>
              </h1>
              <p className="hero-tagline hero-tagline-animate">
                A production-ready full-stack application showcasing modern cloud architecture
                with React, Lambda, DynamoDB, and API Gateway.
              </p>
              <div className="hero-cta hero-cta-animate">
                <Link 
                  to="/user" 
                  className="btn btn-primary"
                  aria-label="Navigate to add user page"
                >
                  Add User
                </Link>
                <Link 
                  to="/users" 
                  className="btn btn-secondary"
                  aria-label="Navigate to view all users page"
                >
                  View Users
                </Link>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="floating-pills-container">
                {featurePills.map((pill, index) => (
                  <div
                    key={pill.id}
                    className="floating-pill"
                    style={{ 
                      '--animation-delay': `${index * 200}ms`,
                      '--float-delay': `${index * 0.5}s`
                    }}
                  >
                    <span className="pill-icon" aria-hidden="true">{pill.icon}</span>
                    <span className="pill-text">{pill.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AWS Services Section */}
      <section className="services-section" aria-label="AWS Services">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Powered by AWS Services</h2>
            <p className="section-subtitle">
              Built with industry-leading cloud technologies for scalability and reliability
            </p>
          </div>
          <div className="services-grid" role="list">
            {awsServices.map((service, index) => (
              <article 
                key={index} 
                className="service-card"
                role="listitem"
              >
                <div className="service-icon-wrapper">
                  <span className="service-icon" aria-hidden="true">{service.icon}</span>
                </div>
                <div className="service-content">
                  <div className="service-header">
                    <h3 className="service-name">{service.name}</h3>
                    <span className="service-badge">{service.badge}</span>
                  </div>
                  <p className="service-description">{service.description}</p>
                  <a 
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-link"
                    aria-label={`View ${service.name} documentation`}
                  >
                    View docs →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Strip */}
      <section className="features-strip" aria-label="Key Features">
        <div className="section-container">
          <div className="features-horizontal">
            <div className="feature-item">
              <span className="feature-icon-large" aria-hidden="true">✅</span>
              <div>
                <h4 className="feature-title">Add and manage users</h4>
                <p className="feature-text">Simple interface for user management</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon-large" aria-hidden="true">👁️</span>
              <div>
                <h4 className="feature-title">View all users</h4>
                <p className="feature-text">Real-time data from DynamoDB</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon-large" aria-hidden="true">🔐</span>
              <div>
                <h4 className="feature-title">Secure API endpoints</h4>
                <p className="feature-text">IAM authentication and authorization</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon-large" aria-hidden="true">📈</span>
              <div>
                <h4 className="feature-title">Scalable architecture</h4>
                <p className="feature-text">Serverless that grows with you</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
