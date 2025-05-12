# Hotel Booking Backend API

This is a backend API for a hotel booking system built with **Node.js**, **Express**, **MongoDB**, and **JWT**. It supports user registration, login, role-based access control, hotel and room management (for admins), and room booking (for users).

## Deployed Link

The API is deployed and accessible at: [https://hotel-booking-backend-nr66.onrender.com](https://hotel-booking-backend-nr66.onrender.com)

## Features

-  User authentication with JWT
-  Role-based access control (`user`, `admin`)
-  Hotel CRUD operations (admin-only)
-  Room CRUD operations (admin-only)
-  Room availability check & booking (users)
-  User booking history
-  Secure password storage using bcrypt

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **UUIDs:** UUIDv4 for IDs

---

##  Project Structure

```
hotel-booking-backend/
│
├── controllers/        # Controller logic for users, hotels, rooms, bookings
├── middleware/         # JWT,user data and  role validation middleware
├── routes/             # API routes
├── config/             # Db config, token generation and verification
├── app.js              # Main application logic 
└── README.md           # Project documentation
```

---

##  Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/visshal14/hotel-booking-backend.git
cd hotel-booking-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `dev.env` file in config folder and add the following:

```env
JWTSecret=
host=
port=
user=
password=
database=
```


### 4. Start the Server

```bash
node app.js
```

---


##  Author

Made by Vishal

##  License

This project is licensed under the MIT License.