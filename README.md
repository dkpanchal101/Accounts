# BannerPro – Banner & Digital Art Work Management System

A full-stack web application for managing banner and digital art work orders, customer details, and payment tracking.

## 🚀 Features

- **Authentication**: Secure admin login with JWT
- **Order Management**: Create, edit, delete, and view all work orders
- **Payment Tracking**: Automatic payment status calculation (Pending/Partial/Paid)
- **Dashboard**: Real-time statistics and revenue tracking
- **Search & Filter**: Search by customer name, filter by payment status
- **Responsive Design**: Modern dark-themed UI, mobile-friendly

## 📋 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

### Frontend
- React + Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- Axios

## 📁 Project Structure

```
BannerPro/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── orderRoutes.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Orders.jsx
    │   │   └── OrderForm.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── orderService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` file with your configuration:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bannerpro
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bannerpro
   ```

5. **Seed admin user:**
   ```bash
   node scripts/seedAdmin.js
   ```

   Default credentials:
   - Username: `admin`
   - Password: `admin123`

   ⚠️ **IMPORTANT**: Change the default password after first login!

6. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional, for production):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   For development, the proxy in `vite.config.js` handles this automatically.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 📱 Usage

1. **Login:**
   - Open `http://localhost:3000`
   - Use default credentials: `admin` / `admin123`
   - Change password after first login

2. **Dashboard:**
   - View total orders, pending payments, revenue statistics
   - Real-time updates

3. **Orders:**
   - View all orders in a table
   - Search by customer name
   - Filter by payment status
   - Sort by date, name, or amount
   - Edit or delete orders

4. **Add New Order:**
   - Click "Add New Order"
   - Fill in customer details
   - Enter amounts (remaining amount auto-calculates)
   - Payment status updates automatically

5. **Edit Order:**
   - Click "Edit" on any order
   - Update payment when money is received
   - Payment status recalculates automatically

## 🔐 Payment Status Logic

The system automatically calculates payment status:

- **Pending**: No advance payment received
- **Partial**: Some advance received, but remaining amount > 0
- **Paid**: Remaining amount = 0 (full payment received)

Remaining Amount = Total Amount - Advance Amount

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A strong random secret
     - `NODE_ENV`: `production`
     - `PORT`: (Auto-set by Render)

4. **Deploy**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Create `.env.production`:**
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

   Or connect GitHub repository to Vercel dashboard for automatic deployments.

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** (free tier available)
2. **Create a new cluster**
3. **Create a database user**
4. **Whitelist IP addresses** (0.0.0.0/0 for Render)
5. **Get connection string** and use in backend `.env`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin (optional)

### Orders
- `GET /api/orders/stats` - Get dashboard statistics
- `GET /api/orders` - Get all orders (with query params: search, paymentStatus, sortBy, sortOrder)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

All order endpoints require authentication (Bearer token).

## 🎨 Features Implemented

✅ Admin authentication with JWT
✅ Protected routes
✅ Order CRUD operations
✅ Automatic payment status calculation
✅ Dashboard with statistics
✅ Search by customer name
✅ Filter by payment status
✅ Sort orders
✅ Monthly revenue calculation
✅ Responsive dark-themed UI
✅ Payment tracking and updates

## 🔧 Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Check your `MONGODB_URI` in `.env`
- **Port Already in Use**: Change `PORT` in `.env` or kill the process using port 5000
- **JWT Error**: Ensure `JWT_SECRET` is set in `.env`

### Frontend Issues

- **API Connection Error**: Check backend is running and `VITE_API_URL` is correct
- **CORS Error**: Ensure backend CORS is configured (already included)
- **Build Errors**: Clear `node_modules` and reinstall dependencies

## 📝 License

This project is open source and available for use.

## 👨‍💻 Development

### Adding New Features

1. Backend: Add routes in `routes/`, controllers in `controllers/`
2. Frontend: Add pages in `pages/`, update routes in `App.jsx`
3. Update API service in `services/` if needed

### Code Structure

- **Backend**: MVC pattern (Models, Views/Controllers, Routes)
- **Frontend**: Component-based architecture with service layer
- **Styling**: Tailwind CSS utility classes

---

**Built with ❤️ for BannerPro**

