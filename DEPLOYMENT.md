# Architecture & Deployment Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│                          React SPA                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React Components & Pages                        │  │
│  │  - Dashboard, Products, Sales, Customers, Credit, Reports│  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           State Management (Context API)                 │  │
│  │  - AuthContext, AppContext                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Services Layer                          │  │
│  │  - authService, productService, salesService, etc.      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            HTTP/REST
                        (Axios + JWT)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Server                          │
│                      Node.js + Express                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Routes Layer                         │  │
│  │  /api/auth, /api/products, /api/sales, /api/credits   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Middleware Layer                         │  │
│  │  - JWT Authentication, Error Handling, CORS            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Controllers Layer                          │  │
│  │  Business Logic for each Resource                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Models Layer                           │  │
│  │  Mongoose Schemas (Admin, Product, Sale, Credit, etc.) │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         MongoDB Driver
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     MongoDB Database                             │
│  Collections: admins, products, customers, sales, credits      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Products | Customers | Sales | Credits | Admins       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Login Flow
```
1. User enters email/password → Frontend
2. Frontend calls POST /api/auth/login
3. Backend validates credentials with bcryptjs
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Token added to all future requests
7. Middleware verifies JWT on protected routes
8. User redirected to Dashboard
```

### Sale Creation Flow
```
1. User selects products and adds to cart
2. User clicks Checkout
3. Frontend calls POST /api/sales
4. Backend creates Sale record
5. Backend updates Product quantities
6. If Credit sale:
   - Backend creates Credit record
   - Backend updates Customer.totalDue
7. Frontend shows success toast
8. Cart cleared
```

### Credit Payment Flow
```
1. User views Credit page
2. Table shows all unpaid credits
3. User clicks "Mark as Paid"
4. Frontend calls PUT /api/credits/:id/pay
5. Backend sets credit.paid = true
6. Backend deducts from Customer.totalDue
7. Frontend refreshes credit list
8. Paid credits removed from view
```

## Deployment Strategies

### Option 1: Vercel + Heroku + MongoDB Atlas (Recommended for Beginners)

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   VITE_API_URL=https://your-api.herokuapp.com
   ```
4. Deploy automatically on push

#### Backend (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/retail

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Database (MongoDB Atlas)
1. Create free cluster at mongodb.com/cloud/atlas
2. Create database user
3. Whitelist Heroku IP (0.0.0.0/0 for easy access)
4. Copy connection string
5. Add to Heroku environment variables

### Option 2: Docker Containerization

#### Docker Setup
Create `Dockerfile` in backend:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongo:27017/retail
      JWT_SECRET: your_secret
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  frontend:
    build: ./frontend
    ports:
      - "80:5173"

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up
```

### Option 3: AWS Deployment

#### EC2 Instance Setup
```bash
# SSH into instance
ssh -i key.pem ubuntu@instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Clone project
git clone your-repo
cd ledgercontrol

# Setup backend
cd backend
npm install
npm start

# In another terminal, setup frontend
cd frontend
npm install
npm run build
npm run preview

# Use Nginx as reverse proxy
sudo apt-get install nginx
```

### Option 4: Render (All-in-One)

1. Connect GitHub repository
2. Create Web Service for backend
3. Create Static Site for frontend
4. Add MongoDB Atlas connection string
5. Auto-deploys on push

## Performance Optimization

### Frontend Optimization
```javascript
// Enable production mode
export NODE_ENV=production

// Minify assets
npm run build

// Enable gzip compression
// Configure nginx/server to use gzip
```

### Backend Optimization
1. **Add database indexes**:
   ```javascript
   productSchema.index({ name: 1 });
   customerSchema.index({ phone: 1 });
   ```

2. **Implement caching**:
   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   ```

3. **Add pagination**:
   ```javascript
   const page = req.query.page || 1;
   const limit = 10;
   const skip = (page - 1) * limit;
   const products = await Product.find().skip(skip).limit(limit);
   ```

4. **Enable compression**:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

## Security Checklist

### Frontend
- [ ] Remove all console.log statements
- [ ] Use HTTPS only in production
- [ ] Validate input on client side
- [ ] Never store sensitive data in localStorage
- [ ] Use Content Security Policy headers
- [ ] Sanitize user input

### Backend
- [ ] Validate all input server-side
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Hash passwords with bcryptjs
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular database backups
- [ ] Keep dependencies updated

Example production server config:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet()); // Set security headers

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## Monitoring & Logging

### Frontend Monitoring
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User behavior

### Backend Monitoring
- **PM2** - Process manager
- **Winston** - Logging library
- **DataDog** - Performance monitoring
- **MongoDB Atlas Monitoring** - Database metrics

Example logging setup:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Sale created', { saleId, amount });
```

## Scaling Strategy

### Horizontal Scaling
- Load balance multiple backend instances
- Use message queues (Redis, RabbitMQ)
- Separate read/write database replicas

### Vertical Scaling
- Increase server CPU/RAM
- Optimize database queries
- Implement caching layer

### Database Optimization
- MongoDB sharding for large datasets
- Read replicas for reports
- Archive old data

## Backup & Recovery

### Database Backups
```bash
# Monthly backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/retail" --out=./backups/monthly

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/retail" ./backups/monthly
```

### Automated Backups
- Enable MongoDB Atlas automated backups
- Store backups in S3
- Test recovery monthly

## Disaster Recovery Plan

1. **Database failure** → Restore from backups
2. **Frontend broken** → Rollback to previous version
3. **API down** → Switch to backup server
4. **Security breach** → Force password reset, rotate JWT secret
5. **Data loss** → Restore from backup, notify users

## Monitoring Checklist

- [ ] Daily sales and stock levels
- [ ] API response times
- [ ] Database connection logs
- [ ] Server CPU/memory usage
- [ ] Failed authentication attempts
- [ ] Unpaid credits alerts
- [ ] Low stock alerts
