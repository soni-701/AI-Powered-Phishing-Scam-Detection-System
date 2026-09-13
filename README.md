this page com

Yes — you are at the final Vercel deployment section.

From your screenshot, I see an extra empty environment-variable row:

Key: Value
Do this first

Delete that empty row using the — button on its right.

You should have only:

VITE_API_URL
https://ai-powered-phishing-scam-detection.onrender.com

Then leave:

Environments: Production and Preview
After that

Click:

Deploy

That will start deploying your React frontend.

Wait for Vercel to show Deployment successful / Ready.

Then send me the deployment result or screenshot.

Today 11:44 PM
for readme md what write for ai powered phishing scam detection

For your AI-Powered-Phishing-Scam-Detection-System, use a professional README that explains what the project does, technology, features, architecture, setup, API, ML models, and deployment.

You can paste this directly into README.md:

# AI-Powered Phishing & Scam Detection System

An AI-powered full-stack security platform that detects phishing URLs and scam/spam messages using machine learning and rule-based analysis.

The system provides real-time risk scoring, threat classification, confidence analysis, scan history, analytics, and downloadable security reports.

---

## 🚀 Features

### 🔗 URL Phishing Detection
- Analyze URLs for phishing and malicious characteristics
- Extract 18 lexical URL features
- Machine learning based URL classification
- Rule-based security checks
- Trusted-domain protection
- Risk score from 0–100
- Final security decision: SAFE, SUSPICIOUS, or HIGH RISK
- ML prediction and confidence display

### 💬 Message Scam Detection
- Analyze SMS/messages for spam and scam indicators
- TF-IDF based text processing
- Logistic Regression classification
- Rule-based detection
- Risk scoring and confidence analysis
- Detection findings and reasons

### 📊 Analytics Dashboard
- Total scans
- Safe, suspicious, and high-risk distributions
- URL and message detection statistics
- Threat categories
- Recent threat activity
- ML prediction distribution
- Model evaluation information

### 📄 Threat Reports
- Complete scan history
- Search and filtering
- Detailed threat investigation
- URL ML feature analysis
- Detection findings
- CSV export
- PDF report generation

### 🔐 Authentication & Security
- User registration and login
- JWT authentication
- Protected API routes
- Password hashing
- Password change functionality
- Rate limiting
- CORS protection
- Helmet security headers
- Request body size limits

### 👤 User Management
- View registered users
- Search users
- Filter users
- View user profiles

### ⚙️ Settings
- Security preferences
- Notification settings
- Password management
- Account information
- Logout functionality

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │     React Frontend   │
                         │       Vite +        │
                         │      Tailwind CSS    │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js Backend   │
                         │   Express + JWT     │
                         └───────┬───────┬─────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    │                                  │
                    ▼                                  ▼
          ┌─────────────────┐                ┌─────────────────┐
          │     MongoDB     │                │  Python ML API  │
          │ Users + Scans   │                │ Flask + ML      │
          └─────────────────┘                └────────┬────────┘
                                                      │
                                      ┌───────────────┴──────────────┐
                                      │                              │
                                      ▼                              ▼
                              SMS Spam Model                 URL Phishing Model
                              TF-IDF + LR                    Random Forest
🧰 Tech Stack
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
Helmet
CORS
express-rate-limit
PDFKit
Axios
Machine Learning
Python
Flask
scikit-learn
pandas
joblib
TF-IDF
Logistic Regression
Random Forest
🤖 Machine Learning
SMS Spam Detection

The message detection model uses:

Text Message
     ↓
TF-IDF Vectorization
     ↓
Logistic Regression
     ↓
Spam / Ham

The model is trained using the SMS Spam Collection dataset.

URL Phishing Detection

The URL detection model uses 18 lexical features:

1. URL Length
2. Hostname Length
3. Path Length
4. Dot Count
5. Hyphen Count
6. Slash Count
7. Question Mark Count
8. Equal Sign Count
9. At Symbol Count
10. Percent Count
11. HTTPS
12. HTTP
13. IP Address
14. Suspicious Word Count
15. Subdomain Count
16. Digit Count
17. Letter Count
18. Shortened URL

Pipeline:

URL
 ↓
Feature Extraction
 ↓
Random Forest Model
 ↓
Legitimate / Phishing
 ↓
Risk Analysis
 ↓
Final Security Decision

The final security decision combines machine learning results with rule-based security checks.

📁 Project Structure
AI-Powered-Phishing-Scam-Detection-System/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── URLScanner.jsx
│   │   │   ├── MessageScanner.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── ThreatReports.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── ml-service/
│   ├── app.py
│   ├── url_model.py
│   ├── train_model.py
│   ├── train_url_model.py
│   ├── spam_model.pkl
│   ├── tfidf_vectorizer.pkl
│   ├── url_phishing_model.pkl
│   ├── requirements.txt
│   └── ...
│
└── README.md
🔌 API Endpoints
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
⚙️ Local Installation
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
🔑 Environment Variables
Backend

Create:

backend/.env

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
Frontend

Create:

frontend/.env

Example:

VITE_API_URL=http://localhost:5000

Do not commit .env files or secrets to GitHub.

