# Intership Management System

## 📋 Mô Tả Dự Án

Intership Management System là một nền tảng quản lý thực tập toàn diện được xây dựng bằng Spring Boot. Hệ thống này giúp quản lý toàn bộ quy trình thực tập của sinh viên, từ giai đoạn phân công, đánh giá cho đến quản lý kết quả.

## 🎯 Tính Năng Chính

### 1. **Quản Lý Người Dùng (User Management)**
   - Đăng ký tài khoản (sinh viên, cố vấn, quản trị viên)
   - Đăng nhập/Đăng xuất
   - Quản lý thông tin cá nhân
   - Phân quyền dựa trên vai trò (Role-based Access Control)

### 2. **Quản Lý Sinh Viên (Student Management)**
   - Xem hồ sơ sinh viên
   - Theo dõi tiến độ thực tập
   - Quản lý thông tin cá nhân sinh viên

### 3. **Quản Lý Cố Vấn (Mentor Management)**
   - Quản lý danh sách cố vấn
   - Phân công cố vấn cho sinh viên
   - Theo dõi hoạt động hướng dẫn

### 4. **Quản Lý Phân Công Thực Tập (Intership Assignment)**
   - Phân công vị trí thực tập
   - Theo dõi trạng thái phân công (chưa bắt đầu, đang diễn ra, hoàn thành, hủy)
   - Quản lý chi tiết về từng phân công

### 5. **Quản Lý Giai Đoạn Thực Tập (Intership Phase)**
   - Định nghĩa các giai đoạn khác nhau của chương trình thực tập
   - Quản lý thời gian và tiến độ từng giai đoạn

### 6. **Đánh Giá & Chấm Điểm (Assessment & Evaluation)**
   - **Assessment Rounds**: Quản lý các vòng đánh giá
   - **Evaluation Criteria**: Định nghĩa các tiêu chí đánh giá
   - **Round Criteria**: Liên kết tiêu chí với các vòng đánh giá
   - **Assessment Result**: Lưu trữ kết quả đánh giá của sinh viên

## 🏗️ Kiến Trúc Hệ Thống

```
Intership-Management-System/
├── src/
│   ├── main/
│   │   ├── java/com/trung/
│   │   │   ├── controller/           # REST Controllers
│   │   │   ├── service/              # Business Logic
│   │   │   ├── repository/           # Data Access Layer
│   │   │   ├── domain/
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   └── enums/            # Enumerations
│   │   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── mapper/               # Entity-DTO Mapping
│   │   │   ├── security/             # Security Configuration
│   │   │   ├── validation/           # Custom Validators
│   │   │   ├── exception/            # Exception Handling
│   │   │   └── util/                 # Utility Classes
│   │   └── resources/
│   │       └── application.properties # Configuration
│   └── test/
└── gradle/                           # Gradle Wrapper
```

## 🗄️ Cơ Sở Dữ Liệu

### Các Bảng Chính (Entities)

1. **User** - Quản lý tài khoản người dùng
   - userId, username, password, fullName, email, phoneNumber, role, isActive, createdAt, updatedAt

2. **Student** - Thông tin chi tiết sinh viên
   - Liên kết với User, quản lý dữ liệu sinh viên

3. **Mentor** - Thông tin cố vấn
   - Liên kết với User, quản lý cố vấn

4. **InternshipAssignment** - Phân công thực tập
   - Liên kết Student, Mentor, InternshipPhase
   - Lưu trạng thái phân công

5. **InternshipPhase** - Giai đoạn thực tập
   - Mô tả, ngày bắt đầu, ngày kết thúc, thứ tự

6. **AssessmentRound** - Vòng đánh giá
   - Mô tả, ngày bắt đầu, ngày kết thúc

7. **EvaluationCriteria** - Tiêu chí đánh giá
   - Tên, mô tả, trọng số

8. **RoundCriteria** - Liên kết giữa AssessmentRound và EvaluationCriteria

9. **AssessmentResult** - Kết quả đánh giá
   - Liên kết Student, Mentor, RoundCriteria
   - Điểm số, nhận xét

## 🛠️ Công Nghệ Sử Dụng

### Framework & Libraries
- **Spring Boot 4.0.4**: Framework chính
- **Spring Data JPA**: ORM (Object-Relational Mapping)
- **Spring Security**: Xác thực & phân quyền
- **Spring Validation**: Kiểm tra dữ liệu
- **Spring Web MVC**: REST API

