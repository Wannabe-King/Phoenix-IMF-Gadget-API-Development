# Gadget Management API

This is a RESTful API for managing gadgets, including functionalities such as user signup/login, adding gadgets, retrieving gadget lists, updating gadget statuses, and triggering gadget self-destruct sequences.

## Base URL
```
https://phoenix-imf-gadget-api-development.onrender.com
```

---

## Authentication
This API uses JWT tokens for authentication. Include the token in the `Authorization` header for protected routes.

### Example Header:
```
Authorization: Bearer <your_token>
```

---

## Endpoints

### **User Endpoints**

#### 1. **Sign Up**
- **POST** `/user/signup`
- **Description:** Creates a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User Created Successfully",
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2025-01-01T12:00:00.000Z"
    }
  }
  ```

#### 2. **Login**
- **POST** `/user/login`
- **Description:** Logs in a user and returns a token.
- **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "<JWT_TOKEN>",
    "message": "Signin Successful."
  }
  ```

---

### **Gadget Endpoints**

#### 1. **Get All Gadgets**
- **GET** `/gadgets`
- **Description:** Retrieves all gadgets. Use the `status` query parameter to filter by gadget status.
- **Protected Route:** Yes
- **Example Request:**
  ```
  GET /gadgets?status=Available
  ```
- **Response:**
  ```json
  [
    {
      "id": "123",
      "name": "The Kraken",
      "status": "Available",
      "createdAt": "2025-01-01T12:00:00.000Z",
      "successProbability": "75% success probability"
    }
  ]
  ```

#### 2. **Add a Gadget**
- **POST** `/gadgets`
- **Description:** Adds a new gadget with a unique codename.
- **Protected Route:** Yes
- **Response:**
  ```json
  {
    "id": "123",
    "name": "The Kraken II",
    "status": "Available",
    "createdAt": "2025-01-01T12:00:00.000Z",
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
  ```

#### 3. **Update a Gadget**
- **PATCH** `/gadgets/:id`
- **Description:** Updates the name or status of a gadget.
- **Protected Route:** Yes
- **Request Body:**
  ```json
  {
    "name": "The Kraken III",
    "status": "Deployed"
  }
  ```
- **Response:**
  ```json
  {
    "id": "123",
    "name": "The Kraken III",
    "status": "Deployed",
    "updatedAt": "2025-01-01T13:00:00.000Z"
  }
  ```

#### 4. **Decommission a Gadget**
- **DELETE** `/gadgets/:id`
- **Description:** Decommissions a gadget and records the date.
- **Protected Route:** Yes
- **Response:**
  ```json
  {
    "id": "123",
    "name": "The Kraken",
    "status": "Decommissioned",
    "decommissionedAt": "2025-01-01T13:00:00.000Z"
  }
  ```

#### 5. **Trigger Self-Destruct**
- **POST** `/gadgets/:id/self-destruct`
- **Description:** Initiates the self-destruct sequence for a gadget.
- **Protected Route:** Yes
- **Response:**
  ```json
  {
    "message": "Self-destruct sequence initiated for The Kraken.",
    "confirmationCode": "ABC123"
  }
  ```

---

## Environment Variables
Ensure the following environment variables are set:
- `DATABASE_URL`: Your PostgreSQL database URL.
- `JWT_SECRET`: Secret key for JWT token generation.
- `PORT`: Port number for the server.

---

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file with the required environment variables.
4. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```
5. Start the server:
   ```bash
   npm start
   ```

---

## Notes
- Replace `<JWT_TOKEN>` in the examples with a valid token obtained from the `/user/login` endpoint.
- Ensure your database is properly set up and connected before starting the server.

---

## Error Handling
- **400 Bad Request:** Missing or invalid inputs.
- **401 Unauthorized:** No token provided.
- **403 Forbidden:** Invalid token.
- **404 Not Found:** Resource not found.
- **500 Internal Server Error:** An error occurred on the server.

For further assistance, contact the API maintainer.