▶️ Running the Project

You need to run three services.

1. ML Service
cd ml-service
python app.py

Runs locally on:

http://localhost:8000
2. Backend
cd backend
npm start

Runs locally on:

http://localhost:5000
3. Frontend
cd frontend
npm run dev

The frontend will be available through the Vite development URL shown in the terminal.

🛡️ Security Measures

The backend includes:

JWT authentication
Password hashing with bcrypt
Protected API routes
Request rate limiting
CORS restrictions
Helmet security headers
JSON request size limits
Centralized error handling
Input validation
📈 Detection Flow
User Input
    │
    ├── URL
    │    ↓
    │  Feature Extraction
    │    ↓
    │  ML Prediction
    │    ↓
    │  Rule-Based Analysis
    │    ↓
    │  Risk Score
    │
    └── Message
         ↓
       TF-IDF
         ↓
       ML Prediction
         ↓
       Rule-Based Analysis
         ↓
       Risk Score

              ↓
       Final Security Decision
              ↓
       Save Scan in MongoDB
              ↓
       Reports + Analytics
🌐 Deployment

The project can be deployed using separate services:

Frontend → Vercel
Backend  → Render
ML API   → Render
Database → MongoDB Atlas
Production architecture
Vercel Frontend
      │
      ▼
Render Node/Express API
      │
      ├──────────────► MongoDB Atlas
      │
      └──────────────► Render Flask ML Service
📊 Current ML Models
Detection	Algorithm	Output
SMS Spam	TF-IDF + Logistic Regression	Spam / Ham
URL Phishing	Random Forest	Phishing / Legitimate
🔮 Future Improvements
Role-based access control
Admin and Analyst roles
Larger and more diverse training datasets
Improved URL model accuracy
Real-time threat intelligence integration
Browser extension for URL protection
Email phishing detection
Continuous model retraining
Automated threat notifications
Advanced user activity auditing
⚠️ Disclaimer

This system is an AI-assisted security tool. Detection results should be treated as an additional security signal and not as a guarantee that a URL or message is completely safe or malicious.

👨‍💻 Author

Soni Yadav

GitHub:
https://github.com/soni-701


### One important correction

Since your **Admin/Analyst roles are not actually implemented**, I deliberately put them only under **Future Improvements**, not under the current feature list. That keeps your README truthful.

Also, **do not put your MongoDB URI or JWT secret into README.md**. Use placeholders exactly as shown above.
like all detail mention how i paste all at readme and also add screenshot how is possib;e

Yes. The easiest way is to create a docs/screenshots folder in GitHub and then reference those images from README.md using Markdown.

I prepared the complete README for your project:

Download the complete README.md

How to put it into your GitHub repository

Open your repository:

AI-Powered-Phishing-Scam-Detection-System

Then:

1. Replace your current README.md

Open README.md → Edit → delete the old content → paste everything from the downloaded README → Commit changes.

2. Create the screenshot folder

In your local project, create:

docs/
└── screenshots/

Then put your screenshots there:

docs/screenshots/
├── login.png
├── register.png
├── home.png
├── url-scanner.png
├── message-scanner.png
├── analytics.png
├── threat-reports.png
├── users.png
└── settings.png

3. Upload the screenshots to GitHub

Open your repository → Add file → Upload files.

Select all 9 screenshots and upload them into:

docs/screenshots/

Then commit the changes.

How the screenshots appear in README

The README already contains entries like:

## Screenshots

### Login

![Login](docs/screenshots/login.png)

### Home Dashboard

![Home Dashboard](docs/screenshots/home.png)

GitHub will automatically display the images when those files exist at the specified paths.

Very important

Take the screenshots from your actual finished application, not from development code. Good screenshots to include are:

Login
Register
Home Dashboard
URL Scanner
Message Scanner
Analytics
Threat Reports
Users
Settings

For the scanner screenshots, it is especially useful to show an actual SAFE result and a HIGH RISK/SUSPICIOUS result.

After adding the README and screenshots, run:

git status
git add README.md docs/screenshots
git commit -m "Add project documentation and screenshots"
git push origin main

Then your GitHub repository will have a proper project presentation with documentation and visuals. 

README_AI_Powered_Phishing_Scam_Detection.md
Document

Library
/
README_AI_Powered_Phishing_Scam_Detection.md
AI-Powered Phishing & Scam Detection System

An AI-powered full-stack security platform that analyzes URLs and messages to identify phishing, spam, scam, and suspicious content.

The system combines machine learning with rule-based security analysis and provides risk scoring, confidence analysis, scan history, analytics, and downloadable threat reports.

Project Overview

Phishing and scam attacks commonly use malicious URLs and deceptive messages to trick users into interacting with harmful content.

This project provides a security-focused web application where users can:

