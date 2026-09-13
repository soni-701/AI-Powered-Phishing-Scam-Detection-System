AI-Powered Phishing & Scam Detection System

An AI-powered full-stack security platform that detects phishing URLs and scam/spam messages using machine learning and rule-based security analysis.

The system provides risk scoring, prediction confidence, detection reasons, scan history, analytics, and downloadable threat reports.

Overview

Phishing and scam attacks often use malicious URLs and deceptive messages to trick users into interacting with harmful content.

This project provides a web-based security platform where users can:

Scan URLs for phishing indicators

Scan messages for scam and spam indicators

View risk scores and prediction confidence

Understand why an input was classified as risky

Review previous scans

View security analytics

Export threat reports as CSV

Download detailed PDF reports

Manage account and security settings

Key Features

URL Phishing Detection

HTTP and HTTPS URL validation

Extraction of 18 lexical URL features

Random Forest based phishing classification

Rule-based security analysis

Trusted-domain protection

Risk score from 0 to 100

Final security decision: SAFE, SUSPICIOUS, or HIGH RISK

ML prediction and confidence

Detailed URL feature extraction

Message Scam Detection

Message validation

TF-IDF text vectorization

Logistic Regression classification

Rule-based analysis

Risk scoring

Spam/Ham prediction

Prediction confidence

Detection findings and reasons

Analytics

Total scans

URL scan statistics

Message scan statistics

Safe, suspicious, and high-risk distribution

Threat categories

Recent threat activity

Daily detection activity

ML prediction distribution

Model evaluation information

Database summary

Threat Reports

Complete scan history

Search and filtering

URL and message report details

Detection findings

ML prediction details

URL feature analysis

CSV export

PDF report generation

User Management

Registered user list

User search

Status filtering

Role filtering UI

User profile view

The current application uses the User role. Admin and Analyst role-based access control are planned as future improvements.

Settings

Account information

Security preferences

Threat alerts

Security notifications

Email alerts

Automatic URL scanning preference

Change password

Detection engine information

Logout

Authentication and Security

JWT authentication

Password hashing with bcrypt

Protected API routes

Rate limiting

CORS protection

Helmet security headers

JSON request-size limits

Input validation

Centralized error handling

System Architecture

                         +--------------------------+
                         |      React Frontend      |
                         |      Vite + Tailwind     |
                         +------------+-------------+
                                      |
                                  REST API
                                      |
                                      v
                         +--------------------------+
                         |     Node.js Backend      |
                         |       Express + JWT      |
                         +-----------+------+-------+
                                     |      |
                         +-----------+      +----------------+
                         |                                 |
                         v                                 v
                +------------------+             +------------------+
                |   MongoDB Atlas  |             |   Python ML API  |
                |   Users + Scans  |             | Flask + ML       |
                +------------------+             +--------+---------+
                                                         |
                                      +------------------+------------------+
                                      |                                     |
                                      v                                     v
                              SMS Spam Model                       URL Phishing Model
                              TF-IDF + Logistic                  Random Forest
                              Regression

Detection Flow

User Input
    |
    +--------------------+
    |                    |
   URL                Message
    |                    |
    v                    v
Feature Extraction     TF-IDF
    |                    |
    v                    v
URL ML Model       Message ML Model
    |                    |
    +---------+----------+
              |
              v
      Rule-Based Analysis
              |
              v
          Risk Score
              |
              v
   Final Security Decision
              |
              v
       Save Scan in MongoDB
              |
        +-----+------+
        |            |
        v            v
    Analytics    Threat Reports

Technology Stack

Frontend

React

Vite

JavaScript / JSX

Tailwind CSS

Lucide React

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

Axios

Helmet

CORS

express-rate-limit

PDFKit

Machine Learning

Python

Flask

Flask-CORS

Scikit-learn

Joblib

TF-IDF

Logistic Regression

Random Forest

Machine Learning Models

SMS Spam Detection

Pipeline:

Message
   |
   v
TF-IDF Vectorization
   |
   v
Logistic Regression
   |
   v
Spam / Ham

The trained model and vectorizer are stored as:

spam_model.pkl
tfidf_vectorizer.pkl

Reported held-out model accuracy: 97.40%

URL Phishing Detection

Pipeline:

URL
 |
 v
18 Feature Extraction
 |
 v