### Database
- **PostgreSQL**: Cơ sở dữ liệu chính
- **Hibernate**: JPA Implementation

### Authentication & Authorization
- **JWT (JSON Web Token)**: Xác thực không trạng thái
  - Library: JJWT (jjwt-api, jjwt-impl, jjwt-jackson)
  - Secret Key được cấu hình trong `application.properties`
  - Thời gian hết hạn: 24 giờ (86400000ms)

### Redis
- Lưu trữ danh sách token bị logout (blacklist)
  - Token vô hiệu hóa **ngay lập tức** sau logout
  - TTL tự động bằng thời gian còn lại của token
  - Tiết kiệm bộ nhớ và không cần quản lý thủ công
- Lưu Refresh Token 
    - Tự động xóa khi hết hạn hoặc logout

### Development Tools
- **Lombok**: Giảm boilerplate code
- **Spring Boot DevTools**: Reload tự động

### Caching & Data Store
- **Redis**: Token blacklist management
  - Lưu trữ token bị logout trong Redis
  - Auto cleanup với TTL

### Testing
- **JUnit Platform**: Nền tảng kiểm thử
- **Spring Boot Test**: Testing framework
- **Spring Security Test**: Test security
- **Spring Validation Test**: Test validation

### Build Tool
- **Gradle**: Build tool
- **Java 17**: Phiên bản Java

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu
- Java 17 trở lên
- PostgreSQL 12 trở lên
- Gradle 8.x (hoặc sử dụng gradlew)

### Bước Cài Đặt

#### 1. Clone hoặc tải mã nguồn
```bash
cd Intership-Management-System
```

#### 2. Cấu hình cơ sở dữ liệu PostgreSQL
```bash
# Kết nối đến PostgreSQL
psql -U postgres

# Tạo cơ sở dữ liệu
CREATE DATABASE intership_management_system;

# Thoát
\q
```

#### 3. Cấu hình `application.properties`
Chỉnh sửa file `src/main/resources/application.properties`:
```properties
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/your-postgres-database-name-here
spring.datasource.username=postgres
spring.datasource.password=your-postgres-password-here

# JWT Configuration
jwt_secret=your-secret-key-here
jwt_expire=your-token-expiration-time-here
```

#### 4. Chạy dự án
```bash
# Sử dụng Gradle Wrapper
./gradlew.bat bootRun

# Hoặc sử dụng Gradle
gradle bootRun
```

Ứng dụng sẽ khởi động tại `http://localhost:8080`

#### 5. Chạy Test
```bash
./gradlew.bat test

# hoặc
gradle test
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản
- `POST /api/v1/auth/login` - Đăng nhập (trả về accessToken, set refreshToken vào HttpOnly cookie)
- `POST /api/v1/auth/logout` - Đăng xuất (blacklist cả accessToken & refreshToken, xóa cookie)
- `POST /api/v1/auth/refresh` - Refresh access token bằng refreshToken từ cookie
- `GET /api/v1/auth/me` - Lấy thông tin cá nhân người dùng

### User Management
- `GET /api/users` - Lấy danh sách người dùng
- `GET /api/users/{userId}` - Lấy thông tin người dùng
- `PUT /api/users/{userId}` - Cập nhật thông tin người dùng
- `DELETE /api/users/{userId}` - Xóa người dùng

### Student Management
- `GET /api/students` - Danh sách sinh viên
- `GET /api/students/{studentId}` - Chi tiết sinh viên
- `PUT /api/students/{studentId}` - Cập nhật thông tin sinh viên

### Mentor Management
- `GET /api/mentors` - Danh sách cố vấn
- `GET /api/mentors/{mentorId}` - Chi tiết cố vấn
- `POST /api/mentors` - Thêm cố vấn

### Intership Assignment
- `GET /api/assignments` - Danh sách phân công
- `GET /api/assignments/{assignmentId}` - Chi tiết phân công
- `POST /api/assignments` - Tạo phân công mới
- `PUT /api/assignments/{assignmentId}` - Cập nhật phân công
- `DELETE /api/assignments/{assignmentId}` - Xóa phân công

### Assessment & Evaluation
- `GET /api/assessment-rounds` - Danh sách vòng đánh giá
- `GET /api/evaluation-criteria` - Danh sách tiêu chí đánh giá
- `GET /api/round-criteria` - Danh sách liên kết
- `GET /api/assessment-results` - Danh sách kết quả đánh giá
- `POST /api/assessment-results` - Thêm kết quả đánh giá

### Intership Phase
- `GET /api/internship-phases` - Danh sách giai đoạn
- `POST /api/internship-phases` - Tạo giai đoạn mới

## 🔐 Xác Thực & Phân Quyền

### Vai Trò (Roles)
- **ROLE_ADMIN** - Quản trị viên hệ thống
- **ROLE_MENTOR** - Cố vấn/Hướng dẫn viên
- **ROLE_STUDENT** - Sinh viên thực tập

### JWT Token Strategy
- **Access Token**: Lưu trong response body, dùng trong Authorization header
  - Thời hạn: 1 giờ (hoặc tuỳ cấu hình)
  - Format: `Authorization: Bearer <accessToken>`
  - Gửi qua mỗi request API

- **Refresh Token**: Lưu trong HttpOnly cookie (an toàn hơn)
  - Thời hạn: 7 ngày (hoặc tuỳ cấu hình)
  - Tự động gửi kèm mỗi request
  - Không thể access qua JavaScript (XSS protection)
  - Flags: `httpOnly=true`, `secure=true`, `sameSite=Strict`

### Token Lifecycle

```
1. LOGIN
   ├─ POST /api/v1/auth/login
   └─ Response:
      ├─ accessToken (JSON body)
      └─ refreshToken (HttpOnly cookie)

