# User Profile APIs

This document describes the new APIs for managing user profile information.

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get User Profile

**GET** `/users/profile`

Returns the current user's profile information.

**Response:**
```json
{
  "_id": "user_id",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "user",
  "favorites": []
}
```

### 2. Update User Profile

**PUT** `/users/profile`

Updates the current user's profile information. All fields are optional.

**Request Body:**
```json
{
  "email": "newemail@example.com",     // optional
  "fullName": "New Full Name",         // optional
  "password": "newStrongPassword123"   // optional
}
```

**Validation Rules:**
- Email must be a valid email format
- Password must meet strong password requirements (minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character)
- Email must be unique (if changing email)

**Response:**
```json
{
  "_id": "user_id",
  "email": "newemail@example.com",
  "fullName": "New Full Name",
  "role": "user",
  "favorites": []
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - User not found
- `409 Conflict` - Email already exists (when updating email)

## Example Usage

### Update full name only:
```bash
curl -X PUT http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Jane Smith"}'
```

### Update email only:
```bash
curl -X PUT http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane.smith@example.com"}'
```

### Update password only:
```bash
curl -X PUT http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"password": "NewStrongPassword123!"}'
```

### Update multiple fields:
```bash
curl -X PUT http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "NewStrongPassword123!"
  }'
``` 