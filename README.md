# Retail Inventory Management System

A modern, responsive inventory and point-of-sale (POS) system built with React.js, Node.js, Express, and MongoDB. Manage products, customers, sales, and credit tracking with an intuitive dashboard and real-time analytics.

## Features

- **Admin Authentication** - JWT-based login system with protected routes
- **Dashboard** - Real-time summary cards, sales charts, and low stock alerts
- **Products Module** - Add, edit, delete products with stock tracking
- **Point of Sale** - Search and sell products with automatic stock updates
- **Customers** - Manage customer details and track outstanding balances
- **Credit Management** - Udhaar system to track unpaid invoices and mark payments
- **Reports** - Daily, weekly, and monthly analytics with CSV export
- **Responsive Design** - Mobile and desktop optimized interface
- **Toast Notifications** - User feedback for all actions
- **Real-time Updates** - Live data synchronization across components

## Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router v6** for client-side routing
- **Tailwind CSS** for modern UI styling
- **Chart.js & React-ChartJS2** for data visualization
- **React Icons** for UI elements
- **Axios** for API communication
- **Vite** as build tool

### Backend
- **Node.js & Express** for REST API
- **MongoDB** for data persistence
- **Mongoose** for ODM (Object Document Mapper)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Project Structure

```
ledgercontrol/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Sidebar, Topbar, ProtectedRoute
│   │   │   ├── ui/            # Card, Button, Input, Loader, Toast
│   │   │   ├── charts/        # SalesChart
│   │   │   ├── forms/         # Reusable form components
│   │   │   └── lists/         # List components
│   │   ├── pages/             # Dashboard, Products, Sales, Customers, Credit, Reports, Settings, Login
│   │   ├── context/           # AuthContext, AppContext for state management
│   │   ├── services/          # API service layer (authService, productService, etc.)
│   │   ├── hooks/             # Custom hooks (useFetch, useToast)
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── backend/
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── models/
    │   ├── Admin.js
    │   ├── Product.js
    │   ├── Customer.js
    │   ├── Sale.js
    │   └── Credit.js
    ├── controllers/
    │   ├── authController.js   # Login/Register
    │   ├── productController.js
    │   ├── customerController.js
    │   ├── salesController.js
    │   ├── creditController.js
    │   └── reportController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── customerRoutes.js
    │   ├── salesRoutes.js
    │   ├── creditRoutes.js
    │   └── reportRoutes.js
    ├── middleware/
    │   └── auth.js            # JWT verification
    ├── server.js
    ├── .env.example
    └── package.json
```

## Installation

### Prerequisites
- Node.js v16+ and npm/yarn
- MongoDB 5.0+
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/retail-inventory
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
```

Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin account

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Sales
- `POST /api/sales` - Create sale (paid or credit)
- `GET /api/sales` - Get sales history

### Credits
- `GET /api/credits` - List unpaid credits
- `PUT /api/credits/:id/pay` - Mark credit as paid

### Reports
- `GET /api/reports/summary` - Get daily/monthly summary and recent sales

## Authentication Flow

1. Admin logs in with email/password at `/login`
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage on successful login
4. Token sent in Authorization header for protected routes
5. Middleware validates token before processing requests
6. Logout clears stored token

## Usage Guide

### Adding a Product
1. Navigate to **Products**
2. Fill in name, category, price, and quantity
3. Click **Add Product**
4. Product appears in the table with status badges

### Making a Sale
1. Go to **Sales** (POS System)
2. Select a product from dropdown
3. Enter quantity
4. Choose payment type (Paid/Credit)
5. If Credit, select customer
6. Click **Add to Cart** to add more items
7. View cart summary on the right
8. Click **Checkout** to complete

### Tracking Credit
1. Navigate to **Credit** section
2. View all unpaid invoices with customer details
3. Once payment received, click **Mark as Paid**
4. Customer's due balance updates automatically

### Viewing Reports
1. Go to **Reports**
2. View daily sales, monthly revenue, and top products
3. Click **Export CSV** to download report

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/AWS/DigitalOcean)
```bash
# Update .env with production MongoDB Atlas URI
git push heroku main
```

## Environment Variables

**Frontend** - Create `.env` in frontend root:
```
VITE_API_URL=http://localhost:5000
```

**Backend** - Create `.env` in backend root:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/retail-inventory
JWT_SECRET=prod_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

## Development Notes

- API proxy configured in `vite.config.js` for frontend dev server
- All API responses follow standard JSON format
- Error responses include descriptive messages
- Passwords hashed with bcryptjs before storage
- JWT tokens expire after 7 days by default

## Future Enhancements

- Barcode scanner integration
- Advanced inventory analytics
- Multi-user role management
- Email invoice delivery
- SMS notifications
- Payment gateway integration
- Stock expiry tracking
- Supplier management

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
