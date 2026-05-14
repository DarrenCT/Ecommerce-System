# Ecommerce System — Resume Source of Truth

## What I Built

### Core Features
- Full-stack e-commerce platform from scratch — product catalog, cart, checkout, order history
- User authentication system — registration, sign-in, JWT-based session management, protected routes
- Shopping cart — guest cart support, cart merging on login (guest cart + authenticated user cart), quantity management
- Product catalog — paginated browsing, full-text search by name/brand, 4-level category filtering, product detail pages
- Order flow — checkout with shipping/billing address collection, order creation, automatic inventory deduction, order confirmation
- User account management — profile editing, multiple saved shipping addresses, saved credit cards, purchase history
- Admin dashboard — customer management, customer details view, analytics charts
- Inventory management — real-time stock tracking, out-of-stock handling

### Technical Implementations
- RESTful API with 8 route modules (auth, products, cart, orders, payment, users, account, sign-in)
- JWT authentication — stateless Bearer tokens (7-day expiry), auth middleware for route protection, role-based access control infrastructure
- Image handling — product images stored as binary Buffer in MongoDB, encoded as base64 data URLs for frontend display
- Cart-user association — anonymous cart via UUID persisted in localStorage, merged to user cart on login
- Mongoose schema design — nested sub-documents for addresses/cards, object references for cart-product and order-product relationships, schema methods for cart total calculation
- Context API state management for global auth state without Redux
- Service layer pattern — `cartService.js` abstracts all cart API calls from components
- Docker Compose multi-container orchestration with hot reload in development

---

## Technologies & Tools

| Category | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Axios |
| **UI/Styling** | Tailwind CSS, Shadcn/ui, Radix UI, Framer Motion, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Charts** | Chart.js, react-chartjs-2 |
| **Infrastructure** | Docker, Docker Compose |
| **Dev Tools** | Nodemon, ESLint, PostCSS, Autoprefixer |
| **Utilities** | date-fns, uuid |

---

## Patterns & Techniques
- Client-server SPA architecture
- RESTful API design
- Stateless JWT authentication
- React Context API for global state management
- Component-based architecture (pages / shared / admin separation)
- Service layer abstraction
- Monorepo project structure
- Container-based deployment with Docker

---

## Project Structure

```
root/
├── server/                 # Express REST API
│   ├── config/             # DB connection
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas (Product, User, Order, Cart)
│   ├── routes/             # 8 route files
│   └── server.js
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/      # Admin dashboard
│   │   │   ├── layouts/    # Layout wrappers
│   │   │   ├── pages/      # 11 page components
│   │   │   └── shared/     # NavBar, FilterSidebar, ProductCard, etc.
│   │   ├── context/        # DevAuthContext
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # cartService.js, API abstraction
│   │   └── utils/
│   └── vite.config.js
└── docker-compose.yml
```
