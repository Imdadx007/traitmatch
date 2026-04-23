# ⚡ Quick Start - Evolvify Backend

## 🚀 Get Running in 3 Minutes

### Step 1: Install & Setup (1 min)
```bash
cd backend
npm install
```

### Step 2: Start Database
```bash
# Make sure MongoDB is running
mongod
```

### Step 3: Seed Sample Data (30 sec)
```bash
npm run seed
```

### Step 4: Start Server (30 sec)
```bash
npm run dev
```

✅ **Server is now running on http://localhost:5000**

---

## 🧪 Test It Out (1 min)

### 1. Check Health
```bash
curl http://localhost:5000/api/health
```

### 2. View Sample Careers
```bash
curl http://localhost:5000/api/careers
```

### 3. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Copy the `accessToken` from response. Use it in next requests:

### 5. Create Assessment
```bash
curl -X POST http://localhost:5000/api/assessments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "assessment_type": "big_five",
    "selected_domains": ["Technology", "Healthcare"]
  }'
```

### 6. Submit Assessment & Get Recommendations
```bash
curl -X POST http://localhost:5000/api/assessments/<assessment_id>/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "scores": {
      "openness": 85,
      "conscientiousness": 90,
      "extraversion": 70,
      "agreeableness": 75,
      "neuroticism": 30
    },
    "duration_seconds": 1200
  }'
```

---

## 📁 Project Structure Overview

```
backend/
├── src/
│   ├── index.js                 ← Server entry point
│   ├── models/                  ← Database schemas (User, Assessment, Career, Favorite)
│   ├── controllers/             ← Business logic (5 controllers)
│   ├── routes/                  ← API routes (5 route files)
│   ├── middleware/              ← Auth, validation, error handling
│   ├── services/                ← Career matching algorithm
│   └── utils/                   ← Helper functions
├── .env                         ← Your configuration
├── package.json                 ← Dependencies
└── README.md                    ← Full API documentation
```

---

## 📝 What's Included

✅ **40+ API Endpoints**
- Authentication (register, login, refresh)
- Personality assessments (create, update, submit)
- Career search & recommendations
- User profiles & preferences
- Favorites management

✅ **4 Database Models**
- User (complete profile)
- Assessment (Big Five personality test)
- Career (8 domains, 100+ fields)
- Favorite (bookmarks)

✅ **Security Features**
- JWT authentication
- Role-based access control
- Input validation
- Rate limiting
- Password hashing
- NoSQL injection prevention

✅ **Documentation**
- README.md (API reference)
- INTEGRATION.md (frontend guide)
- DEVELOPMENT.md (architecture)
- This file!

---

## 🔗 Frontend Integration

### Update Frontend .env
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Example API Call
```typescript
const token = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:5000/api/careers', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await response.json();
console.log(data.data); // Array of careers
```

See **INTEGRATION.md** for detailed examples.

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| README.md | Complete API reference with all endpoints |
| INTEGRATION.md | How to connect frontend to backend |
| DEVELOPMENT.md | Architecture, patterns, and best practices |
| .env.example | Configuration template |

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# On Mac
brew services start mongodb-community
```

### Seed Failed
```bash
# Delete old data and re-seed
npm run seed
```

### Token Expired
The backend returns 401. Refresh the token using `/api/auth/refresh`.

---

## ⚙️ Environment Variables

Key variables in `.env`:

```
PORT=5000                          # Server port
NODE_ENV=development               # Environment
MONGODB_URI=mongodb://127.0.0.1:27017/evolvify  # DB connection
JWT_SECRET=your_secret_key         # ⚠️ Change in production
FRONTEND_URL=http://localhost:3000 # CORS origin
```

---

## 🚀 Production Deployment

### Before Deploying
1. ✅ Change JWT_SECRET
2. ✅ Set NODE_ENV=production
3. ✅ Use MongoDB Atlas for database
4. ✅ Update FRONTEND_URL to your domain
5. ✅ Enable HTTPS

### Deploy to Heroku/Render
```bash
# Create .env with production values
# Push to git
git push heroku main
```

---

## 📊 API Response Example

### Success Response
```json
{
  "success": true,
  "message": "Careers retrieved",
  "data": {
    "data": [
      {
        "_id": "66abc123...",
        "title": "Software Engineer",
        "domain": "Technology",
        "salary": {
          "entry_level": 70000,
          "mid_career": 110000
        },
        "match_score": 92
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10,
      "hasNextPage": true
    }
  }
}
```

---

## 🎓 Key Endpoints Cheat Sheet

```bash
# Auth
POST   /auth/register       # Create account
POST   /auth/login          # Login
POST   /auth/refresh        # Refresh token
GET    /auth/me             # Get current user

# Assessments
POST   /assessments          # Start assessment
POST   /assessments/:id/submit  # Submit & get recommendations
GET    /assessments          # Get my assessments

# Careers
GET    /careers              # All careers (paginated)
GET    /careers/search?q=... # Search careers
GET    /careers/recommendations/for-me  # Get recommendations

# Profile
GET    /profile              # Get my profile
PUT    /profile              # Update profile
GET    /profile/dashboard    # Dashboard data

# Favorites
POST   /favorites/:careerID  # Add to favorites
GET    /favorites            # Get my favorites
DELETE /favorites/:careerID  # Remove from favorites
```

---

## 🎯 Next Steps

1. **Frontend Setup**: Update `.env` to point to backend
2. **API Integration**: Replace mock data with API calls
3. **Token Management**: Implement token storage and refresh
4. **Testing**: Test all user flows
5. **Deployment**: Deploy both backend and frontend

---

## 💡 Pro Tips

- Use **Postman** or **Insomnia** for API testing
- Enable **MongoDB Compass** to view database
- Check **network tab** in DevTools for API debugging
- Use **console logs** to debug issues
- Read full docs in **README.md** for details

---

## 🆘 Need Help?

1. Check **README.md** for full API documentation
2. Review **INTEGRATION.md** for frontend examples
3. Read **DEVELOPMENT.md** for architecture details
4. Check **browser console** for errors
5. Check **server console** for logs

---

**You're all set! Happy coding! 🎉**

```
Start command:    npm run dev
API Base URL:     http://localhost:5000/api
Health Check:     http://localhost:5000/api/health
```
