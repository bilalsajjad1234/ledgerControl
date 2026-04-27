# Development Guide

## Code Structure & Best Practices

### Frontend (React.js)

#### Component Organization

```
components/
├── layout/       # Page structure (Sidebar, Topbar)
├── ui/           # Reusable UI components (Button, Input, Card)
├── charts/       # Data visualization
├── forms/        # Form components
└── lists/        # List/table components
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `Dashboard.jsx`, `ProductList.jsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useFetch.js`, `useToast.js`)
- **Services**: camelCase with `Service` suffix (e.g., `productService.js`)
- **Props**: camelCase (e.g., `isLoading`, `onSubmit`)
- **CSS Classes**: kebab-case (e.g., `bg-slate-50`, `rounded-3xl`)

#### Component Pattern

```jsx
// pages/Products.jsx
import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';

export default function Products() {
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Side effects
  }, []);

  const handleAction = async () => {
    try {
      // Action logic
      toast.success('Success message');
    } catch (error) {
      toast.error('Error message');
    }
  };

  return (
    <div className="space-y-6">
      {/* JSX content */}
    </div>
  );
}
```

#### Best Practices

1. **Use functional components with hooks** - No class components
2. **Lift state only when necessary** - Keep state as low as possible
3. **Memoize expensive computations** - Use `useMemo()` for derived data
4. **Keep components focused** - One responsibility per component
5. **Extract magic numbers** - Use constants
6. **Use descriptive names** - `products` instead of `data`

#### API Integration

```jsx
// Always use services layer
import { productService } from '../services/productService';

const { data: products, error, loading } = useFetch(() => 
  productService.list().then(res => res.data)
);
```

### Backend (Node.js/Express)

#### File Organization

```
controllers/  - Business logic for each resource
models/       - MongoDB schemas
routes/       - API endpoint definitions
middleware/   - Authentication, validation, error handling
config/       - Database, environment setup
```

#### Controller Pattern

```javascript
// controllers/productController.js
const Product = require('../models/Product');

exports.list = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
```

#### API Route Pattern

```javascript
// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', auth, productController.list);
router.post('/', auth, productController.create);
router.put('/:id', auth, productController.update);
router.delete('/:id', auth, productController.remove);

module.exports = router;
```

#### Naming Conventions

- **Files**: camelCase (e.g., `productController.js`)
- **Functions**: camelCase (e.g., `findProductById()`)
- **Database fields**: camelCase (e.g., `totalDue`, `productId`)
- **Routes**: lowercase with hyphens for multi-word (e.g., `/api/low-stock-alerts`)

### Database (MongoDB)

#### Schema Design

```javascript
// models/Product.js
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);
```

#### Best Practices

1. **Always include timestamps** - `createdAt`, `updatedAt`
2. **Use required fields** - Enforce data integrity
3. **Set defaults** - Prevent null values
4. **Index frequently queried fields** - Improve performance
5. **Use refs for relationships** - Link between collections
6. **Validate at schema level** - Catch errors early

### State Management

#### Using Context API

```javascript
// context/AppContext.jsx
import { createContext, useContext } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);

  return (
    <AppContext.Provider value={{ products }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

// Usage in component
const { products } = useApp();
```

#### When to Use Context

- Global application state
- Theme/authentication
- Shared data across multiple components

#### When NOT to Use Context

- Frequently changing state
- Simple component state
- Derived data (calculate instead)

### Error Handling

#### Frontend

```javascript
// Always wrap async operations
try {
  const response = await api.post('/endpoint', data);
  toast.success('Operation successful');
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  console.error('Error:', error);
}
```

#### Backend

```javascript
// Always return appropriate status codes
if (!product) {
  return res.status(404).json({ message: 'Product not found' });
}

const product = await Product.create(req.body);
res.status(201).json(product);
```

## Development Workflow

### Before Starting

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Ensure environment variables are set
3. Start both frontend and backend servers

### During Development

1. Write code following style guide
2. Test functionality manually
3. Check browser console for errors
4. Check server logs for issues

### Before Committing

1. Test all related features
2. Remove console.log statements
3. Format code (Prettier/ESLint)
4. Write meaningful commit messages

### Commit Message Format

```
type(scope): subject

feat(products): add bulk product import
fix(auth): prevent token expiration timeout
docs(readme): update installation steps
refactor(sales): simplify cart calculations
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Testing Guidelines

### Frontend Testing

```javascript
// Test user interactions
const { render, screen } = require('@testing-library/react');
const ProductPage = require('./Products');

test('renders product list', () => {
  render(<ProductPage />);
  expect(screen.getByText(/products/i)).toBeInTheDocument();
});
```

### Backend Testing

```javascript
// Test API endpoints
const request = require('supertest');
const app = require('./server');

describe('Products API', () => {
  test('GET /api/products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Performance Optimization

### Frontend

1. **Lazy load routes**:
   ```javascript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

2. **Memoize expensive components**:
   ```javascript
   export default memo(ProductList);
   ```

3. **Optimize re-renders**:
   ```javascript
   const items = useMemo(() => products.filter(...), [products]);
   ```

4. **Use virtual scrolling** for large lists
5. **Image optimization** - Use correct sizes

### Backend

1. **Add database indexes** on frequently queried fields
2. **Use pagination** for large datasets
3. **Cache API responses** when appropriate
4. **Optimize queries** - Select only needed fields
5. **Use async/await** properly - Don't block operations

## Debugging Tips

### Frontend

- **Browser DevTools** - Inspect elements, network, console
- **React DevTools** - Profile components, check props
- **Vite DevTools** - Source maps for debugging

### Backend

- **Console.log()** - Quick logging
- **Nodemon** - Auto-restart on file changes
- **MongoDB Compass** - Visualize database data
- **Postman/Insomnia** - Test API endpoints

## Common Issues & Solutions

### Frontend Not Connecting to Backend

```
Error: CORS error
Solution: Check CORS config in server.js, ensure ports match
```

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
Solution: Start MongoDB or update MONGODB_URI in .env
```

### Token Expired on Protected Routes

```
Error: 401 Unauthorized
Solution: Clear localStorage, login again. Add refresh token logic for production
```

### Port Already in Use

```
Error: EADDRINUSE :::5000
Solution: Kill process or change PORT in .env
```

## Tools & Extensions

### VS Code Extensions

- ESLint
- Prettier
- Thunder Client (API testing)
- MongoDB for VS Code
- Tailwind CSS IntelliSense

### Development Tools

- **Postman** - API testing
- **MongoDB Compass** - Database management
- **React DevTools** - React debugging

## Production Checklist

- [ ] Remove all console.log statements
- [ ] Update all environment variables
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Configure CORS for specific domains
- [ ] Enable database backups
- [ ] Set up monitoring/alerts
- [ ] Test all critical workflows
- [ ] Document API changes
- [ ] Update deployment documentation
