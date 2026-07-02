# 🎓 Internship Management System

Một hệ thống quản lý thực tập toàn diện, xây dựng bằng **Spring Boot** (Backend) và **React + Vite** (Frontend), giúp quản lý toàn bộ quy trình thực tập từ giai đoạn phân công, đánh giá cho đến quản lý kết quả.

> 🌐 **Live Demo (Frontend)**: [https://trung1609.github.io/Internship-Management-System/](https://trung1609.github.io/Internship-Management-System/)
>
> 🔌 **Backend API (Production)**: `https://152.42.219.216.nip.io` (DigitalOcean Droplet — IP `152.42.219.216` qua nip.io wildcard DNS)
>
> 🚀 **Deployment**: Backend deploy trên **DigitalOcean Droplet** qua **Docker Compose** (PostgreSQL 15 + Redis + RabbitMQ + Spring Boot). Frontend deploy lên **GitHub Pages** bằng `gh-pages`.

---

## 📋 Mục Lục

1. [Tổng quan](#-tổng-quan)
2. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
3. [Cấu trúc dự án](#-cấu-trúc-dự-án)
4. [Sơ đồ cơ sở dữ liệu](#-sơ-đồ-cơ-sở-dữ-liệu)
5. [API Endpoints](#-api-endpoints)
6. [Các tính năng chính](#-các-tính-năng-chính)
7. [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
8. [Hướng dẫn chạy dự án](#-hướng-dẫn-chạy-dự-án)
9. [Deploy lên DigitalOcean](#-deploy-lên-digitalocean)
10. [Xác thực & Phân quyền](#-xác-thực--phân-quyền)
11. [Ghi chú quan trọng](#-ghi-chú-quan-trọng)

---

## 🎯 Tổng Quan

**Internship Management System** là nền tảng quản lý thực tập toàn diện cho các trường đại học, giúp:
- ✅ Quản lý thông tin sinh viên, cố vấn, và người dùng (CRUD + soft delete)
- ✅ Phân công sinh viên (nhiều sinh viên) cho cùng một đợt thực tập (ManyToMany Assignment ↔ Student)
- ✅ Định nghĩa các giai đoạn thực tập (`InternshipPhase`) với thời gian cụ thể
- ✅ Vòng đánh giá (`AssessmentRound`) gắn với từng giai đoạn, mỗi vòng có nhiều tiêu chí có trọng số
- ✅ Đánh giá sinh viên theo từng tiêu chí, có điểm đóng góp (`contribution`) và nhận xét
- ✅ Chấm điểm hàng loạt (bulk grading) cho mentor theo assignment / nhóm sinh viên
- ✅ Sinh viên nộp báo cáo (`Report` — upload file), mentor/admin tải xuống, xuất Excel & ZIP
- ✅ Quản lý báo cáo sinh viên: tìm kiếm, tải file, xuất Excel, xuất ZIP, chấm điểm báo cáo
- ✅ Hệ thống **Notification** real-time: backend publish event qua RabbitMQ → lưu DB + có thể gửi email
- ✅ Trang thông báo có badge số lượng chưa đọc, đánh dấu đã đọc từng thông báo hoặc toàn bộ
- ✅ Bảng điều khiển thống kê theo vai trò (Admin / Mentor)
- ✅ Trang cài đặt hồ sơ cá nhân, đổi ảnh đại diện và đổi mật khẩu
- ✅ Quên mật khẩu & đặt lại mật khẩu qua email (token lưu Redis, gửi qua RabbitMQ + Gmail/SendGrid)
- ✅ Xác thực JWT (Access + Refresh token, blacklist qua Redis)
- ✅ Phân quyền dựa trên vai trò (`ROLE_ADMIN`, `ROLE_MENTOR`, `ROLE_STUDENT`) qua `@PreAuthorize`
- ✅ Đóng gói toàn bộ stack bằng Docker Compose, deploy production lên DigitalOcean

---

## 💻 Công Nghệ Sử Dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **Spring Boot** | 4.0.4 | Framework chính |
| **Spring Data JPA** | - | ORM, quản lý cơ sở dữ liệu |
| **Spring Security** | - | Xác thực & phân quyền |
| **Spring Validation** | - | Kiểm tra dữ liệu đầu vào |
| **Spring Web MVC** | - | REST API |
| **Spring AMQP (RabbitMQ)** | - | Message queue & thông báo bất đồng bộ |
| **Spring Mail** | - | Gửi email (Gmail SMTP) |
| **PostgreSQL** | 16+ | Cơ sở dữ liệu chính |
| **Redis** | 7+ | Token blacklist & password reset token |
| **Hibernate** | - | JPA Implementation |
| **JWT (JJWT)** | 0.11.5 | Xác thực token |
| **Apache POI** | 5.2.3 | Xuất báo cáo Excel |
| **Lombok** | - | Giảm boilerplate code |
| **Java** | 17 | Ngôn ngữ lập trình |
| **Gradle** | 8.x | Build tool |
| **SendGrid** | - | Email service (production) |
| **Docker / Docker Compose** | - | Containerization & orchestration |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **React** | 19.2.6 | UI Framework |
| **Vite** | 8.0.12 | Build tool & dev server |
| **Material-UI (MUI)** | 9.0.1 | Component library |
| **React Router DOM** | 7.15.1 | Routing |
| **Axios** | 1.16.1 | HTTP client |
| **React Hook Form** | 7.76.0 | Form management |
| **React Toastify** | 11.1.0 | Thông báo toast |
| **SweetAlert2** | 11.26.25 | Dialog & xác nhận hành động |
| **Framer Motion** | 12.40.0 | Hiệu ứng & animation |

### DevOps & Deployment
| Công nghệ | Mục đích |
|-----------|----------|
| **Docker** | Container hóa Backend & các service phụ trợ |
| **Docker Compose** | Orchestration đa container (Postgres, Redis, RabbitMQ, Backend) |
| **DigitalOcean Droplet** | Host Backend production |
| **GitHub Pages** | Host Frontend production |

---

## 📁 Cấu Trúc Dự Án

```
Internship-Management-System/
│
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/trung/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/              # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── StudentController.java
│   │   │   │   │   ├── MentorController.java
│   │   │   │   │   ├── ReportController.java 
│   │   │   │   │   ├── NotificationController.java 
│   │   │   │   │   ├── InternshipAssignmentController.java
│   │   │   │   │   ├── InternshipPhaseController.java
│   │   │   │   │   ├── AssessmentRoundsController.java
│   │   │   │   │   ├── EvaluationCriteriaController.java
│   │   │   │   │   ├── RoundCriteriaController.java
│   │   │   │   │   └── AssessmentResultController.java
│   │   │   │   ├── service/                 # Business Logic Layer
│   │   │   │   │   ├── impl/                # Service Implementations
│   │   │   │   │   └── PasswordResetService.java
│   │   │   │   ├── repository/              # Data Access Layer (JPA)
│   │   │   │   ├── entity/                  # JPA Entities / Domain Models
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/             # Request DTOs
│   │   │   │   │   └── response/            # Response DTOs
│   │   │   │   ├── mapper/                  # Entity <-> DTO Mapping
│   │   │   │   ├── security/                # Security Configuration & JWT
│   │   │   │   ├── config/                  # Spring Configuration (AMQP, Mail, Redis)
│   │   │   │   ├── event/                   # Application Events & Listeners
│   │   │   │   ├── validation/              # Custom Validators
│   │   │   │   ├── exception/               # Custom Exceptions & Handlers
│   │   │   │   ├── util/                    # Utility Classes
│   │   │   │   └── IntershipManagementSystemApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml          # Configuration
│   │   │       └── application-dev.yml      # Configuration development
│   │   │       └── application-prod.yml     # Configuration production
│   │   └── test/
│   │
│   ├── gradle/                              # Gradle Wrapper
│   ├── build.gradle                         # Gradle dependencies
│   ├── settings.gradle
│   ├── Dockerfile                           # Backend container image
│   ├── docker-compose.yml                   # Full stack: Postgres + Redis + RabbitMQ + Backend
│   └── README.md
│
├── Frontend/
│   ├── src/
│   │   ├── api/                             # API Client
│   │   │   ├── authApi.js                   # Auth API calls
│   │   │   ├── resourceApi.js               # REST API endpoints
│   │   │   └── axiosClient.js               # Axios instance & interceptors
│   │   ├── components/                      # Reusable Components
│   │   │   ├── AppLayout.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ThemeToggleButton.jsx
│   │   ├── context/                         # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                           # Page Components
│   │   │   ├── MainDashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AssignmentDetail.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── admin/                 
│   │   │       ├── AdminDashboard.jsx
│   │   │   └── auth/                  
│   │   │       ├── ForgotPasswordPage.jsx
│   │   │       ├── RegisterPage.jsx
│   │   │       ├── LoginPage.jsx
│   │   │       ├── ResetPasswordPage.jsx
│   │   │   └── mentors/                  
│   │   │       ├── MentorDashboard.jsx
│   │   │       ├── AssignedMentor.jsx
│   │   │   └── students/                 
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── AssignedStudents.jsx
│   │   │       ├── StudentReportSubmit.jsx
│   │   │   └── management/                  # Management Pages
│   │   │       ├── UsersManagement.jsx
│   │   │       ├── StudentsManagement.jsx
│   │   │       ├── MentorsManagement.jsx
│   │   │       ├── InternshipPhasesManagement.jsx
│   │   │       ├── InternshipAssignmentsManagement.jsx
│   │   │       ├── AssessmentRoundsManagement.jsx
│   │   │       ├── AssessmentRoundDetail.jsx
│   │   │       ├── EvaluationCriteriaManagement.jsx
│   │   │       ├── AssessmentResultsManagement.jsx
│   │   │       └── AssessmentResultDetail.jsx
│   │   ├── assets/                          # Static assets
│   │   ├── App.jsx                          # Main App Component
│   │   ├── main.jsx                         # Entry Point
│   │   ├── index.css                        # Global Styles
│   │   └── App.css
│   ├── public/                              # Static files
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md (This file)
```

---

## 🗄️ Sơ Đồ Cơ Sở Dữ Liệu

### Entities & Relationships

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER (Base Entity)                        │
│  ┌─────────────┬──────────┬────────────┬────────────────────────┐│
│  │ userId (PK) │ username │ password   │ fullName, email, phone ││
│  │ role        │ isActive │ createdAt  │ updatedAt             ││
│  └─────────────┴──────────┴────────────┴────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
    ┌────────────┐      ┌─────────┐
    │  STUDENT   │      │ MENTOR  │
    │ studentId  │      │ mentorId│
    │ userId (FK)│      │userId(FK│
    └────────────┘      └─────────┘
         │                    │
         └────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │  INTERNSHIP_ASSIGNMENT   │
        │ assignmentId (PK)        │
        │ studentId (FK)           │
        │ mentorId (FK)            │
        │ phaseId (FK)             │
        │ status                   │
        │ startDate, endDate       │
        └──────────────────────────┘
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
┌──────────────────┐  ┌──────────────────────┐
│ INTERNSHIP_PHASE │  │  ASSESSMENT_ROUND    │
│ phaseId (PK)     │  │ roundId (PK)         │
│ phaseName        │  │ roundName            │
│ description      │  │ description          │
│ startDate        │  │ startDate, endDate   │
│ endDate          │  └──────────────────────┘
│ phaseOrder       │           │
└──────────────────┘           ▼
                      ┌──────────────────────┐
                      │   ROUND_CRITERIA     │
                      │ roundCriteriaId (PK) │
                      │ roundId (FK)         │
                      │ criterionId (FK)     │
                      │ weight/percentage    │
                      └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ EVALUATION_CRITERIA  │
                    │ criterionId (PK)     │
                    │ criterionName        │
                    │ description          │
                    │ defaultWeight        │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────────┐
                    │   ASSESSMENT_RESULT      │
                    │ resultId (PK)            │
                    │ assignmentId (FK)        │
                    │ roundId (FK)             │
                    │ studentId (FK)           │
                    │ mentorId (FK)            │
                    │ roundCriteriaId (FK)     │
                    │ score (float)            │
                    │ comments                 │
                    │ evaluationDate           │
                    └──────────────────────────┘
```

### Entities Chi Tiết

| Entity | Mô tả | Trường Chính |
|--------|-------|-------------|
| **User** | Người dùng hệ thống | userId, username, password, email, role, isActive |
| **Student** | Sinh viên | studentId, userId (FK) |
| **Mentor** | Cố vấn/Hướng dẫn viên | mentorId, userId (FK), department |
| **InternshipPhase** | Giai đoạn thực tập | phaseId, phaseName, startDate, endDate, phaseOrder |
| **InternshipAssignment** | Phân công thực tập | assignmentId, studentId (FK), mentorId (FK), phaseId (FK), status |
| **AssessmentRound** | Vòng đánh giá | roundId, roundName, startDate, endDate |
| **EvaluationCriteria** | Tiêu chí đánh giá | criterionId, criterionName, description, defaultWeight |
| **RoundCriteria** | Liên kết Round & Criteria | roundCriteriaId, roundId (FK), criterionId (FK), weight |
| **AssessmentResult** | Kết quả đánh giá | resultId, assignmentId (FK), roundId (FK), score, comments |

---

## 🔌 API Endpoints

### Base URL
- **Local**: `http://localhost:8080/api/v1`
- **Production**: cấu hình qua biến môi trường `VITE_API_BASE_URL` ở Frontend, trỏ đến IP/Domain của DigitalOcean Droplet (ví dụ: `http://<droplet-ip>:8080/api/v1`).

> Ghi chú: một số API làm việc với file upload/download (`multipart/form-data`, Excel, ZIP, avatar) nên frontend cần gửi đúng `Content-Type` tương ứng.

### 🔐 Authentication Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/auth/login` | Đăng nhập (nhận access token + refresh token) | ❌ |
| `POST` | `/auth/refresh` | Làm mới access token bằng refresh token cookie | ❌ |
| `POST` | `/auth/logout` | Đăng xuất (blacklist token, xóa refresh cookie) | ✅ |
| `GET` | `/auth/me` | Lấy thông tin người dùng hiện tại | ✅ |
| `POST` | `/auth/forgot-password` | Gửi email đặt lại mật khẩu | ❌ |
| `POST` | `/auth/reset-password` | Đặt lại mật khẩu bằng token | ❌ |

### 🧾 User Profile Utilities

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/users/change-password` | Đổi mật khẩu tài khoản hiện tại | ✅ | ADMIN, MENTOR, STUDENT |
| `PUT` | `/users/{userId}/avatar` | Upload ảnh đại diện người dùng | ✅ | ADMIN, MENTOR, STUDENT |

### 👥 User Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `GET` | `/users/profiles` | Lấy danh sách người dùng (phân trang) | ✅ | ADMIN |
| `POST` | `/users` | Tạo người dùng mới | ✅ | ADMIN |
| `GET` | `/users/{userId}` | Lấy thông tin người dùng | ✅ | - |
| `PUT` | `/users/{userId}` | Cập nhật thông tin người dùng | ✅ | - |
| `PUT` | `/users/{userId}/status` | Cập nhật trạng thái người dùng | ✅ | ADMIN |
| `PUT` | `/users/{userId}/role` | Cập nhật vai trò người dùng | ✅ | ADMIN |
| `DELETE` | `/users/{userId}` | Xóa người dùng | ✅ | ADMIN |

### 🎓 Student Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/students` | Tạo sinh viên mới | ✅ | ADMIN |
| `GET` | `/students` | Lấy danh sách sinh viên | ✅ | ADMIN, MENTOR |
| `GET` | `/students/me` | Lấy thông tin sinh viên hiện tại | ✅ | STUDENT |
| `GET` | `/students/{studentId}` | Lấy thông tin sinh viên | ✅ | - |
| `PUT` | `/students/{studentId}` | Cập nhật thông tin sinh viên | ✅ | ADMIN, STUDENT |

### 🧑‍🏫 Mentor Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `GET` | `/mentors` | Lấy danh sách cố vấn | ✅ | ADMIN, STUDENT |
| `GET` | `/mentors/{mentorId}` | Lấy thông tin cố vấn | ✅ | - |
| `POST` | `/mentors` | Tạo cố vấn mới | ✅ | ADMIN |
| `PUT` | `/mentors/{mentorId}` | Cập nhật thông tin cố vấn | ✅ | ADMIN, MENTOR |
| `GET` | `/mentors/info` | Lấy thông tin cố vấn hiện tại | ✅ | MENTOR |

### 📋 Internship Phase Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/internship-phases` | Tạo giai đoạn thực tập | ✅ | ADMIN |
| `GET` | `/internship-phases` | Lấy danh sách giai đoạn | ✅ | - |
| `GET` | `/internship-phases/{phaseId}` | Lấy thông tin giai đoạn | ✅ | - |
| `PUT` | `/internship-phases/{phaseId}` | Cập nhật giai đoạn | ✅ | ADMIN |
| `DELETE` | `/internship-phases/{phaseId}` | Xóa giai đoạn | ✅ | ADMIN |

### 📄 Internship Assignment Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/internship-assignments` | Tạo phân công thực tập | ✅ | ADMIN |
| `GET` | `/internship-assignments` | Lấy danh sách phân công | ✅ | - |
| `GET` | `/internship-assignments/{assignmentId}` | Lấy thông tin phân công | ✅ | - |
| `PUT` | `/internship-assignments/{assignmentId}/status` | Cập nhật trạng thái phân công | ✅ | ADMIN |

### 📊 Dashboard Statistics

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `GET` | `/dashboards/stats` | Thống kê tổng quan hệ thống | ✅ | ADMIN |
| `GET` | `/dashboards/mentor-stats` | Thống kê cá nhân cho mentor | ✅ | MENTOR |

### ⭐ Assessment Round Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/assessment-rounds` | Tạo vòng đánh giá | ✅ | ADMIN |
| `GET` | `/assessment-rounds` | Lấy danh sách vòng đánh giá | ✅ | - |
| `GET` | `/assessment-rounds/{roundId}` | Lấy thông tin vòng đánh giá | ✅ | - |
| `PUT` | `/assessment-rounds/{roundId}` | Cập nhật vòng đánh giá | ✅ | ADMIN |
| `DELETE` | `/assessment-rounds/{roundId}` | Xóa vòng đánh giá | ✅ | ADMIN |

### 🎯 Evaluation Criteria Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/evaluation-criterias` | Tạo tiêu chí đánh giá | ✅ | ADMIN |
| `GET` | `/evaluation-criterias` | Lấy danh sách tiêu chí | ✅ | - |
| `GET` | `/evaluation-criterias/{criteriaId}` | Lấy thông tin tiêu chí | ✅ | - |
| `PUT` | `/evaluation-criterias/{criteriaId}` | Cập nhật tiêu chí | ✅ | ADMIN |
| `DELETE` | `/evaluation-criterias/{criteriaId}` | Xóa tiêu chí | ✅ | ADMIN |

### 🔗 Round Criteria Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `GET` | `/round-criterias` | Lấy tiêu chí trong vòng đánh giá | ✅ | - |
| `GET` | `/round-criterias/{roundCriteriaId}` | Lấy thông tin liên kết | ✅ | - |
| `POST` | `/round-criterias` | Tạo liên kết Round-Criteria | ✅ | ADMIN |
| `PUT` | `/round-criterias/{roundCriteriaId}` | Cập nhật trọng số tiêu chí | ✅ | ADMIN |
| `DELETE` | `/round-criterias/{roundCriteriaId}` | Xóa liên kết | ✅ | ADMIN |

### 📊 Assessment Result Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/assessment-results` | Tạo kết quả đánh giá | ✅ | MENTOR |
| `GET` | `/assessment-results` | Lấy danh sách kết quả đánh giá | ✅ | - |
| `GET` | `/assessment-results/{resultId}` | Lấy thông tin kết quả | ✅ | - |
| `PUT` | `/assessment-results/{resultId}` | Cập nhật kết quả đánh giá | ✅ | MENTOR |
| `POST` | `/assessment-results/bulk` | Lưu điểm hàng loạt cho một nhóm/sinh viên | ✅ | MENTOR |

### 📑 Report Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `POST` | `/reports/upload` | Upload báo cáo sinh viên (`multipart/form-data`) | ✅ | STUDENT |
| `GET` | `/reports` | Lấy danh sách báo cáo (phân trang, có search) | ✅ | ADMIN, MENTOR |
| `GET` | `/reports/download/{reportId}` | Chuyển hướng đến URL tải file báo cáo | ✅ | - |
| `GET` | `/reports/my-reports` | Lấy danh sách báo cáo của sinh viên hiện tại | ✅ | STUDENT |
| `GET` | `/reports/export-excel` | Xuất danh sách báo cáo ra Excel | ✅ | ADMIN, MENTOR |
| `GET` | `/reports/export-zip` | Xuất toàn bộ file báo cáo ra ZIP | ✅ | ADMIN, MENTOR |
| `PUT` | `/reports/{reportId}/grade` | Chấm điểm & phản hồi cho báo cáo | ✅ | MENTOR |

### 🔔 Notification Management

| Method | Endpoint | Mô tả | Auth | Role |
|--------|----------|-------|------|------|
| `GET` | `/notifications/my-notifications` | Lấy danh sách thông báo của tôi | ✅ | - |
| `PUT` | `/notifications/{id}/read` | Đánh dấu một thông báo là đã đọc | ✅ | - |
| `PUT` | `/notifications/mark-all-as-read` | Đánh dấu toàn bộ thông báo là đã đọc | ✅ | - |

---

## ✨ Các Tính Năng Chính

### 1️⃣ Quản Lý Người Dùng
- ✅ Đăng ký tài khoản (STUDENT, MENTOR, ADMIN)
- ✅ Đăng nhập/Đăng xuất an toàn
- ✅ Quên mật khẩu & đặt lại mật khẩu qua email
- ✅ Quản lý thông tin cá nhân, đổi mật khẩu, cập nhật avatar
- ✅ Cấp quyền dựa trên vai trò

### 2️⃣ Quản Lý Sinh Viên
- ✅ Xem hồ sơ sinh viên
- ✅ Theo dõi tiến độ thực tập
- ✅ Quản lý thông tin cá nhân
- ✅ Lịch sử phân công

### 3️⃣ Quản Lý Cố Vấn
- ✅ Danh sách cố vấn
- ✅ Thông tin chi tiết
- ✅ Quản lý sinh viên được giao
- ✅ Lịch sử hướng dẫn

### 4️⃣ Quản Lý Phân Công
- ✅ Tạo phân công thực tập
- ✅ Gán sinh viên + cố vấn + giai đoạn
- ✅ Theo dõi trạng thái (NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELLED)
- ✅ Cập nhật và xóa phân công
- ✅ Xem chi tiết phân công, chọn vòng đánh giá, chọn tiêu chí và nhập điểm theo nhóm

### 5️⃣ Quản Lý Giai Đoạn Thực Tập
- ✅ Định nghĩa giai đoạn (ví dụ: Giai đoạn 1, 2, 3)
- ✅ Thiết lập thời gian cho từng giai đoạn
- ✅ Xác định trình tự giai đoạn
- ✅ Quản lý khoảng thời gian

### 6️⃣ Đánh Giá & Chấm Điểm
- ✅ Tạo vòng đánh giá
- ✅ Định nghĩa tiêu chí đánh giá
- ✅ Gán trọng số cho tiêu chí
- ✅ Nhập điểm và nhận xét
- ✅ Tính toán điểm trung bình
- ✅ Chấm điểm hàng loạt cho toàn bộ sinh viên trong một assignment

### 7️⃣ Quản Lý Báo Cáo
- ✅ Sinh viên upload báo cáo theo file
- ✅ Mentor/Admin tìm kiếm, xem danh sách và tải báo cáo
- ✅ Xuất dữ liệu ra Excel hoặc ZIP
- ✅ Chấm điểm báo cáo và gửi thông báo cho sinh viên

### 8️⃣ Thông Báo & Email
- ✅ Gửi email qua RabbitMQ (bất đồng bộ)
- ✅ Email đặt lại mật khẩu kèm link token
- ✅ Thông báo phân công thực tập
- ✅ Danh sách thông báo cá nhân, badge số chưa đọc, đánh dấu đã đọc từng cái hoặc tất cả

### 9️⃣ Dashboard & Tài Khoản Cá Nhân
- ✅ Dashboard tự động đổi theo vai trò Admin / Mentor / Student
- ✅ Trang cài đặt hồ sơ cá nhân riêng biệt
- ✅ Cập nhật ảnh đại diện và đổi mật khẩu ngay trên UI

### 10️⃣ Xuất Báo Cáo
- ✅ Xuất danh sách kết quả đánh giá và báo cáo ra file Excel
- ✅ Xuất toàn bộ file báo cáo thành ZIP
- ✅ Sử dụng Apache POI

---

## 🖥️ Frontend Routes & Pages

### Route chính
- `/` — Landing page
- `/login`, `/register` — Đăng nhập / đăng ký
- `/forgot-password`, `/reset-password` — Quên và đặt lại mật khẩu
- `/dashboard` — Dashboard theo vai trò, tự chuyển sang Admin / Mentor / Student
- `/settings` — Cập nhật hồ sơ, avatar và mật khẩu

### Trang quản lý & nghiệp vụ
- `/management/users`
- `/management/students`
- `/management/mentors`
- `/management/phases`
- `/management/assignments`
- `/management/reports`
- `/management/evaluation-criteria`
- `/management/assessment-rounds`
- `/management/assessment-results`

### Trang chi tiết & tác vụ đặc biệt
- `/assignments/:id` — Xem chi tiết phân công, load round/criteria và chấm điểm theo nhóm
- `/my-mentor` — Sinh viên xem mentor đang phụ trách
- `/my-students` — Mentor xem sinh viên được giao
- `/submit-report` — Sinh viên nộp báo cáo
- `/admin/assessment-rounds/:id` — Chi tiết vòng đánh giá
- `/admin/assessment-results/:id` — Chi tiết kết quả đánh giá

### Hành vi UI đáng chú ý
- Notification bell hiển thị số chưa đọc và tự refresh định kỳ
- Nếu hồ sơ chưa đầy đủ, người dùng không phải admin sẽ được chuyển về `/settings`

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- **Java 17+** (cho Backend chạy local không qua Docker)
- **Node.js 18+** (cho Frontend)
- **Docker & Docker Compose** (khuyến nghị — đã đóng gói đầy đủ Postgres, Redis, RabbitMQ, Backend)

### Bước 1: Clone Dự Án

```bash
git clone https://github.com/trung1609/Intership-Management-System.git
cd Intership-Management-System
```

### Bước 2: Cấu Hình Biến Môi Trường

Tạo file `.env` trong thư mục `Backend/` để cung cấp các secret cho Docker Compose:

```bash
# Backend/.env
SENDGRID_API_KEY=your-sendgrid-api-key
JWT_SECRET=your-super-secret-jwt-key
```

> ⚠️ File `.env` đã được thêm vào `.gitignore`, **không commit** secret lên Git.

### Bước 3: Khởi Động Toàn Bộ Stack Bằng Docker Compose

```bash
cd Backend

# Build & khởi động toàn bộ services (Postgres, Redis, RabbitMQ, Backend)
docker-compose up -d --build

# Kiểm tra trạng thái container
docker-compose ps

# Xem log của backend
docker-compose logs -f backend
```

Các service sẽ chạy với cấu hình:

| Service     | Container          | Port nội bộ |
|-------------|--------------------|-------------|
| PostgreSQL  | `postgres_server`  | 5432        |
| Redis       | `redis_server`     | 6379        |
| RabbitMQ    | `rabbitmq_server`  | 5672 / 15672 (management UI) |
| Backend     | `spring_backend`   | 8080        |

### Bước 4: Cài Đặt Frontend

```bash
cd Frontend

# Cài dependencies
npm install
```

Cấu hình API endpoint trong file `.env` của Frontend:

```bash
# Frontend/.env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Khi deploy production, thay bằng URL của Backend trên DigitalOcean Droplet.

---

## 🏃 Hướng Dẫn Chạy Dự Án

### 🐳 Chạy Backend Bằng Docker (Khuyến Nghị)

```bash
cd Backend
docker-compose up -d --build
```

ℹ️ Backend sẽ khởi động tại: **http://localhost:8080**

### 🔧 Chạy Backend Bằng Gradle (Dev Mode)

```bash
cd Backend

./gradlew.bat bootRun    # Windows
./gradlew bootRun        # Linux/Mac
```

> Lưu ý: Chế độ này yêu cầu bạn tự khởi động Postgres, Redis, RabbitMQ (có thể chạy riêng từng container).

### 🎨 Chạy Frontend

```bash
cd Frontend

# Dev server (hot reload)
npm run dev
```

ℹ️ Frontend sẽ khởi động tại: **http://localhost:5173**

### 📦 Build Production

#### Backend (Docker image)
```bash
cd Backend
docker-compose build backend
```

#### Frontend
```bash
cd Frontend
npm run build
npm run preview
```

### 🧪 Chạy Tests

```bash
cd Backend
./gradlew.bat test     # Windows
./gradlew test         # Linux/Mac
```

### 🛑 Dừng Dịch Vụ Docker

```bash
cd Backend

docker-compose down        # Dừng container
docker-compose down -v     # Dừng và xóa data (cẩn thận - sẽ mất dữ liệu Postgres)
```

---

## ☁️ Deploy Lên DigitalOcean

Dự án được deploy production lên **DigitalOcean Droplet** thông qua Docker Compose. Toàn bộ stack (Postgres, Redis, RabbitMQ, Spring Backend) chạy trên cùng một Droplet, Frontend host trên GitHub Pages.

### 🌐 Live URLs

- **Frontend**: [https://trung1609.github.io/Internship-Management-System/](https://trung1609.github.io/Internship-Management-System/)
- **Backend API**: chạy trên DigitalOcean Droplet (port 8080)

### Bước 1: Tạo Droplet

1. Đăng nhập [DigitalOcean](https://cloud.digitalocean.com/)
2. **Create → Droplets**
3. Chọn image: **Ubuntu 22.04 LTS**
4. Plan: **Basic / Regular** (tối thiểu 2GB RAM cho stack đầy đủ)
5. Region: chọn gần người dùng (Singapore khuyến nghị)
6. Authentication: **SSH Key** (khuyến nghị) hoặc Password

### Bước 2: Cài Đặt Docker Trên Droplet

```bash
ssh root@<your-droplet-ip>

# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com | sh

# Cài Docker Compose plugin
apt install -y docker-compose-plugin

# Kiểm tra
docker --version
docker compose version
```

### Bước 3: Clone & Cấu Hình Dự Án Trên Droplet

```bash
cd /opt
git clone https://github.com/trung1609/Intership-Management-System.git
cd Intership-Management-System/Backend

# Tạo file .env chứa secret
cat > .env <<EOF
SENDGRID_API_KEY=your-sendgrid-api-key
JWT_SECRET=your-super-secret-jwt-key
EOF
```

### Bước 4: Khởi Động Stack

```bash
docker compose up -d --build

# Kiểm tra
docker compose ps
docker compose logs -f backend
```

### Bước 5: Mở Firewall

```bash
ufw allow 22/tcp        # SSH
ufw allow 8080/tcp      # Backend API
ufw allow 15672/tcp     # RabbitMQ management UI (tuỳ chọn)
ufw enable
```

### Bước 6: Cấu Hình CORS & Frontend

1. Trong Backend, đảm bảo CORS cho phép domain GitHub Pages: `https://trung1609.github.io`
2. Trong Frontend, build với biến môi trường trỏ về Droplet:
   ```bash
   VITE_API_BASE_URL=http://<droplet-ip>:8080/api/v1 npm run build
   ```
3. Deploy thư mục `dist/` lên GitHub Pages.

### Bước 7: Cập Nhật Code (Sau Khi Push Lên Repo)

```bash
cd /opt/Intership-Management-System
git pull
cd Backend
docker compose up -d --build
```

### 💡 Khuyến Nghị Production

- 🔒 Cài **Nginx + Let's Encrypt SSL** để có HTTPS cho Backend (tránh mixed-content khi gọi từ GitHub Pages).
- 🗄️ Backup volume `pgdata` định kỳ: `docker run --rm -v backend_pgdata:/data -v $(pwd):/backup alpine tar czf /backup/pg-$(date +%F).tar.gz /data`
- 📊 Monitor tài nguyên bằng `docker stats` hoặc DigitalOcean Monitoring.
- 🚫 Không expose port Postgres (5432) ra ngoài Droplet.

---

## 🔐 Xác Thực & Phân Quyền

### Vai Trò (Roles)

| Vai trò | Các quyền |
|---------|-----------|
| **ROLE_ADMIN** | Quản lý toàn bộ hệ thống, tạo/sửa/xóa người dùng, phân công, vòng đánh giá |
| **ROLE_MENTOR** | Đánh giá sinh viên, xem danh sách sinh viên được giao, cập nhật kết quả |
| **ROLE_STUDENT** | Xem thông tin cá nhân, xem phân công, xem danh sách cố vấn |

### JWT Token Strategy

#### Access Token
- 📍 **Lưu trữ**: Local Storage (frontend)
- ⏱️ **Thời hạn**: 24 giờ (tuỳ cấu hình)
- 🔐 **Định dạng**: `Authorization: Bearer <accessToken>`
- 📤 **Gửi qua**: Authorization header trong mỗi request

#### Refresh Token
- 📍 **Lưu trữ**: HttpOnly Cookie (an toàn hơn, chống XSS)
- ⏱️ **Thời hạn**: 7 ngày (tuỳ cấu hình)
- 🔒 **Flags**: `httpOnly=true`, `secure=true`, `sameSite=Lax`
- 📤 **Gửi qua**: Tự động kèm mỗi request

### Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                     LOGIN PROCESS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. POST /api/v1/auth/login                                  │
│    Request: { username, password }                          │
│                                                             │
│ 2. Backend validates credentials                            │
│                                                             │
│ 3. Response:                                                │
│    ├─ Status: 200 OK                                        │
│    ├─ Body: { accessToken, refreshToken }                   │
│    ├─ LocalStorage: accessToken (frontend)                  │
│    └─ Cookie: Set-Cookie refreshToken (HttpOnly)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATED REQUEST                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Frontend gửi accessToken trong Authorization header      │
│    GET /api/v1/users/profiles                               │
│    Header: Authorization: Bearer <accessToken>              │
│    Cookie: refreshToken=... (automatic)                     │
│                                                             │
│ 2. Backend validates token:                                 │
│    Token valid    → Process request                         │
│    Token expired  → Return 401 → Frontend refresh token     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               REFRESH TOKEN PROCESS                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Access token expires (401 response)                      │
│                                                             │
│ 2. POST /api/v1/auth/refresh                                │
│    Cookie: refreshToken=... (automatic)                     │
│                                                             │
│ 3. Backend validates refresh token                          │
│                                                             │
│ 4. Response:                                                │
│    ├─ New accessToken                                       │
│    ├─ New refreshToken                                      │
│    └─ Updated HttpOnly cookie                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               FORGOT PASSWORD PROCESS                       │
├─────────────────────────────────────────────────────────────┤
│ 1. POST /api/v1/auth/forgot-password                        │
│    Request: { email }                                       │
│                                                             │
│ 2. Backend tạo reset token, lưu Redis                       │
│    Gửi email qua RabbitMQ (bất đồng bộ)                    │
│                                                             │
│ 3. POST /api/v1/auth/reset-password                         │
│    Request: { token, newPassword, confirmPassword }         │
│                                                             │
│ 4. Backend xác thực token, cập nhật mật khẩu               │
│    Token bị xóa khỏi Redis sau khi dùng                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOGOUT PROCESS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. POST /api/v1/auth/logout                                 │
│    Header: Authorization: Bearer <accessToken>              │
│    Cookie: refreshToken=... (automatic)                     │
│                                                             │
│ 2. Backend:                                                 │
│    ├─ Add accessToken to blacklist (Redis)                  │
│    ├─ Set TTL = thời gian còn lại của token                 │
│    └─ Clear refreshToken cookie (maxAge=0)                  │
│                                                             │
│ 3. Frontend:                                                │
│    ├─ Clear accessToken từ local storage                    │
│    └─ Redirect to login                                     │
└─────────────────────────────────────────────────────────────┘
```

### Token Blacklist (Redis)

- ✅ AccessToken bị blacklist khi logout
- ✅ RefreshToken cũng bị xóa khỏi Redis
- ✅ TTL tự động = thời gian còn lại của token
- ✅ Redis tự động cleanup khi token hết hạn
- ✅ Token không thể tái sử dụng sau khi logout

---

## 📝 Ghi Chú Quan Trọng

### Security Best Practices

1. **JWT Secret Key**: Thay đổi trong `application.yml`
   ```yaml
   jwt_secret: your-super-secret-key-here
   jwt_expire: 86400000  # 24 hours in ms
   ```

2. **Gmail App Password**: Sử dụng App Password thay vì password tài khoản
   - Bật 2-Step Verification trên Google Account
   - Tạo App Password tại [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

3. **CORS Configuration**: Cấu hình frontend URLs
   - Frontend dev: `http://localhost:5173`
   - Frontend prod: `https://trung1609.github.io`

4. **Docker Secrets**: Production trên DigitalOcean dùng file `.env` để inject biến môi trường (SENDGRID_API_KEY, JWT_SECRET, DB password) vào container — **không hardcode** trong `docker-compose.yml`.

### Performance Tips

1. **Frontend**: Implement request caching với Axios interceptors
2. **Backend**: Sử dụng pagination cho các danh sách lớn
3. **Database**: Index trên các foreign keys
4. **Redis**: Monitor memory usage
5. **RabbitMQ**: Monitor queue depth để tránh backlog email

### Error Handling

| HTTP Status | Ý nghĩa |
|-------------|---------|
| **400** Bad Request | Dữ liệu đầu vào không hợp lệ |
| **401** Unauthorized | Token hết hạn hoặc không hợp lệ |
| **403** Forbidden | Không có quyền truy cập |
| **404** Not Found | Tài nguyên không tìm thấy |
| **409** Conflict | Xung đột dữ liệu (username trùng, v.v.) |
| **500** Internal Server Error | Lỗi server |

### Logging

Backend logging cấu hình tại `application.yml`:
```yaml
logging:
  level:
    com.trung: DEBUG      # Application logs
    root: INFO            # Spring logs
```

---

## 📞 Liên Hệ

- **Người phát triển**: Vũ Minh Trung
- **Github**: [trung1609](https://github.com/trung1609)
- **Email**: trung8d2005@gmail.com
