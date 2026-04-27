# Visual Project Guide

## Complete Folder Structure

```
ledgercontrol/
│
├── frontend/                                    # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx                 # Left navigation menu
│   │   │   │   ├── Topbar.jsx                  # Top bar with search
│   │   │   │   └── ProtectedRoute.jsx          # Route authorization
│   │   │   ├── ui/
│   │   │   │   ├── Card.jsx                    # Summary card component
│   │   │   │   ├── Button.jsx                  # Reusable button
│   │   │   │   ├── Input.jsx                   # Form input field
│   │   │   │   ├── Loader.jsx                  # Loading state
│   │   │   │   └── Toast.jsx                   # Notifications
│   │   │   ├── charts/
│   │   │   │   └── SalesChart.jsx              # Line chart
│   │   │   ├── forms/                          # (for future form components)
│   │   │   └── lists/                          # (for future list components)
│   │   │
│   │   ├── pages/                              # Page components
│   │   │   ├── Login.jsx                       # 🔐 Admin login
│   │   │   ├── Dashboard.jsx                   # 📊 Overview & metrics
│   │   │   ├── Products.jsx                    # 📦 Product management
│   │   │   ├── Sales.jsx                       # 🛒 Point of Sale
│   │   │   ├── Customers.jsx                   # 👥 Customer list
│   │   │   ├── Credit.jsx                      # 💳 Credit tracking
│   │   │   ├── Reports.jsx                     # 📈 Analytics
│   │   │   └── Settings.jsx                    # ⚙️ App settings
│   │   │
│   │   ├── context/                            # Global state
│   │   │   ├── AuthContext.jsx                 # User authentication
│   │   │   └── AppContext.jsx                  # App data & products
│   │   │
│   │   ├── services/                           # API client layer
│   │   │   ├── api.js                          # Axios instance
│   │   │   ├── authService.js                  # Auth endpoints
│   │   │   ├── productService.js               # Product endpoints
│   │   │   ├── customerService.js              # Customer endpoints
│   │   │   ├── salesService.js                 # Sales endpoints
│   │   │   └── reportService.js                # Report endpoints
│   │   │
│   │   ├── hooks/                              # Custom React hooks
│   │   │   ├── useFetch.js                     # Data loading hook
│   │   │   └── useToast.js                     # Notification hook
│   │   │
│   │   ├── App.jsx                             # Main app component
│   │   ├── main.jsx                            # React entry point
│   │   └── index.css                           # Global styles
│   │
│   ├── index.html                              # HTML template
│   ├── vite.config.js                          # Build configuration
│   ├── tailwind.config.js                      # Tailwind settings
│   ├── postcss.config.js                       # PostCSS setup
│   ├── .env.example                            # Environment template
│   └── package.json                            # Dependencies
│
├── backend/                                     # Express Backend API
│   ├── config/
│   │   └── db.js                               # MongoDB connection
│   │
│   ├── models/                                 # Database schemas
│   │   ├── Admin.js                            # Admin user
│   │   ├── Product.js                          # Product item
│   │   ├── Customer.js                         # Customer info
│   │   ├── Sale.js                             # Transaction
│   │   └── Credit.js                           # Unpaid invoice
│   │
│   ├── controllers/                            # Business logic
│   │   ├── authController.js                   # Login/Register
│   │   ├── productController.js                # Product CRUD
│   │   ├── customerController.js               # Customer CRUD
│   │   ├── salesController.js                  # Sale creation
│   │   ├── creditController.js                 # Credit management
│   │   └── reportController.js                 # Reports generation
│   │
│   ├── routes/                                 # API routes
│   │   ├── authRoutes.js                       # /api/auth
│   │   ├── productRoutes.js                    # /api/products
│   │   ├── customerRoutes.js                   # /api/customers
│   │   ├── salesRoutes.js                      # /api/sales
│   │   ├── creditRoutes.js                     # /api/credits
│   │   └── reportRoutes.js                     # /api/reports
│   │
│   ├── middleware/
│   │   └── auth.js                             # JWT verification
│   │
│   ├── server.js                               # Express app setup
│   ├── .env.example                            # Environment template
│   └── package.json                            # Dependencies
│
├── 📄 README.md                                 # Project overview
├── 📄 GETTING_STARTED.md                        # 5-min setup guide
├── 📄 API.md                                    # API documentation
├── 📄 ENV_SETUP.md                              # Config guide
├── 📄 DEVELOPMENT.md                            # Dev standards
├── 📄 DEPLOYMENT.md                             # Deployment guide
├── 📄 PROJECT_SUMMARY.md                        # What was built
├── 📄 FILES_GENERATED.md                        # File checklist
└── .gitignore                                   # Git ignore rules
```

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────┐
│            USER STARTS HERE                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Login Page         │
        │  (email/password)   │
        └──────────┬──────────┘
                   │ JWT Token Created
                   ▼
    ┌──────────────────────────────────┐
    │      AUTHENTICATED USER            │
    │  Token stored in localStorage     │
    └──────┬───────────────────────────┘
           │
    ┌──────┴──────────────────────────┐
    │                                 │
    ▼                                ▼
