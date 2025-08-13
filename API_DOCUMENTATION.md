# API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
This API uses session-based authentication. After successful login/registration, the server creates a session that is automatically maintained via HTTP-only cookies.

### Session Configuration
- **Duration**: 24 hours
- **Security**: HTTP-only cookies, secure in production
- **Secret**: Configured via `SESSION_SECRET` environment variable

---

## Authentication Endpoints

### 1. Admin Registration
**POST** `/admin/register`

Register a new admin user.

**Request Body:**
```json
{
  "username": "admin_user",
  "email": "admin@example.com",
  "password": "securepassword123",
  "role": "admin"
}
```

**Response (201):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "admin_user",
  "email": "admin@example.com",
  "role": "admin",
  "message": "Registration successful"
}
```

**Error Responses:**
- `400` - Missing required fields or user already exists
- `500` - Server error

---

### 2. Admin Login
**POST** `/admin/login`

Authenticate an admin user.

**Request Body:**
```json
{
  "username": "admin_user",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "admin_user",
  "email": "admin@example.com",
  "role": "admin",
  "message": "Login successful"
}
```

**Error Responses:**
- `400` - Missing username or password
- `401` - Invalid credentials
- `500` - Server error

---

### 3. Admin Logout
**POST** `/admin/logout`

Logout the current admin user (requires authentication).

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

### 4. Get Admin Profile
**GET** `/admin/profile`

Get the current admin's profile information (requires authentication).

**Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "admin_user",
  "email": "admin@example.com",
  "role": "admin",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Not authenticated
- `404` - Admin not found
- `500` - Server error

---

## Product Endpoints

### 1. Get All Products
**GET** `/products`

Retrieve all products with optional filtering and pagination.

**Query Parameters:**
- `search` (string) - Search in product name, description, and tags
- `category` (string) - Filter by category: `scarf`, `hat`, `sweater`, `accessory`, `other`
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `color` (string) - Filter by color
- `featured` (boolean) - Filter featured products only
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 12)

**Example Request:**
```
GET /api/products?category=hat&minPrice=20&maxPrice=50&page=1&limit=10
```

**Response (200):**
```json
{
  "products": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Warm Winter Hat",
      "price": 25.99,
      "description": "Handmade wool hat for cold weather",
      "images": [
        {
          "url": "/uploads/hat1.jpg",
          "alt": "Warm Winter Hat"
        }
      ],
      "category": "hat",
      "colors": ["red", "blue", "green"],
      "sizes": ["S", "M", "L"],
      "inStock": true,
      "featured": false,
      "tags": ["winter", "warm", "handmade"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

---

### 2. Get Featured Products
**GET** `/products/featured`

Retrieve featured products (limited to 8 items).

**Response (200):**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Featured Scarf",
    "price": 35.99,
    "description": "Beautiful handmade scarf",
    "images": [
      {
        "url": "/uploads/scarf1.jpg",
        "alt": "Featured Scarf"
      }
    ],
    "category": "scarf",
    "featured": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

### 3. Get Single Product
**GET** `/products/:id`

Retrieve a specific product by ID.

**Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Warm Winter Hat",
  "price": 25.99,
  "description": "Handmade wool hat for cold weather",
  "images": [
    {
      "url": "/uploads/hat1.jpg",
      "alt": "Warm Winter Hat"
    }
  ],
  "category": "hat",
  "colors": ["red", "blue", "green"],
  "sizes": ["S", "M", "L"],
  "inStock": true,
  "featured": false,
  "tags": ["winter", "warm", "handmade"],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Product not found
- `500` - Server error

---

### 4. Create Product
**POST** `/products`

Create a new product (requires authentication).

**Request Body (multipart/form-data):**
```
name: "New Product"
price: 29.99
description: "Product description"
category: "hat"
colors: "red,blue,green"
sizes: "S,M,L"
tags: "winter,handmade"
images: [file1, file2, ...] (up to 10 files)
```

**Response (201):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "New Product",
  "price": 29.99,
  "description": "Product description",
  "images": [
    {
      "url": "/uploads/product1.jpg",
      "alt": "New Product"
    }
  ],
  "category": "hat",
  "colors": ["red", "blue", "green"],
  "sizes": ["S", "M", "L"],
  "inStock": true,
  "featured": false,
  "tags": ["winter", "handmade"],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

### 5. Update Product
**PUT** `/products/:id`

Update an existing product (requires authentication).

**Request Body (multipart/form-data):**
```
name: "Updated Product"
price: 39.99
description: "Updated description"
category: "sweater"
colors: "red,blue"
sizes: "M,L,XL"
tags: "summer,lightweight"
featured: true
images: [file1, file2, ...] (optional, up to 10 files)
```

**Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "name": "Updated Product",
  "price": 39.99,
  "description": "Updated description",
  "images": [
    {
      "url": "/uploads/updated1.jpg",
      "alt": "Updated Product"
    }
  ],
  "category": "sweater",
  "colors": ["red", "blue"],
  "sizes": ["M", "L", "XL"],
  "inStock": true,
  "featured": true,
  "tags": ["summer", "lightweight"],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Not authenticated
- `404` - Product not found
- `500` - Server error

---

### 6. Delete Product
**DELETE** `/products/:id`

Delete a product (requires authentication).

**Response (200):**
```json
{
  "message": "Product removed"
}
```

**Error Responses:**
- `401` - Not authenticated
- `404` - Product not found
- `500` - Server error

---

## Chat User Endpoints

### 1. Create Chat User
**POST** `/chat-users`

Create a new chat user (public endpoint).

**Request Body:**
```json
{
  "username": "John Doe",
  "phone": "+1234567890",
  "country": "United States",
  "email": "john@example.com"
}
```

**Response (201):**
```json
{
  "message": "Thank you! We will contact you soon.",
  "user": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "John Doe",
    "phone": "+1234567890",
    "country": "United States",
    "email": "john@example.com",
    "lastContact": "2023-01-01T00:00:00.000Z",
    "status": "active",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `500` - Server error

---

### 2. Get All Chat Users
**GET** `/chat-users`

Retrieve all chat users with pagination (requires authentication).

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 20)
- `status` (string) - Filter by status: `active`, `inactive`, `blocked`

**Response (200):**
```json
{
  "users": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "John Doe",
      "phone": "+1234567890",
      "country": "United States",
      "email": "john@example.com",
      "lastContact": "2023-01-01T00:00:00.000Z",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 50
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

### 3. Update Chat User
**PUT** `/chat-users/:id`

Update chat user status (requires authentication).

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "John Doe",
  "phone": "+1234567890",
  "country": "United States",
  "email": "john@example.com",
  "lastContact": "2023-01-01T00:00:00.000Z",
  "status": "inactive",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `401` - Not authenticated
- `404` - User not found
- `500` - Server error

---

## Admin Dashboard Endpoints

### 1. Get Dashboard Stats
**GET** `/admin-dashboard/stats`

Get comprehensive dashboard statistics (requires authentication).

**Response (200):**
```json
{
  "totalProducts": 150,
  "totalChatUsers": 75,
  "totalValue": 4500.99,
  "recentProducts": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "New Product",
      "price": 29.99,
      "images": [
        {
          "url": "/uploads/product1.jpg",
          "alt": "New Product"
        }
      ],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "topCountries": [
    {
      "country": "United States",
      "count": 25
    },
    {
      "country": "Canada",
      "count": 15
    }
  ],
  "categoryStats": [
    {
      "category": "hat",
      "count": 45
    },
    {
      "category": "scarf",
      "count": 30
    }
  ],
  "monthlyStats": [
    {
      "period": "2023-12",
      "count": 12
    },
    {
      "period": "2023-11",
      "count": 8
    }
  ]
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

### 2. Get Dashboard Overview
**GET** `/admin-dashboard/overview`

Get dashboard overview for specific time periods (requires authentication).

**Query Parameters:**
- `period` (string) - Time period: `24h`, `7d`, `30d`, `90d` (default: `7d`)

**Response (200):**
```json
{
  "period": "7d",
  "newProducts": 5,
  "newChatUsers": 12,
  "dateFilter": {
    "createdAt": {
      "$gte": "2023-12-25T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401` - Not authenticated
- `500` - Server error

---

## Health Check

### Health Check
**GET** `/health`

Check server and database status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "database": "connected"
}
```

---

## Data Models

### Product Model
```javascript
{
  name: String (required, min: 2),
  price: Number (required, min: 0),
  description: String (max: 2000),
  images: [{
    url: String (required),
    alt: String
  }],
  category: String (enum: ['scarf', 'hat', 'sweater', 'accessory', 'other']),
  colors: [String],
  sizes: [String],
  inStock: Boolean (default: true),
  featured: Boolean (default: false),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### ChatUser Model
```javascript
{
  username: String (required, min: 2),
  phone: String (required),
  country: String (required),
  email: String,
  lastContact: Date (default: now),
  status: String (enum: ['active', 'inactive', 'blocked'], default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  username: String (required, unique, min: 3),
  email: String (required, unique),
  password: String (required, min: 6, hashed),
  role: String (enum: ['admin', 'super_admin'], default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "message": "Access denied. Please log in."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## File Upload

### Supported File Types
- Images: JPG, JPEG, PNG, GIF
- Maximum file size: 10MB per file
- Maximum files per request: 10

### File Storage
- Files are stored in the `/uploads` directory
- Accessible via `/uploads/filename.ext`
- Files are served statically by the Express server

---

## Rate Limiting & Security

- CORS is enabled for frontend integration
- File uploads are limited to prevent abuse
- Session-based authentication with secure cookies
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

---

## Environment Variables

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Secret key for session encryption
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (optional)
