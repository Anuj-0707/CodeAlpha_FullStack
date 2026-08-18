# ShopEase - Simple E-commerce Store

A complete beginner-friendly full-stack e-commerce project.

## Technology

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js
- Database: MySQL
- Authentication: JWT
- Password security: bcryptjs

## Features

- Product listing
- Product details
- Product search
- Shopping cart
- Quantity update
- Remove from cart
- User registration
- User login
- JWT authentication
- Checkout
- Order processing
- Stock reduction
- Order history
- Responsive UI

## 1. Install requirements

Install Node.js and MySQL.

## 2. Create the project

Open terminal in this folder and run:

```bash
npm install
```

## 3. Create database

Open MySQL Workbench or MySQL command line and run:

```sql
SOURCE database/schema.sql;
```

Or copy and run the complete `database/schema.sql` file.

## 4. Configure environment

Copy `.env.example` to `.env`.

Set your MySQL password:

```text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=use_a_long_random_secret
PORT=3000
```

## 5. Start server

```bash
npm start
```

For development:

```bash
npm run dev
```

Open:

http://localhost:3000

## Project flow

1. User opens product page.
2. Products are loaded from Express API.
3. User adds products to localStorage cart.
4. User registers/logs in.
5. JWT token is stored in localStorage.
6. User checks out.
7. Frontend sends order to Express.
8. Express verifies JWT.
9. Express checks product stock.
10. Order and order items are saved in MySQL.
11. Product stock is reduced.
12. User can see order history.

## API endpoints

### Authentication

POST `/api/auth/register`

POST `/api/auth/login`

### Products

GET `/api/products`

GET `/api/products/:id`

### Orders

POST `/api/orders`

GET `/api/orders/my`

## Important note

This is an educational project. A production store should additionally use HTTPS, stronger security controls, server-side cart validation, CSRF protection where applicable, secure HttpOnly cookies instead of localStorage for sensitive tokens, payment-provider integration, rate limiting, input validation, logging, and proper deployment configuration.