┌─────────────────┐      ┌──────────────────────┐
│   Dashboard     │      │    Other Pages       │
│  • Summary      │      │ • Products           │
│  • Charts       │      │ • Sales (POS)        │
│  • Low Stock    │      │ • Customers          │
│    Alerts       │      │ • Credit Tracking    │
└──────┬──────────┘      │ • Reports            │
       │                 │ • Settings           │
       │                 └──────────────────────┘
       │
    All Protected by JWT Middleware
    ↓
All API Calls Include Token
    ↓
Backend Validates Token
    ↓
Process Request or Reject
    ↓
Send Response or Error
    ↓
Frontend Updates UI
    ↓
Toast Notification Shown
```

---

## Data Flow for Key Features

### 1. Product Management Flow
```
Add Product Page
      │
      ▼
User fills form (name, category, price, qty)
      │
      ▼
POST /api/products with data
      │
      ▼
productController.create()
      │
      ▼
Product.create() saves to MongoDB
      │
      ▼
Response sent back to frontend
      │
      ▼
Toast success, refresh product list
      │
      ▼
Display in table
```

### 2. Point of Sale Flow
```
Sales Page (POS)
      │
      ├─ Select Product from dropdown
      │
      ├─ Enter Quantity
      │
      ├─ Choose Payment: Paid or Credit
      │
      ├─ If Credit → Select Customer
      │
      ├─ Click "Add to Cart"
      │
      ├─ Update cart display
      │
      ├─ Click "Checkout"
      │
      ▼
POST /api/sales with items + amount
      │
      ▼
salesController.create()
      │
      ├─ Create Sale record
      │
      ├─ Update Product quantities
      │
      ├─ If Credit:
      │   ├─ Create Credit record
      │   └─ Update Customer.totalDue
      │
      ├─ Save to MongoDB
      │
      ▼
Response sent to frontend
      │
      ▼
Clear cart, show success
```

### 3. Credit Payment Flow
```
Credit Page (List of unpaid invoices)
      │
      ├─ Display all credits as table rows
      │
      ├─ Show: Customer, Amount, Date, Status
      │
      ├─ For unpaid: Red highlight
      │
      ├─ User clicks "Mark as Paid"
      │
      ▼
PUT /api/credits/:id/pay
      │
      ▼
creditController.pay()
      │
      ├─ Load Credit record
      │
      ├─ Set paid = true
      │
      ├─ Get Customer
      │
      ├─ Deduct from Customer.totalDue
      │
      ├─ Save both
      │
      ▼
Response sent to frontend
      │
      ▼