Scan URLs for phishing indicators
Scan messages for spam/scam indicators
View risk scores and detection reasons
Review previous scans
Export threat reports as CSV
Download detailed PDF reports
View detection analytics
Manage account and security settings
Main Services
Frontend        -> React + Vite
Backend         -> Node.js + Express
ML Service      -> Python + Flask + Scikit-learn
Database        -> MongoDB Atlas
Features
URL Phishing Detection
HTTP/HTTPS URL validation
Extraction of 18 lexical URL features
Random Forest phishing classification
Rule-based security checks
Trusted-domain protection
Risk score from 0-100
Final decision: SAFE, SUSPICIOUS, or HIGH RISK
ML prediction and confidence
Detailed feature extraction view
Message Scam Detection
Message validation
TF-IDF vectorization
Logistic Regression classification
Rule-based analysis
Risk scoring
ML prediction and confidence
Detection findings and reasons
Analytics Dashboard
Total scans
URL and message statistics
Safe/suspicious/high-risk distribution
Threat categories
Recent threat activity
Daily scan activity
ML prediction distribution
Model evaluation information
Database summary
Threat Reports
Complete scan history
Search
Risk-level filtering
Scan-type filtering
Detailed report view
Detection findings
ML prediction details
URL feature analysis
CSV export
PDF report download
User Management
Registered user list
User search
Status filtering
Role filtering UI
User profile view

The current application uses the User role. Admin and Analyst role-based permissions are planned future improvements.

Settings
Account information
Security preferences
Automatic URL scanning preference
Threat alerts
Security notifications
Email alerts
Change password
Detection engine information
Logout
Authentication & Security
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
                         +------------------------+
                         |     React Frontend     |
                         |   Vite + Tailwind CSS  |
                         +-----------+------------+
                                     |
                                  REST API
                                     |
                                     v
                         +------------------------+
                         |     Node.js Backend     |
                         |      Express + JWT     |
                         +---------+--------+------+
                                   |        |
                          +--------+        +----------------+
                          |                                  |
                          v                                  v
                 +------------------+              +------------------+
                 |   MongoDB Atlas  |              |   Python ML API  |
                 |   Users + Scans  |              | Flask + Models   |
                 +------------------+              +--------+---------+
                                                           |
                                             +-------------+-------------+
                                             |                           |
                                             v                           v
                                      SMS Spam Model              URL Phishing Model
                                      TF-IDF + LR                 Random Forest
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
Machine Learning
SMS Spam Detection
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
   |
   v
Rule-Based Analysis
   |
   v
Final Risk Score

Training artifacts:

spam_model.pkl
tfidf_vectorizer.pkl

The SMS model uses the SMS Spam Collection dataset.

URL Phishing Detection
URL
 |
 v
Feature Extraction
 |
 v
Random Forest
 |
 v
Legitimate / Phishing
 |
 v
Rule-Based Analysis
 |
 v
Risk Score
 |
 v
Final Security Decision
18 URL Features
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

Training artifact:

url_phishing_model.pkl
Detection Flow
                User Input
                    |
             +------+------+
             |             |
            URL          Message
             |             |
             v             v
     Feature Extraction   TF-IDF
             |             |
             v             v
       URL ML Model   Message ML Model
             |             |
             +------+------+
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
              MongoDB Scan
                 /     \
                v       v
           Analytics   Reports
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
|   +-- .env
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
|   +-- .env
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
+-- docs/
|   +-- screenshots/
|       +-- login.png
|       +-- register.png
|       +-- home.png
|       +-- url-scanner.png
|       +-- message-scanner.png
|       +-- analytics.png
|       +-- threat-reports.png
|       +-- users.png
|       +-- settings.png
|
+-- README.md
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
Local Setup
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

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
Frontend

Create:

frontend/.env

Example:

VITE_API_URL=http://localhost:5000

Never commit real credentials or secrets to GitHub.

Running Locally

Run the three services separately.

ML Service
cd ml-service
python app.py

Local ML service:

http://localhost:8000
Backend
cd backend
npm start

Local backend:

http://localhost:5000
Frontend
cd frontend
npm run dev

Open the URL shown by Vite.

Production Build
cd frontend
npm run build

The production files are generated in:

frontend/dist
Deployment

The deployed architecture uses:

Frontend   -> Vercel
Backend    -> Render
ML Service -> Render
Database   -> MongoDB Atlas
Production Flow
Vercel Frontend
       |
       v
Render Node/Express API
       |
       +-------------> MongoDB Atlas
       |
       +-------------> Render Flask ML Service
Security

Security controls implemented include:

JWT-based authentication
Password hashing
Protected endpoints
Rate limiting
CORS restrictions
Helmet security headers
Request size limits
Input validation
Centralized error handling
Environment-based secrets
Screenshots

Create the following folder in your repository:

docs/screenshots/

Place your screenshots inside it using these exact names:

login.png
register.png
home.png
url-scanner.png
message-scanner.png
analytics.png
threat-reports.png
users.png
settings.png

Then use the following Markdown in README.md:

Login




Register




Home Dashboard




URL Scanner




Message Scanner




Analytics




Threat Reports




Users




Settings




Current ML Models
Detection Type	Algorithm	Output
SMS Spam Detection	TF-IDF + Logistic Regression	Spam / Ham
URL Phishing Detection	Random Forest	Phishing / Legitimate
Future Improvements
Role-based access control
Admin and Analyst roles
Larger and more diverse datasets
Improved URL model accuracy
Real-time threat intelligence
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
