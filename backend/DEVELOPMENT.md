# 🏗️ Backend Architecture & Development Guide

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Main server entry point
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js         # App constants
│   ├── controllers/             # Business logic
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   ├── careerController.js
│   │   ├── profileController.js
│   │   └── favoriteController.js
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   ├── Career.js
│   │   └── Favorite.js
│   ├── routes/                  # API route definitions
│   │   ├── authRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── careerRoutes.js
│   │   ├── profileRoutes.js
│   │   └── favoriteRoutes.js
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # Authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── validation.js        # Input validation
│   ├── services/                # Business logic utilities
│   │   └── careerMatching.js    # Matching algorithm
│   ├── utils/                   # Helper functions
│   │   ├── jwt.js               # JWT utilities
│   │   └── response.js          # Response formatting
│   └── scripts/                 # Utility scripts
│       └── seed.js              # Database seeding
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies
├── README.md                    # API documentation
├── INTEGRATION.md               # Frontend integration guide
└── DEVELOPMENT.md               # This file
```

---

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- **Controllers**: Handle HTTP request/response
- **Services**: Business logic and calculations
- **Models**: Data structure and validation
- **Middleware**: Cross-cutting concerns

### 2. **Layered Architecture**
```
Request → Routes → Middleware → Controllers → Services → Models → Database
         ↓        (validation)        ↓              ↓
       Response ← Error Handler ←────────────────────
```

### 3. **Security First**
- All inputs validated
- All responses sanitized
- All routes authenticated
- Rate limiting on all endpoints

### 4. **Error Handling**
- Centralized error handler middleware
- Consistent error response format
- Detailed logging in development

---

## 🔄 Data Flow Examples

### Authentication Flow
```
1. POST /api/auth/register
2. Validate input (Joi schema)
3. Check if email exists
4. Hash password with bcryptjs
5. Create user in MongoDB
6. Generate JWT tokens
7. Return tokens and user data
```

### Assessment Flow
```
1. POST /api/assessments (create)
2. Store initial assessment
3. PUT /api/assessments/:id (update progress)
4. POST /api/assessments/:id/submit (finalize)
5. Calculate personality scores
6. Query careers matching user traits
7. Calculate match scores for each career
8. Return top 10 recommendations
```

### Career Recommendation Flow
```
1. Get user's latest assessment
2. Extract user's personality scores
3. Get all active careers from DB
4. For each career:
   - Get career's ideal trait requirements
   - Calculate Euclidean distance between user & career traits
   - Convert distance to match score (0-100)
5. Sort by match score
6. Return top N recommendations
```

---

## 🔐 Security Implementation

### Password Security
```javascript
// Hashing (in User model pre-save)
const salt = await bcryptjs.genSalt(10);
this.password = await bcryptjs.hash(this.password, salt);

// Verification
const isValid = await bcryptjs.compare(enteredPassword, storedHash);
```

### JWT Security
```javascript
// Token generation
const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Middleware Chain
```
1. Helmet - Secure headers
2. mongoSanitize - NoSQL injection prevention
3. CORS - Cross-origin control
4. Rate Limiter - DDoS protection
5. Body Parser - Request parsing
6. Route Handler
7. Auth Middleware - JWT verification
8. Validation - Input validation
9. Controller
10. Error Handler - Centralized errors
```

---

## 🧮 Career Matching Algorithm

### Mathematical Approach
Using Euclidean distance to find similarity between vectors:

```
distance = √[(u₁-c₁)² + (u₂-c₂)² + ... + (uₙ-cₙ)²] / n

where:
  u = user's trait score (0-100)
  c = career's required trait score (0-100)
  n = number of traits (5)

matchScore = 100 - (distance / 100 * 100)
```

### Example
```
User: {openness: 85, conscientiousness: 80, extraversion: 60, ...}
Career: {openness: 80, conscientiousness: 85, extraversion: 50, ...}

Distance calculation:
  √[(85-80)² + (80-85)² + (60-50)²] / 5
  = √[25 + 25 + 100] / 5
  = √30
  ≈ 5.48

Match Score = 100 - (5.48 / 100 * 100) = 94.52
```

### Advantages
- Fair scoring system
- Considers all traits equally
- Normalized 0-100 scale
- Efficient computation O(n)

---

## 📊 Database Indexing

### Indexes for Performance
```javascript
// User indexes
{email: 1}  // For login queries

// Assessment indexes
{user_id: 1, status: 1}  // For user assessments
{created_at: -1}  // For sorting

// Career indexes
{title: 'text', description: 'text', domain: 1}  // For search

// Favorite indexes
{user_id: 1, career_id: 1}  // Unique constraint
{user_id: 1}  // For listing user's favorites
```