Refresh list, credit disappears
```

---

## Component Hierarchy

```
App (main routing)
│
├─ AuthProvider (authentication context)
│  │
│  └─ AppProvider (global app state)
│     │
│     ├─ Sidebar (navigation)
│     │  ├─ NavLink items
│     │  └─ Icon components
│     │
│     ├─ Topbar (header)
│     │  ├─ Search input
│     │  ├─ Add Product button
│     │  └─ User profile
│     │
│     └─ Pages (main content)
│        │
│        ├─ Dashboard
│        │  ├─ Card (x4)
│        │  ├─ SalesChart
│        │  └─ Low Stock List
│        │
│        ├─ Products
│        │  ├─ Form (add/edit)
│        │  └─ Table (list)
│        │
│        ├─ Sales
│        │  ├─ Product Selector
│        │  ├─ Cart Summary
│        │  └─ Checkout
│        │
│        └─ ... other pages
│
└─ Toast (notifications)
```

---

## API Endpoint Map

```
/api/auth
│
├─ POST /login              → authController.login()
│                              └─ Returns: { user, token }
│
└─ POST /register           → authController.register()
                              └─ Returns: { user, token }

/api/products [Protected]
│
├─ GET /                    → productController.list()
│                              └─ Returns: [Products...]
│
├─ POST /                   → productController.create()
│                              └─ Stores: new Product
│
├─ PUT /:id                 → productController.update()
│                              └─ Updates: existing Product
│
└─ DELETE /:id              → productController.remove()
                              └─ Deletes: Product

/api/customers [Protected]
│
├─ GET /                    → customerController.list()
├─ POST /                   → customerController.create()
├─ PUT /:id                 → customerController.update()
└─ DELETE /:id              → customerController.remove()

/api/sales [Protected]
│
├─ POST /                   → salesController.create()
│                              ├─ Creates: Sale
│                              ├─ Updates: Product stocks
│                              └─ If credit: creates Credit
│
└─ GET /                    → salesController.list()

/api/credits [Protected]
│
├─ GET /                    → creditController.list()
│                              └─ Returns: [Credits...]
│
└─ PUT /:id/pay             → creditController.pay()
                              ├─ Sets paid = true
                              └─ Updates Customer.totalDue

/api/reports [Protected]
│
└─ GET /summary             → reportController.summary()
                              └─ Returns: daily/monthly stats
```

---

## Key Decision Points

### 1. Where is User Data Stored?
- **Backend**: MongoDB (persistent)
- **Frontend**: localStorage (token only)

### 2. How is Authentication Maintained?
- Login → get JWT token
- Token in localStorage
- Token in every API request header
- Backend verifies on each protected route

### 3. How are Product Stocks Updated?
- On sale creation:
  - Decrease product.quantity
  - Save to database
  - Frontend refreshes

### 4. How is Credit Tracked?
- Customer makes credit sale
- Sale record created with paymentType="credit"
- Credit record created with customer reference
- Customer.totalDue incremented
- Mark paid → Credit.paid = true, due amount decremented

### 5. Why No Redux?
- Context API is sufficient for app size
- Simpler setup and learning curve
- Easy to add Redux later if needed

---

## Important Files to Know

### For Adding New Features
1. Create page component in `/pages/`
2. Add route in `App.jsx`
3. Create service in `/services/` if API call needed
4. Create backend controller if new endpoint
5. Create backend route if new endpoint

### For Fixing Bugs
1. Check browser console for errors
2. Check backend server logs
3. Check API response in Network tab
4. Review data in MongoDB Compass
5. Add console.log() to trace issue

### For Customization
1. Tailwind classes in components
2. Colors in `tailwind.config.js`
3. Component props in UI files
4. Text in page components

---

## Quick Command Reference

```bash
# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

# Backend
npm run dev      # Start with auto-reload
npm start        # Start production server

# Both
npm install      # Install dependencies
npm list         # View installed packages
npm outdated     # Check for updates
```

---

This is your complete **Retail Inventory Management System**. Happy building! 🚀
