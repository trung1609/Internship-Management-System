# 🎓 Intership Management System

Một hệ thống quản lý thực tập toàn diện, xây dựng bằng **Spring Boot** (Backend) và **React + Vite** (Frontend), giúp quản lý toàn bộ quy trình thực tập từ giai đoạn phân công, đánh giá cho đến quản lý kết quả.

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
9. [Xác thực & Phân quyền](#-xác-thực--phân-quyền)
10. [Ghi chú quan trọng](#-ghi-chú-quan-trọng)

---

## 🎯 Tổng Quan

**Intership Management System** là nền tảng quản lý thực tập toàn diện cho các trường đại học, giúp:
- ✅ Quản lý thông tin sinh viên, cố vấn, và người dùng
- ✅ Phân công sinh viên cho các vị trí thực tập
- ✅ Định nghĩa các giai đoạn thực tập với thời gian cụ thể
- ✅ Đánh giá sinh viên dựa trên tiêu chí có trọng số
- ✅ Lưu trữ và báo cáo kết quả đánh giá
- ✅ Xác thực an toàn với JWT token
- ✅ Phân quyền dựa trên vai trò (Role-based Access Control)

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
| **PostgreSQL** | 16+ | Cơ sở dữ liệu chính |
| **Redis** | 7+ | Token blacklist, caching |
| **Hibernate** | - | JPA Implementation |
| **JWT (JJWT)** | 0.11.5 | Xác thực token |
| **Lombok** | - | Giảm boilerplate code |
| **Java** | 17 | Ngôn ngữ lập trình |
| **Gradle** | 8.x | Build tool |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| **React** | 19.2.6 | UI Framework |
| **Vite** | 8.0.12 | Build tool & dev server |
| **Material-UI (MUI)** | 9.0.1 | Component library |
| **React Router DOM** | 7.15.1 | Routing |
| **Axios** | 1.16.1 | HTTP client |
| **React Hook Form** | 7.76.0 | Form management |
| **React Toastify** | 11.1.0 | Notifications |

---

## 📁 Cấu Trúc Dự Án

```
Intership-Management-System/
│
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/trung/
│   │   │   │   ├── controller/              # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── StudentController.java
│   │   │   │   │   ├── MentorController.java
│   │   │   │   │   ├── InternshipAssignmentController.java
│   │   │   │   │   ├── InternshipPhaseController.java
│   │   │   │   │   ├── AssessmentRoundsController.java
│   │   │   │   │   ├── EvaluationCriteriaController.java
│   │   │   │   │   ├── RoundCriteriaController.java
│   │   │   │   │   └── AssessmentResultController.java
│   │   │   │   ├── service/                 # Business Logic Layer
│   │   │   │   ├── repository/              # Data Access Layer (JPA)
│   │   │   │   ├── entity/                  # JPA Entities / Domain Models
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/             # Request DTOs
│   │   │   │   │   └── response/            # Response DTOs
│   │   │   │   ├── mapper/                  # Entity <-> DTO Mapping
│   │   │   │   ├── security/                # Security Configuration
│   │   │   │   ├── validation/              # Custom Validators
│   │   │   │   ├── exception/               # Custom Exceptions
│   │   │   │   ├── util/                    # Utility Classes
│   │   │   │   └── IntershipManagementSystemApplication.java # Main App
│   │   │   └── resources/
│   │   │       └── application.yml          # Configuration
│   │   └── test/
│   │
│   ├── gradle/                              # Gradle Wrapper
│   ├── build.gradle                         # Gradle dependencies
│   ├── settings.gradle
│   ├── docker-compose.yml                   # Docker configuration
│   └── README.md
│
├── Frontend/
│   ├── src/
│   │   ├── api/                             # API Client
│   │   │   ├── authApi.js
│   │   │   ├── resourceApi.js               # REST API endpoints
│   │   │   └── axiosClient.js
│   │   ├── components/                      # Reusable Components
│   │   │   ├── AppLayout.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/                         # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                           # Page Components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MainDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── MentorDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── management/                  # Management Pages
│   │   │   │   ├── UsersManagement.jsx
│   │   │   │   ├── StudentsManagement.jsx
│   │   │   │   ├── MentorsManagement.jsx
│   │   │   │   ├── InternshipPhasesManagement.jsx
│   │   │   │   ├── InternshipAssignmentsManagement.jsx
│   │   │   │   ├── AssessmentRoundsManagement.jsx
│   │   │   │   ├── EvaluationCriteriaManagement.jsx
│   │   │   │   ├── AssessmentResultsManagement.jsx
│   │   │   │   ├── AssessmentRoundDetail.jsx
│   │   │   │   └── AssessmentResultDetail.jsx
│   │   │   └── ...
│   │   ├── assets/                          # Static assets
│   │   ├── App.jsx                          # Main App Component
│   │   ├── main.jsx                         # Entry Point
│   │   ├── index.css                        # Global Styles
│   │   └── App.css
│   ├── public/                              # Static files
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
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
         │                    │                    │
         ├─────────────────┬──┴──────────┬────────────────────┐
         ▼                 ▼             ▼                    ▼
    ┌────────────┐  ┌─────────┐  ┌──────────┐   ┌─────────────────┐
    │  STUDENT   │  │ MENTOR  │  │ADMIN     │   │  (Other Roles)  │
    │ (User Role)│  │(User Ro)│  │(User Ro) │   │                 │
    │ studentId  │  │ mentorId│  │ adminId  │   │                 │
    │ userId (FK)│  │userId(F)│  │ userId(F)│   │                 │
    └────────────┘  └─────────┘  └──────────┘   └─────────────────┘
         │                │
         └────────────────┴──────────────────────┐
                                                  │
                                      ┌──────────────────────────┐
                                      │INTERNSHIP_ASSIGNMENT     │
                                      │ assignmentId (PK)        │
                                      │ studentId (FK) ─────────►│ STUDENT
                                      │ mentorId (FK) ────────►│ MENTOR
                                      │ phaseId (FK) ───────────┐
                                      │ status                  │
                                      │ startDate, endDate      │
                                      │ createdAt, updatedAt    │
                                      └──────────────────────────┘
                                                  │
                                                  ├──────────┐
                                                  ▼          ▼
                                      ┌──────────────────┐  ┌──────────────────────┐
                                      │INTERNSHIP_PHASE  │  │ASSESSMENT_ROUND      │
                                      │ phaseId (PK)     │  │ roundId (PK)         │
                                      │ phaseName        │  │ roundName            │
                                      │ description      │  │ description          │
                                      │ startDate        │  │ startDate, endDate   │
                                      │ endDate          │  │ createdAt, updatedAt │
                                      │ phaseOrder       │  └──────────────────────┘
                                      │ createdAt        │           │
                                      │ updatedAt        │           ▼
                                      └──────────────────┘  ┌──────────────────────┐
                                                            │ROUND_CRITERIA        │
                                                            │ roundCriteriaId (PK) │
                                                            │ roundId (FK)         │
                                                            │ criterionId (FK)     │
                                               ┌────────────│ weight/percentage    │
                                               │            │ createdAt, updatedAt │
                                               │            └──────────────────────┘
                                               │                     │
                                               │                     │
                                    ┌──────────┴────────────────────┤
                                    ▼                               │
                        ┌──────────────────────┐                   │
                        │EVALUATION_CRITERIA   │                   │
                        │ criterionId (PK)     │◄──────────────────┘
                        │ criterionName        │
                        │ description          │
                        │ defaultWeight        │
                        │ createdAt, updatedAt │
                        └──────────────────────┘
                                    │
                                    │ (Multiple criteria per result)
                                    │
                                    ▼
                        ┌──────────────────────────┐
                        │ASSESSMENT_RESULT        │
                        │ resultId (PK)           │
                        │ assignmentId (FK)       │
                        │ roundId (FK)            │
                        │ studentId (FK)          │
                        │ mentorId (FK)           │
                        │ roundCriteriaId (FK)    │
                        │ score (float)           │
                        │ comments                │
                        │ evaluationDate          │
                        │ createdAt, updatedAt    │
                        └──────────────────────────┘
```

### Entities Chi Tiết

| Entity | Mô tả | Trường Chính |
|--------|-------|-------------|
| **User** | Người dùng hệ thống | userId, username, password, email, role, isActive |
| **Student** | Sinh viên | studentId, userId (FK), GVHD info |
| **Mentor** | Cố vấn/Hướng dẫn viên | mentorId, userId (FK), department |
| **InternshipPhase** | Giai đoạn thực tập | phaseId, phaseName, startDate, endDate, phaseOrder |
| **InternshipAssignment** | Phân công thực tập | assignmentId, studentId (FK), mentorId (FK), phaseId (FK), status |
| **AssessmentRound** | Vòng đánh giá | roundId, roundName, startDate, endDate |
| **EvaluationCriteria** | Tiêu chí đánh giá | criterionId, criterionName, description, defaultWeight |
| **RoundCriteria** | Liên kết Round & Criteria | roundCriteriaId, roundId (FK), criterionId (FK), weight |
| **AssessmentResult** | Kết quả đánh giá | resultId, assignmentId (FK), roundId (FK), score, comments |

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8080/api/v1`

### 🔐 Authentication Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới | ❌ |
| `POST` | `/auth/login` | Đăng nhập (nhận JWT token) | ❌ |
| `POST` | `/auth/refresh` | Làm mới access token | ❌ |
| `POST` | `/auth/logout` | Đăng xuất (blacklist token) | ✅ |
| `GET` | `/auth/me` | Lấy thông tin người dùng hiện tại | ✅ |

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

---

## ✨ Các Tính Năng Chính

### 1️⃣ Quản Lý Người Dùng
- ✅ Đăng ký tài khoản (STUDENT, MENTOR, ADMIN)
- ✅ Đăng nhập/Đăng xuất an toàn
- ✅ Quản lý thông tin cá nhân
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

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống

- **Java 17+** (cho Backend)
- **Node.js 16+** (cho Frontend)
- **PostgreSQL 16+** (Cơ sở dữ liệu)
- **Redis 7+** (Token management)
- **Docker & Docker Compose** (Tuỳ chọn)

### Bước 1: Clone/Tải Dự Án

```bash
cd Intership-Management-System
```

### Bước 2: Cài Đặt Backend

#### Phương Án A: Sử dụng Docker Compose (Khuyến Nghị)

```bash
cd Backend

# Khởi động Redis qua Docker Compose
docker-compose up -d

# Kiểm tra trạng thái
docker-compose ps
```

#### Phương Án B: Cài Đặt Manual

1. **Cài PostgreSQL**
   - Tải từ [postgresql.org](https://www.postgresql.org/download/)
   - Tạo database: `intership_management_system`

2. **Cài Redis**
   - Tải từ [redis.io](https://redis.io/download)
   - Chạy Redis server (default: port 6379)

3. **Cấu hình `application.yml`**
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/intership_management_system
       username: postgres
       password: your_password
     data:
       redis:
         host: localhost
         port: 6379
         password: your_redis_password
   ```

### Bước 3: Cài Đặt Frontend

```bash
cd Frontend

# Cài dependencies
npm install

# Hoặc sử dụng yarn
yarn install
```

---

## 🏃 Hướng Dẫn Chạy Dự Án

### 🔧 Chạy Backend

#### Phương Án 1: Gradle Wrapper
```bash
cd Backend
./gradlew.bat bootRun    # Windows
./gradlew bootRun        # Linux/Mac
```

#### Phương Án 2: Gradle
```bash
cd Backend
gradle bootRun
```

ℹ️ Backend sẽ khởi động tại: **http://localhost:8080**

### 🎨 Chạy Frontend

```bash
cd Frontend

# Dev server (hot reload)
npm run dev
```

ℹ️ Frontend sẽ khởi động tại: **http://localhost:5173**

### 📦 Build Production

#### Backend
```bash
cd Backend
./gradlew.bat build    # Windows
./gradlew build        # Linux/Mac
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

### 🛑 Dừng Dịch Vụ

```bash
cd Backend

# Dừng container
docker-compose down

# Hoặc dừng và xóa data
docker-compose down -v
```

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
- 🔒 **Flags**: `httpOnly=true`, `secure=true`, `sameSite=Strict`
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
│    │─ LocalStorage: accessToken (frontend)                  │
│    ├─ Cookie: Set-Cookie refreshToken (HttpOnly)            │
│    └─ Data: user info, roles                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATED REQUEST                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Frontend stores accessToken in memory                    │
│    (refreshToken stored in HttpOnly cookie)                 │
│                                                             │
│ 2. API request:                                             │
│    GET /api/v1/users/profiles                               │
│    Header: Authorization: Bearer <accessToken>              │
│    Cookie: refreshToken=... (automatic)                     │
│                                                             │
│ 3. Backend validates token & request                        │
│    Token valid → Process request                            │
│    Token expired → Check with refresh token                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               REFRESH TOKEN PROCESS                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Access token expires                                     │
│    (Frontend can detect 401 response)                       │
│                                                             │
│ 2. POST /api/v1/auth/refresh                                │
│    Cookie: refreshToken=... (automatic)                     │
│                                                             │
│ 3. Backend validates refresh token                          │
│                                                             │
│ 4. Response:                                                │
│    ├─ New accessToken                                       │
│    ├─ New refreshToken                                      │
│    └─ Updated cookie                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    LOGOUT PROCESS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. POST /api/v1/auth/logout                                 │
│    Header: Authorization: Bearer <accessToken>              │
│    Cookie: refreshToken=... (automatic)                     │
│                                                             │
│ 2. Backend:                                                 │
│    ├─ Extract tokens                                        │
│    ├─ Add to blacklist (Redis)                              │
│    ├─ Set TTL = token expiration                            │
│    └─ Clear refreshToken cookie                             │
│                                                             │
│ 3. Response:                                                │
│    ├─ Status: 200 OK                                        │
│    ├─ Message: "Logout successful"                          │
│    └─ Cookie: Set-Cookie refreshToken="" (maxAge=0)         │
│                                                             │
│ 4. Frontend:                                                │
│    ├─ Clear accessToken from local storage                  │
│    ├─ Redirect to login                                     │
│    └─ Browser auto-deletes HttpOnly cookie                  │
└─────────────────────────────────────────────────────────────┘
```

### Token Blacklist (Redis)

- ✅ AccessToken bị blacklist khi logout
- ✅ RefreshToken cũng bị xóa khỏi Redis
- ✅ TTL tự động = thời gian còn lại của token
- ✅ Redis tự động cleanup khi token hết hạn
- ✅ Token không thể tái sử dụng ngay lập tức

---

## 📝 Ghi Chú Quan Trọng

### Security Best Practices

1. **JWT Secret Key**: Thay đổi trong `application.yml`
   ```yaml
   jwt_secret: your-super-secret-key-here
   jwt_expire: 86400000  # 24 hours
   ```

2. **Database Password**: Không để password mặc định
   ```yaml
   spring:
     datasource:
       password: your-secure-password
   ```

3. **Redis Password**: Bảo vệ Redis instance
   ```yaml
   spring:
     data:
       redis:
         password: your-redis-password
   ```

4. **CORS Configuration**: Cấu hình frontend URLs
   - Frontend dev: `http://localhost:5173`
   - Frontend prod: `https://your-domain.com`

### Performance Tips

1. **Frontend**: Implement request caching
2. **Backend**: Use pagination for large datasets
3. **Database**: Index trên các foreign keys
4. **Redis**: Monitor memory usage

### Error Handling

- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **401 Unauthorized**: Token hết hạn hoặc không hợp lệ
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Tài nguyên không tìm thấy
- **409 Conflict**: Xung đột dữ liệu (username trùng, v.v.)
- **500 Internal Server Error**: Lỗi server

### Logging

Backend logging cấu hình tại `application.yml`:
```yaml
logging:
  level:
    com.trung: DEBUG      # Application logs
    root: INFO            # Spring logs
```

### Token Expired

- Access token hết hạn chỉ trong 24 giờ
- Refresh token hết hạn sau 7 ngày
- Logout xóa token ngay lập tức

---
## 📞 Liên Hệ
- **Người phát triển**: Vũ Minh Trung
- **Github**: [trung1609](https://github.com/trung1609)
- **Email**: trung8d2005@gmail.com

