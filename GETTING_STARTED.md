# Getting Started Guide

## 1. Quick Start

### Clone and Install
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
cp .env.example .env
```

### MongoDB Setup
- **Local Development**: Install MongoDB locally and start the service
- **Cloud**: Create a MongoDB Atlas cluster and update `MONGODB_URI` in `.env`

### Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 2. Initial Admin Setup

First-time setup requires creating an admin account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inventory.com",
    "password": "password123",
    "name": "Admin User"
  }'
```

Or use the frontend and implement a registration page if needed.

Then login with these credentials at `/login`.

## 3. Adding Sample Data

### Using cURL or Postman

**Login first**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inventory.com",
    "password": "password123"
  }'
# Copy the returned token
```

**Add a Product**:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Running Shoes",
    "category": "Footwear",
    "price": 5000,
    "quantity": 50
  }'
```

**Add a Customer**:
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ali Khan",
    "phone": "03001234567",
    "totalDue": 0
  }'
```

## 4. Key Frontend Features

### Dashboard
- View total products, low stock alerts, today's sales, and revenue
- See sales trend chart
- Quick access to all low-stock products

### Products Page
- Add, edit, delete products
- View stock status with visual badges
- Filter low-stock items

### Sales (POS)
- Search products by name
- Add multiple items to cart
- Choose payment type (Paid/Credit)
- Track cart total in real-time
- Auto-decrease stock on checkout

### Customers
- Manage customer database
- Track total due amounts
- Edit/delete customer records

### Credit Management
- View all unpaid invoices
- Mark credits as paid
- Automatic due balance updates

### Reports
- View daily and monthly metrics
- See top-selling products
- Export data as CSV

## 5. Common Tasks

### Resetting the Database
```bash
# In MongoDB shell
use retail-inventory
db.dropDatabase()
```

### Viewing API Requests
Enable browser DevTools Network tab to inspect all API calls made by frontend.

### Checking Server Logs
Terminal showing `npm run dev` displays all server activities and errors.

### Testing Authentication
Logout from the frontend - it should redirect to login page.

## 6. Troubleshooting

**Port Already in Use**
```bash
# Kill process on port 5000 (backend)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Port 5173 (frontend) - Vite will use next available
```

**MongoDB Connection Error**
- Ensure MongoDB is running locally: `mongod`
- Or check MongoDB Atlas URI in `.env`

**CORS Errors**
- Make sure backend is running on correct port
- Check `cors` configuration in `server.js`

**Frontend API Calls Failing**
- Verify backend running: `curl http://localhost:5000/api/health`
- Check token in localStorage in browser DevTools
- Ensure Authorization header is sent correctly

## 7. Building for Production

**Frontend**:
```bash
cd frontend
npm run build
# Outputs optimized files to dist/
```

**Backend**:
- Push to Heroku/AWS/DigitalOcean
- Ensure environment variables set in production

## 8. Next Steps

Once everything is running:
1. Create test products and customers
2. Make some sales and explore the dashboard
3. Test credit transactions
4. Check reports and CSV export
5. Customize styling with Tailwind in `/frontend/src/index.css`
6. Add more features or integrate with external services
