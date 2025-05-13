# CareerArcade - Job Portal

CareerArcade is a full-stack job portal application designed to connect job seekers with employers. It supports role-based functionality for **Job Seekers**, **Employers**, and **Admins**, offering essential features like user registration, job postings, job applications, and more.

---

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core Web API**
- **Entity Framework Core**
- **SQL Server**
- **JWT Authentication**

### Frontend
- **React.js**
- **React Router**
- **Context API**
- **Axios**
- **react-data-table-component**

---

## 📂 Project Structure

### Backend (`/CareerArcade.API`)
- `Controllers/` – API endpoints
- `Models/` – Entity models
- `DTOs/` – Data Transfer Objects
- `Data/` – DbContext and database config
- `Repositories/` – Data access layer
- `Services/` – Business logic
- `Helpers/` – JWT generation, role handling
- `Program.cs` / `Startup.cs` – App configuration

### Frontend (`/careerarcade-frontend`)
- `src/pages/` – Pages by role: Jobseeker, Employer, Admin
- `src/components/` – Reusable components
- `src/context/` – Auth context with role handling
- `src/routes/` – Protected routes by role
- `src/services/` – API calls
- `src/App.js` – Routing setup

---

## ✅ Features

### Authentication & Authorization
- Register/Login for all roles (Job Seeker, Employer, Admin)
- JWT-based authentication
- Role-based protected routes

### Job Seeker
- View job listings
- Search and sort jobs
- Apply for jobs
- View applied jobs

### Employer
- Post new jobs
- Manage posted jobs
- View applicants for jobs

### Admin
- View all users
- Manage job postings and users
- Moderate content

---

## ⚙️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd CareerArcade.API
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=CareerArcadeDb;Trusted_Connection=True;"
   }
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd careerarcade-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

## 🔐 Role-Based Routing

- Auth token stored in `localStorage`
- Roles extracted from JWT and stored in Context
- Routes rendered conditionally based on roles
- Separate dashboard pages per user type

---

## 📦 API Endpoints (Examples)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Jobs
- `GET /api/jobs` – List jobs
- `POST /api/jobs` – Create job (Employer only)
- `GET /api/jobs/{id}` – Job details

### Applications
- `POST /api/apply` – Apply to a job
- `GET /api/applications` – List user's applications

---

## 📸 Screenshots
### Admin Dashboard
>![Admin Dashboard](./Screenshots/Admin%20Dashboard.jpeg)
### Employer Dashboard
>![Employer Dashboard](./Screenshots/Employer%20Dashboard.jpeg)
### Jobseeker
>![Jobseeker Dashboard](./Screenshots/Jobseeker%20Dashboard.jpeg)


---

## ✍️ Authors

- 👨‍💻 Shreyansh Srivastava – Full Stack Developer  
- 📫 Contact: sheryanshsri1807@gmail.com  

---

## 📄 License

This project is licensed under the MIT License.

---

## 🚀 Future Enhancements

- Resume upload and parsing
- Chat between employer and applicant
- Job alerts and email notifications
- Admin analytics dashboard
