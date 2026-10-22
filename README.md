# LeaveEase

**LeaveEase** is a full-stack employee leave management system. Employees can apply for leave and track their requests, while an administrator can review employees and approve or reject leave requests from a dedicated dashboard.

## Features

**Employee**
- Register and sign in
- Apply for leave (type, dates, reason)
- View, track and cancel your own leave requests
- Personal dashboard with leave summary

**Admin**
- Static admin login (configured in `application.properties`)
- Admin dashboard with all leave requests
- Approve or reject leave requests
- View all registered employees

**UI**
- Responsive design built with Tailwind CSS
- Blue-to-lavender gradient theme with glass-style navigation

## Tech Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | React 19, Vite, React Router, Tailwind CSS 4, Axios, Lucide icons |
| Backend  | Java 17, Spring Boot 4, Spring Data JPA, Bean Validation |
| Database | MySQL                                                   |

## Project Structure

```
LeaveEase/
├── backend/                 # Spring Boot REST API
│   └── src/main/java/com/leaveease/backend/
│       ├── controller/      # UserController, LeaveController
│       ├── service/         # UserService, LeaveService
│       ├── repository/      # JPA repositories
│       └── model/           # User, LeaveRequest entities
└── frontend/                # React + Vite app
    └── src/
        ├── components/      # Navbar, Sidebar, AuthShell
        ├── pages/           # Login, Register, dashboards, ApplyLeave, MyLeaves
        └── services/        # Axios API client
```

## Prerequisites

- Java 17 or newer
- Node.js 18 or newer
- MySQL 8 or newer

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/LeaveEase.git
cd LeaveEase
```

### 2. Set up the database

Create an empty MySQL database:

```sql
CREATE DATABASE leaveease;
```

Tables are created automatically by Hibernate on first run.

### 3. Configure the backend

Open `backend/src/main/resources/application.properties` and set your MySQL credentials and admin login:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/leaveease
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# Static admin login
leaveease.admin.email=admin@leaveease.com
leaveease.admin.password=Admin@123
leaveease.admin.name=Administrator
```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run        # macOS / Linux
.\mvnw spring-boot:run        # Windows PowerShell
```

The API starts on `http://localhost:8080`.

### 5. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Requests to `/api` are proxied to the backend automatically.

## Default Admin Login

| Field    | Value                 |
|----------|-----------------------|
| Email    | `admin@leaveease.com` |
| Password | `Admin@123`           |

Employees register from the **Sign Up** page. Change the admin credentials in `application.properties` before using this anywhere beyond local development.

## API Endpoints

**Users** (`/api/users`)

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| POST   | `/register`  | Register a new employee              |
| POST   | `/login`     | Log in (admin or employee)           |
| GET    | `/`          | List all users                       |
| GET    | `/{id}`      | Get a user by ID                     |

**Leaves** (`/api/leaves`)

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| POST   | `/`               | Apply for leave                    |
| GET    | `/`               | List all leave requests            |
| GET    | `/user/{userId}`  | List one employee's leave requests |
| PUT    | `/{id}/approve`   | Approve a leave request            |
| PUT    | `/{id}/reject`    | Reject a leave request             |
| DELETE | `/{id}`           | Cancel a leave request             |

## Known Limitations and Roadmap

- Passwords are stored in plain text. Add BCrypt hashing before real use.
- Authentication is basic (no JWT or Spring Security yet), so API endpoints are not role-protected.
- The user list endpoint currently returns password fields. Hide them in API responses.
- Planned: leave balances, email notifications, password reset, and role-based route protection on the server.

## License

This project is for learning and portfolio purposes.
