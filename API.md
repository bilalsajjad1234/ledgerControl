# API Documentation

## Base URL
```
http://localhost:5000/api
```

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Authentication Endpoints

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "admin@inventory.com",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@inventory.com",
    "name": "Admin User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Register
**POST** `/auth/register`

Request:
```json
{
  "email": "newadmin@inventory.com",
  "password": "securepassword",
  "name": "New Admin"
}
```

Response (201 Created):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "email": "newadmin@inventory.com",
    "name": "New Admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Product Endpoints

### List Products
**GET** `/products` *[Protected]*

Response (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Running Shoes",
    "category": "Footwear",
    "price": 5000,
    "quantity": 50,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Create Product
**POST** `/products` *[Protected]*

Request:
```json
{
  "name": "Wireless Earbuds",
  "category": "Electronics",
  "price": 8000,
  "quantity": 25
}
```

Response (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Wireless Earbuds",
  "category": "Electronics",
  "price": 8000,
  "quantity": 25,
  "createdAt": "2024-01-15T10:35:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

### Update Product
**PUT** `/products/:id` *[Protected]*

Request:
```json
{
  "price": 7500,
  "quantity": 30
}
```

Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Wireless Earbuds",
  "price": 7500,
  "quantity": 30
}
```

### Delete Product
**DELETE** `/products/:id` *[Protected]*

Response (200 OK):
```json
{
  "message": "Product deleted",
  "product": { "name": "Wireless Earbuds" }
}
```

---

## Customer Endpoints

### List Customers
**GET** `/customers` *[Protected]*

Response (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Ali Khan",
    "phone": "03001234567",
    "totalDue": 15000,
    "createdAt": "2024-01-15T10:40:00Z",
    "updatedAt": "2024-01-15T10:40:00Z"
  }
]
```

### Create Customer
**POST** `/customers` *[Protected]*

Request:
```json
{
  "name": "Sara Ahmed",
  "phone": "03009876543",
  "totalDue": 0
}
```

Response (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "name": "Sara Ahmed",
  "phone": "03009876543",
  "totalDue": 0
}
```

### Update Customer
**PUT** `/customers/:id` *[Protected]*

Request:
```json
{
  "totalDue": 5000
}
```

Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "name": "Sara Ahmed",
  "totalDue": 5000
}
```

### Delete Customer
**DELETE** `/customers/:id` *[Protected]*

Response (200 OK):
```json
{
  "message": "Customer deleted"
}
```

---

## Sales Endpoints

### Create Sale
**POST** `/sales` *[Protected]*

Request (Paid):
```json
{
  "items": [
    { "productId": "507f1f77bcf86cd799439011", "quantity": 2 },
    { "productId": "507f1f77bcf86cd799439013", "quantity": 1 }
  ],
  "amount": 18000,
  "paymentType": "paid"
}
```

Request (Credit):
```json
{
  "items": [
    { "productId": "507f1f77bcf86cd799439011", "quantity": 3 }
  ],
  "amount": 15000,
  "paymentType": "credit",
  "customerId": "507f1f77bcf86cd799439021"
}
```

Response (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 5000
    }
  ],
  "amount": 10000,
  "paymentType": "paid",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

### List Sales
**GET** `/sales` *[Protected]*

Response (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "items": [...],
    "amount": 10000,
    "paymentType": "paid",
    "createdAt": "2024-01-15T11:00:00Z"
  }
]
```

---

## Credit Endpoints

### List Credits
**GET** `/credits` *[Protected]*

Response (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439040",
    "customerId": "507f1f77bcf86cd799439021",
    "customerName": "Sara Ahmed",
    "amount": 15000,
    "paid": false,
    "saleId": "507f1f77bcf86cd799439030",
    "createdAt": "2024-01-15T11:00:00Z"
  }
]
```

### Mark Credit as Paid
**PUT** `/credits/:id/pay` *[Protected]*

Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439040",
  "customerName": "Sara Ahmed",
  "amount": 15000,
  "paid": true
}
```

---

## Report Endpoints

### Get Summary
**GET** `/reports/summary` *[Protected]*

Response (200 OK):
```json
{
  "dailySales": 45000,
  "monthlyRevenue": 850000,
  "topProduct": "Running Shoes",
  "recentSales": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "amount": 10000,
      "paymentType": "paid"
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Token is not valid"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 400 Bad Request
```json
{
  "message": "Email and password are required"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Headers

All requests should include:
```
Content-Type: application/json
Authorization: Bearer <token>  // For protected routes
```

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- 100 requests per 15 minutes per IP
- Throttle login attempts to 5 per minute