2. AUTHENTICATED REQUESTS
   ├─ Authorization: Bearer <accessToken>
   └─ Cookie: refreshToken=... (tự động)

3. ACCESS TOKEN EXPIRES
   ├─ POST /api/v1/auth/refresh
   └─ Response:
      ├─ New accessToken (JSON body)
      └─ New refreshToken (HttpOnly cookie)

4. LOGOUT
   ├─ POST /api/v1/auth/logout
   ├─ Blacklist cả accessToken & refreshToken trong Redis
   └─ Clear refreshToken cookie (maxAge=0)
```

### Token Blacklist (Redis)
- Cả accessToken và refreshToken bị blacklist khi logout
- TTL tự động = thời gian còn lại của token
- Token không thể tái sử dụng ngay lập tức
- Redis tự động cleanup khi TTL hết

## 📝 Validation

Hệ thống sử dụng Spring Validation để kiểm tra dữ liệu:
- Kiểm tra tính duy nhất của username
- Kiểm tra định dạng email
- Kiểm tra số điện thoại
- Kiểm tra các trường bắt buộc

## ⚠️ Exception Handling

Hệ thống cung cấp các exception tùy chỉnh:
- `ResourceNotFoundException` - Tài nguyên không tìm thấy (404)
- `ResourceBadRequestException` - Yêu cầu không hợp lệ (400)
- `ResourceConflictException` - Xung đột dữ liệu (409)
- `ResourceForbiddenException` - Truy cập bị từ chối (403)
- `InvalidCredentialsException` - Thông tin xác thực không hợp lệ
- `InvalidDateFormatException` - Định dạng ngày không hợp lệ

## 📦 Dependencies Chính

```gradle
// Spring Boot Starters
spring-boot-starter-data-jpa
spring-boot-starter-security
spring-boot-starter-validation
spring-boot-starter-webmvc
spring-boot-starter-data-redis

// Database
postgresql

// Caching
redis

// JWT
jjwt-api (0.11.5)
jjwt-impl (0.11.5)
jjwt-jackson (0.11.5)

// Utilities
lombok

// Development
spring-boot-devtools
```

## 🔄 Quy Trình Thực Tập

1. **Đăng Ký & Đăng Nhập**: Người dùng tạo tài khoản và đăng nhập vào hệ thống
2. **Phân Công**: Admin hoặc Mentor phân công sinh viên cho vị trí thực tập
3. **Giai Đoạn**: Xác định các giai đoạn thực tập (ví dụ: giai đoạn 1, giai đoạn 2, ...)
4. **Đánh Giá**: Mentor đánh giá sinh viên dựa trên các tiêu chí đã định sẵn
5. **Kết Quả**: Lưu trữ và báo cáo kết quả đánh giá

## 📊 Logging

Cấu hình logging tại `application.properties`:
- **Root Level**: INFO
- **Application Level (com.trung)**: DEBUG

## 🤝 Công Nghệ Phát Triển

- **IDE**: JetBrains IntelliJ IDEA hoặc tương đương
- **Version Control**: Git
- **Package Manager**: Gradle





