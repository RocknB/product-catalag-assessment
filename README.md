# Product Catalog Assessment


## Database Setup

### 1. Create the database

PostgreSQL was used to setup a simple database to develop the assessment. 

Connect to PostgreSQL and create the `product_catalog` database:

```sql
CREATE DATABASE product_catalog;
```

### 2. Seed initial data

After starting the backend once (so Hibernate creates the tables), run the following SQL against the `product_catalog` database:

```sql
-- Test user (username: test / password: password)
INSERT INTO catalog_users (active, created_at, last_login, "password", "role", username)
VALUES (true, '2026-02-12 13:49:06.505', '2026-02-12 13:49:06.505',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'user', 'test');

-- Categories
INSERT INTO categories (name, description, active, created_at, updated_at, created_by, updated_by)
VALUES
  ('Electronics', 'Electronic devices and accessories', true, NOW(), NOW(), 'system', 'system'),
  ('Furniture',   'Office and home furniture',          true, NOW(), NOW(), 'system', 'system'),
  ('Appliances',  'Home and kitchen appliances',        true, NOW(), NOW(), 'system', 'system');

-- Products
INSERT INTO products (name, description, price, category_id, active, created_at, updated_at, created_by, updated_by)
VALUES
  ('Laptop Pro',     'High-performance laptop for professionals', 1299.99, 1, true, NOW(), NOW(), 'system', 'system'),
  ('Wireless Mouse', 'Ergonomic wireless mouse',                    29.99, 1, true, NOW(), NOW(), 'system', 'system'),
  ('Office Chair',   'Comfortable ergonomic office chair',         249.99, 2, true, NOW(), NOW(), 'system', 'system'),
  ('Desk Lamp',      'LED desk lamp with adjustable brightness',    39.99, 2, true, NOW(), NOW(), 'system', 'system'),
  ('Coffee Maker',   'Programmable coffee maker',                   89.99, 3, true, NOW(), NOW(), 'system', 'system');
```

---

## Running the Backend

1. Navigate to the `backend/` directory:

   ```bash
   cd backend
   ```

2. The `.env` file is in the project to facilitate setup, typically this file should not be in git.

3. Run the application using the Maven wrapper:

   ```bash
   # Windows
   ./mvnw.cmd spring-boot:run
   ```

   The backend will start on **http://localhost:8080**.

4. Run backend tests:

   ```bash
   # Windows
   ./mvnw.cmd test
   ```

---

## Running the Frontend

1. Navigate to the `frontend/` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will start on **http://localhost:5173** (default Vite port).

4. Run frontend tests:

   ```bash
   npm run test:run
   ```

Note: similar to the backend, the .env file is also included.

---

## Test Credentials

| Username | Password |
|----------|----------|
| test     | password |
