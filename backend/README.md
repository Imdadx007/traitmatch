# 🚀 Evolvify Backend - Professional API

A robust, production-ready backend for the **Evolvify** AI-powered career guidance platform. Built with Express.js, MongoDB, and security best practices.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Security](#security)
- [Deployment](#deployment)

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication with access/refresh tokens
- Role-based access control (User, Admin, Moderator)
- Secure password hashing with bcryptjs
- Token refresh mechanism

### 📊 **Personality Assessments**
- Create and manage Big Five personality assessments
- Track assessment progress and completion
- Calculate personality scores
- Store detailed assessment results

### 🎯 **Career Matching Algorithm**
- Intelligent matching using Euclidean distance algorithm
- Matches user traits to career requirements (0-100 score)
- Get career recommendations based on assessment
- Find similar careers by traits

### 💼 **Career Database**
- Comprehensive career information (8 domains)
- Salary ranges, job outlook, skill requirements
- Career paths and progression
- Company and industry information

### ⭐ **Favorites Management**
- Bookmark favorite careers
- Set priority levels and notes
- Track careers under consideration
- View favorite statistics

### 👤 **User Profiles**
- Complete user management
- Profile customization
- Dashboard with stats and recommendations
- Password management and account deletion

### 🔒 **Security Features**
- Helmet.js for secure headers
- Rate limiting (100 requests/15 min)
- Input validation with Joi
- NoSQL injection prevention with mongo-sanitize
- CORS configuration
- Environment-based secrets

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 5.1.0 |
| **Database** | MongoDB | 8.16.1 |
| **Authentication** | JWT | 9.0.2 |
| **Password Hashing** | bcryptjs | 3.0.2 |
| **Validation** | Joi | 17.11.0 |
| **Security** | Helmet | 7.1.0 |
| **Rate Limiting** | express-rate-limit | 7.1.5 |
| **Logging** | Morgan | 1.10.0 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- npm or pnpm

### Installation

1. **Clone and Navigate**
```bash
cd backend
```

2. **Install Dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure Environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
# Important: Change JWT_SECRET in production!
```

4. **Start MongoDB**
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

5. **Seed Sample Data**
```bash
npm run seed
```

6. **Start Development Server**
```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### 🔐 **Authentication** (`/auth`)
```
POST   /auth/register           - Register new user
POST   /auth/login              - Login user
POST   /auth/refresh            - Refresh access token
POST   /auth/logout             - Logout user
GET    /auth/me                 - Get current user (protected)
```

### 📊 **Assessments** (`/assessments`) - Protected
```
POST   /assessments             - Create new assessment
GET    /assessments             - Get user's assessments
GET    /assessments/latest      - Get latest assessment
GET    /assessments/stats       - Get assessment statistics
GET    /assessments/:id         - Get specific assessment
PUT    /assessments/:id         - Update assessment progress
POST   /assessments/:id/submit  - Submit completed assessment
DELETE /assessments/:id         - Delete assessment
```

### 💼 **Careers** (`/careers`)
```
GET    /careers                 - Get all careers (paginated)
GET    /careers/search?q=...    - Search careers
GET    /careers/featured        - Get featured careers
GET    /careers/stats           - Get career statistics
GET    /careers/domain/:domain  - Get careers by domain
GET    /careers/:id             - Get career details
GET    /careers/:id/similar     - Get similar careers

// Protected
GET    /careers/recommendations/for-me  - Get recommendations
GET    /careers/:careerId/match         - Get match score
```

### 👤 **Profile** (`/profile`) - Protected
```
GET    /profile                 - Get user profile
PUT    /profile                 - Update profile
GET    /profile/dashboard       - Get dashboard data
PUT    /profile/preferences     - Update preferences
POST   /profile/change-password - Change password
DELETE /profile/delete-account  - Delete account
```

### ⭐ **Favorites** (`/favorites`) - Protected
```
POST   /favorites/:careerID     - Add to favorites
DELETE /favorites/:careerID     - Remove from favorites
GET    /favorites               - Get user's favorites
GET    /favorites/:careerID     - Get favorite details
GET    /favorites/:careerID/is-favorited - Check if favorited
PUT    /favorites/:careerID     - Update favorite
GET    /favorites/priority/:priority - Get by priority
GET    /favorites/considering/list    - Get careers under consideration
GET    /favorites/stats         - Get favorite statistics
```

---

## 📊 Database Schema

### **User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  bio: String,
  avatar_url: String,
  status: "active" | "inactive" | "suspended",
  role: "user" | "admin" | "moderator",
  preferences: {
    theme: "light" | "dark",
    notifications_enabled: Boolean,
    career_domains: [String]
  },
  last_assessment_date: Date,
  assessment_count: Number,
  is_verified: Boolean,
  last_login: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Assessment Collection**
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  status: "started" | "in_progress" | "completed",
  assessment_type: "big_five" | "quick_assessment" | "premium_assessment",
  scores: {
    openness: Number (0-100),
    conscientiousness: Number (0-100),
    extraversion: Number (0-100),
    agreeableness: Number (0-100),
    neuroticism: Number (0-100)
  },
  answers: Map,
  selected_domains: [String],
  progress: Number (0-100),
  duration_seconds: Number,
  matched_careers: [{
    career_id: ObjectId,
    career_title: String,
    match_score: Number
  }],
  is_saved: Boolean,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Career Collection**
```javascript
{
  _id: ObjectId,
  title: String (unique),
  description: String,
  domain: String,
  trait_requirements: {
    openness: Number (0-100),
    conscientiousness: Number (0-100),
    extraversion: Number (0-100),
    agreeableness: Number (0-100),
    neuroticism: Number (0-100)
  },
  salary: {
    entry_level: Number,
    mid_career: Number,
    experienced: Number
  },
  job_outlook: {
    growth_rate: Number,
    demand_level: String,
    available_jobs: Number
  },
  skills: [{
    name: String,
    importance: "critical" | "important" | "nice_to_have"
  }],
  education: {
    minimum_level: String,
    common_fields: [String],
    certifications: [String]
  },
  work_environment: {...},
  career_path: {...},
  common_industries: [String],
  top_companies: [String],
  pros: [String],
  cons: [String],
  views_count: Number,
  favorites_count: Number,
  rating: Number (0-5),
  is_active: Boolean,
  is_featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Favorite Collection**
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  career_id: ObjectId (ref: Career),
  notes: String,
  priority: "low" | "medium" | "high",
  considering: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication

### JWT Tokens
- **Access Token**: Valid for 7 days
- **Refresh Token**: Valid for 30 days
- **Secret**: Configure in `.env` (must change in production)

### Request with Token
```bash
Authorization: Bearer <your_access_token>
```

### Refresh Token Flow
```bash
POST /api/auth/refresh
{
  "refreshToken": "<your_refresh_token>"
}
```

---

## ⚠️ Error Handling

### Standard Error Response
```javascript
{
  success: false,
  message: "Error description",
  errors: [ // Optional
    {
      field: "email",
      message: "Email is required"
    }
  ]
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔒 Security

### Implemented Security Measures
1. **Helmet.js** - Sets security HTTP headers
2. **Rate Limiting** - 100 requests per 15 minutes
3. **MongoDB Injection Prevention** - mongo-sanitize
4. **Input Validation** - Joi schemas
5. **Password Hashing** - bcryptjs (10 salt rounds)
6. **CORS** - Configured to frontend URL
7. **Environment Secrets** - JWT secrets from .env
8. **Role-based Access** - Route protection middleware

### Production Checklist
- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production domain
- [ ] Configure MongoDB Atlas or production DB
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure email service
- [ ] Set up backups
- [ ] Review and update CORS origins

---

## 🚀 Deployment

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/evolvify
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
FRONTEND_URL=https://evolvify.com
RATE_LIMIT_MAX_REQUESTS=100
```

### Build & Deploy
```bash
# Install production dependencies
npm ci --only=production

# Start server
npm start
```

### Using PM2 for Production
```bash
npm install -g pm2

pm2 start src/index.js --name "evolvify-api"
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📝 Scripts

```bash
# Development
npm run dev          # Start with hot reload

# Production
npm start            # Start server

# Database
npm run seed         # Seed sample careers

# Testing
npm test             # Run tests
```

---

## 📚 API Documentation

For detailed endpoint documentation and examples, visit:
- Local: `http://localhost:5000/api/health`
- API Root: `http://localhost:5000/`

---

## 🤝 Contributing

1. Follow the existing code structure
2. Use consistent naming conventions
3. Add validation schemas for new endpoints
4. Handle errors appropriately
5. Test before submitting

---

## 📄 License

MIT License - See LICENSE file

---

## 🆘 Support & Issues

For issues and questions:
1. Check `.env.example` configuration
2. Verify MongoDB connection
3. Check console logs for detailed errors
4. Review API documentation

---

**Built with ❤️ for Evolvify**
