# 🎯 Backend Integration Guide

This guide shows how to integrate the professional backend with your Next.js frontend.

## 📦 Setup

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

Server will run on: `http://localhost:5000`

### 2. Environment Variables

Create `.env.local` in your frontend root (`app/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Or in root `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔌 API Integration Examples

### Authentication

**Register User**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  })
});

const data = await response.json();
// data.data.accessToken, data.data.refreshToken
```

**Login User**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.data.accessToken);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

### Protected Requests

```typescript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Assessment API

**Create Assessment**
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assessments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    assessment_type: 'big_five',
    selected_domains: ['Technology', 'Healthcare']
  })
});

const data = await response.json();
sessionStorage.setItem('assessmentId', data.data._id);
```

**Submit Assessment with Scores**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/assessments/${assessmentId}/submit`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      scores: {
        openness: 78,
        conscientiousness: 85,
        extraversion: 62,
        agreeableness: 70,
        neuroticism: 40
      },
      answers: {
        // Map of question ID to answer
      },
      duration_seconds: 1200
    })
  }
);

const data = await response.json();
// data.data.matched_careers contains recommendations
```

### Careers API

**Get All Careers**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/careers?page=1&limit=10&domain=Technology`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);

const data = await response.json();
// data.data.data contains careers array
// data.data.pagination contains pagination info
```

**Get Recommended Careers**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/careers/recommendations/for-me?limit=10`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);

const data = await response.json();
// data.data is array of recommended careers with match_score
```

**Search Careers**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/careers/search?q=software&limit=20`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);

const data = await response.json();
```

### Favorites API

**Add to Favorites**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/favorites/${careerId}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      notes: 'Interested in this career',
      priority: 'high',
      considering: true
    })
  }
);
```

**Get Favorites**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);

const data = await response.json();
// data.data.data is array of favorite careers
```

### User Profile

**Get Dashboard Data**
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/profile/dashboard`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);

const data = await response.json();
// Contains user info, stats, latest assessment, favorites, recommendations
```

---

## 🔄 Frontend Changes Required

### 1. Remove Mock Data

Replace mock career data in your pages with API calls.

**Before:**
```typescript
// components/career-card.tsx
const MOCK_CAREERS = [
  { id: 1, title: 'Software Engineer', ... },
  // ...
];
```

**After:**
```typescript
'use client';
import { useEffect, useState } from 'react';

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  
  useEffect(() => {
    const fetchCareers = async () => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/careers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCareers(data.data.data);
    };
    
    fetchCareers();
  }, []);
  
  return (
    // Use careers state
  );
}
```

### 2. Update Assessment Flow

**Current Flow:**
- Store answers in sessionStorage
- Display hardcoded results

**New Flow:**
- Create assessment via API
- Submit answers to `/assessments/:id/submit`
- Get recommendations from API response
- Display returned matched_careers

### 3. Update Authentication

**Current:**
- Store credentials in localStorage
- No token refresh

**New:**
- Store accessToken and refreshToken
- Use middleware to refresh token when expired
- Include token in all protected requests

### 4. Create API Utility

```typescript
// lib/api.ts
export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  let token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  let response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    { ...options, headers }
  );
  
  // Refresh token if expired
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      }
    );
    
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      localStorage.setItem('accessToken', refreshData.data.accessToken);
      localStorage.setItem('refreshToken', refreshData.data.refreshToken);
      
      // Retry request
      token = refreshData.data.accessToken;
      headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        { ...options, headers }
      );
    }
  }
  
  return response.json();
};
```

---

## 🧪 Testing

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/profile \
  -H "Authorization: Bearer <your_token>"
```

### Test Seed Data
```bash
npm run seed
```

Then access: `http://localhost:5000/api/careers`

---

## 🐛 Troubleshooting

### CORS Error
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- For development: `http://localhost:3000`

### Token Expired
- Implement refresh token flow
- Store both accessToken and refreshToken

### No Data from API
- Check MongoDB is running
- Run `npm run seed` to populate careers
- Check network tab in browser DevTools

### 404 on Assessment Submit
- Ensure assessment exists (created first)
- Use correct assessment ID
- Check user ownership

---

## 📚 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 🚀 Ready to Deploy?

1. Update production `.env` with real MongoDB URI
2. Change JWT secrets
3. Update FRONTEND_URL to production domain
4. Deploy backend (Heroku, Render, etc.)
5. Update frontend NEXT_PUBLIC_API_URL
6. Deploy frontend

---

**Need Help?** Check the backend README.md for detailed API documentation.