---

## 🔄 API Versioning Strategy

Current: V1 (endpoints at `/api/`)

For future versions:
```
/api/v1/assessments      (current)
/api/v2/assessments      (new features)
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Test career matching algorithm
describe('calculateCareerMatch', () => {
  it('should return score between 0-100', () => {
    const score = calculateCareerMatch(userTraits, careerTraits);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});
```

### Integration Tests
```javascript
// Test full assessment flow
describe('Assessment Flow', () => {
  it('should create, update, and submit assessment', async () => {
    // Create
    // Update
    // Submit
    // Verify recommendations
  });
});
```

### API Tests
```bash
# Manual testing with curl
curl -X GET http://localhost:5000/api/careers \
  -H "Authorization: Bearer <token>"
```

---

## 📈 Performance Optimization

### Implemented
1. **Database Indexing** - Fast queries
2. **Pagination** - Limit result sets
3. **Lean Queries** - Return only needed fields
4. **Population Limits** - Don't load unnecessary relations
5. **Caching Ready** - Can add Redis

### Future Improvements
1. **Redis Caching** - Cache frequently accessed careers
2. **Database Connection Pool** - Optimize connections
3. **Query Optimization** - Aggregate pipelines
4. **Compression** - gzip responses
5. **CDN** - Serve static assets

---

## 🚨 Error Codes

| Code | Meaning | Resolution |
|------|---------|-----------|
| 400 | Bad Request | Check input validation |
| 401 | Unauthorized | Verify token is valid |
| 403 | Forbidden | Check user permissions |
| 404 | Not Found | Verify resource ID |
| 500 | Server Error | Check logs |

---

## 🔄 Common Patterns

### Protected Route Pattern
```javascript
router.get('/path', authenticate, authorize('admin'), controller);
```

### Validation Pattern
```javascript
router.post('/path', validate(schemas.createCareer), controller);
```

### Error Handling Pattern
```javascript
try {
  const result = await Model.findById(id);
  if (!result) return sendError(res, 'Not found', null, 404);
  sendSuccess(res, 'Success', result);
} catch (error) {
  console.error('Error:', error);
  sendError(res, 'Server error', null, 500);
}
```

### Pagination Pattern
```javascript
const { page, limit, skip } = getPaginationParams(req);
const data = await Model.find().skip(skip).limit(limit);
const response = buildPaginationResponse(data, total, page, limit);
sendSuccess(res, 'Success', response);
```

---

## 🚀 Scaling Considerations

### Horizontal Scaling
1. Use load balancer
2. Multiple Node instances
3. Shared MongoDB cluster
4. Session storage (Redis)

### Vertical Scaling
1. Increase server resources
2. Optimize queries
3. Implement caching
4. Use CDN

### Database Scaling
1. Sharding by user_id
2. Read replicas
3. Query optimization
4. Archive old assessments

---

## 📝 Adding New Features

### 1. Create Model
```javascript
// models/NewFeature.js
const schema = new mongoose.Schema({...});
export default mongoose.model('NewFeature', schema);
```

### 2. Create Validation Schema
```javascript
// middleware/validation.js
export const schemas = {
  createNewFeature: Joi.object({...})
};
```

### 3. Create Controller
```javascript
// controllers/newFeatureController.js
export const createNewFeature = async (req, res) => {...};
```

### 4. Create Routes
```javascript
// routes/newFeatureRoutes.js
router.post('/', validate(schemas.createNewFeature), createNewFeature);
```

### 5. Register Routes
```javascript
// src/index.js
app.use('/api/new-features', newFeatureRoutes);
```

---

## 🔍 Debugging Tips

### Enable Debug Logging
```bash
DEBUG=* npm run dev
```

### MongoDB Query Logging
```javascript
mongoose.set('debug', true);
```

### Check Environment Variables
```javascript
console.log(process.env.MONGODB_URI);
```

### Verify Token
```bash
# Decode JWT
node -e "console.log(require('jsonwebtoken').decode('<token>'))"
```

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT Guide](https://jwt.io)
- [Mongoose Docs](https://mongoosejs.com)
- [Security Best Practices](https://owasp.org)

---

## 🤝 Contributing Guidelines

1. Follow the existing code structure
2. Use consistent naming (camelCase for functions, PascalCase for classes)
3. Add validation schemas for new endpoints
4. Handle errors appropriately
5. Test endpoints before submitting
6. Add comments for complex logic
7. Update documentation

---

**Happy coding! 🎉**
