# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Feature Flags
VITE_ENABLE_BARCODE_SCANNER=true
VITE_ENABLE_REPORTS_EXPORT=true
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_ENABLE_BARCODE_SCANNER` | Enable barcode scanner feature | `true` / `false` |
| `VITE_ENABLE_REPORTS_EXPORT` | Enable CSV report export | `true` / `false` |

## Backend Environment Variables

Create a `.env` file in the `backend/` directory (copy from `.env.example`):

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/retail-inventory

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/retail-inventory` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 characters) | `your_secure_random_string` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` (7 days), `24h` (24 hours) |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment type | `development` or `production` |

---

## Production Setup

### Frontend Production Build

```env
VITE_API_URL=https://api.yourdomain.com
```

### Backend Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/retail-inventory
JWT_SECRET=generate-a-cryptographically-secure-random-string-min-32-chars
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## MongoDB Atlas Setup (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user (username/password)
4. Whitelist your IP addresses
5. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/retail-inventory?retryWrites=true&w=majority
   ```
6. Replace username and password in `.env`

## Local MongoDB Setup

### Windows
- Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- Install and select "Install MongoDB as a Service"
- MongoDB runs on `localhost:27017` by default

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

## Verifying Setup

### Check Frontend Config
```bash
cd frontend
cat .env
```

### Check Backend Config
```bash
cd backend
cat .env
```

### Test MongoDB Connection
```bash
cd backend
npm install -g mongodb-client-tools
mongosh "mongodb://localhost:27017/retail-inventory"
```

### Test Backend Server
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

### Test Frontend Running
```bash
cd frontend
npm run dev
# Navigate to http://localhost:5173
```

---

## Common Issues

### MongoDB Connection Refused
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check connection string matches actual MongoDB instance
- Firewall might be blocking connections

### JWT Secret Not Set
- Backend will fail to start
- Ensure `JWT_SECRET` is at least 32 characters

### API URL Incorrect
- Frontend can't reach backend
- Verify `VITE_API_URL` matches backend address
- Check CORS settings in backend

### Port Already in Use
- Backend: `lsof -i :5000` and kill the process
- Frontend: Vite will use next available port (5174, 5175, etc.)

---

## Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong, random JWT_SECRET** (min 32 characters)
3. **Rotate secrets every 90 days** in production
4. **Use environment-specific configs**:
   - `.env` for local development
   - `.env.staging` for staging
   - `.env.production` for production
5. **Enable MongoDB authentication** in production
6. **Use HTTPS** in production
7. **Implement rate limiting** for API endpoints
8. **Set secure CORS origins** in production

Example production backend config:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://secure-user:secure-pass@prod-cluster.mongodb.net/retail-inventory
JWT_SECRET=your-extremely-secure-random-string-here
JWT_EXPIRE=7d
CORS_ORIGIN=https://yourdomain.com
```