Random Forest
 |
 v
Legitimate / Phishing

The trained URL model is stored as:

url_phishing_model.pkl

Reported held-out model accuracy: 99.57%

URL Features

URL Length

Hostname Length

Path Length

Dot Count

Hyphen Count

Slash Count

Question Mark Count

Equal Sign Count

At Symbol Count

Percent Count

HTTPS

HTTP

IP Address

Suspicious Word Count

Subdomain Count

Digit Count

Letter Count

Shortened URL

Project Structure

AI-Powered-Phishing-Scam-Detection-System/
|
+-- frontend/
|   +-- src/
|   |   +-- pages/
|   |   |   +-- Home.jsx
|   |   |   +-- URLScanner.jsx
|   |   |   +-- MessageScanner.jsx
|   |   |   +-- Analytics.jsx
|   |   |   +-- ThreatReports.jsx
|   |   |   +-- Users.jsx
|   |   |   +-- Settings.jsx
|   |   |   +-- Login.jsx
|   |   |   +-- Register.jsx
|   |   +-- api.js
|   |   +-- App.jsx
|   +-- package.json
|   +-- ...
|
+-- backend/
|   +-- config/
|   +-- controllers/
|   +-- middleware/
|   +-- models/
|   +-- routes/
|   +-- services/
|   +-- utils/
|   +-- app.js
|   +-- server.js
|   +-- package.json
|   +-- ...
|
+-- ml-service/
|   +-- app.py
|   +-- url_model.py
|   +-- train_model.py
|   +-- train_url_model.py
|   +-- requirements.txt
|   +-- spam_model.pkl
|   +-- tfidf_vectorizer.pkl
|   +-- url_phishing_model.pkl
|   +-- ...
|
+-- README.md
+-- home_1.png
+-- message.png
+-- url.png

API Endpoints

Authentication

POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/change-password

URL Scanner

POST /api/scan/url

Message Scanner

POST /api/scan/message

Threat Reports

GET /api/reports
GET /api/reports/:scanId/pdf

Analytics

GET /api/analytics

Users

GET /api/users
PUT /api/users/profile

Health Check

GET /api/health

Local Installation

1. Clone the repository

git clone https://github.com/soni-701/AI-Powered-Phishing-Scam-Detection-System.git
cd AI-Powered-Phishing-Scam-Detection-System

2. Install frontend dependencies

cd frontend
npm install

3. Install backend dependencies

cd ../backend
npm install

4. Install ML dependencies

cd ../ml-service
pip install -r requirements.txt

Environment Variables

Backend

Create:

backend/.env

Use:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000

Frontend

Create:

frontend/.env

Use:

VITE_API_URL=http://localhost:5000

Never commit real database credentials, JWT secrets, or other private keys to GitHub.

Run Locally

Run the three services separately.

1. ML Service

cd ml-service
python app.py

Local ML API:

http://localhost:8000

2. Backend

cd backend
npm start

Local backend:

http://localhost:5000

3. Frontend

cd frontend
npm run dev

Open the Vite URL shown in the terminal.

Production Build

cd frontend
npm run build

The production build is generated in:

frontend/dist

Deployment

The production architecture uses:

Frontend    -> Vercel
Backend     -> Render
ML Service  -> Render
Database    -> MongoDB Atlas

Current backend service

https://ai-powered-phishing-scam-detection.onrender.com

Current ML service

https://ai-powered-phishing-scam-detection-system.onrender.com

Screenshots

The screenshots below are stored in the repository root.

Home Dashboard



URL Scanner



Message Scanner



Security

The application implements:

JWT-based authentication

Password hashing

Protected API endpoints

Request rate limiting

CORS restrictions

Helmet security headers

Request body-size limits

Input validation

Centralized error handling

Environment-based secret management

Future Improvements

Admin and Analyst role-based access control

Larger and more diverse training datasets

Improved URL model accuracy

Real-time threat intelligence integration

Email phishing detection

Browser extension

Continuous model retraining

Automated security notifications

Advanced audit logging

Disclaimer

This system is an AI-assisted security tool. Detection results should be treated as an additional security signal and not as a guarantee that a URL or message is completely safe or malicious.

Author

Soni Yadav

GitHub: https://github.com/soni-701

Repository: https://github.com/soni-701/AI-Powered-Phishing-Scam-Detection-System
