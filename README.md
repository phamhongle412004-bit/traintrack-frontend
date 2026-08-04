# TrainTrack - Hệ Thống Quản Lý & Đăng Ký Khóa Học

TrainTrack là ứng dụng Web Single-Page Application (SPA) xây dựng bằng React.js, hỗ trợ quản lý khóa học cho Quản trị viên (Admin) và tìm kiếm/đăng ký khóa học cho Học viên.
### Link github: https://github.com/phamhongle412004-bit/traintrack-frontend
---

## 1. Phiên Bản Công Cụ & Hướng Dẫn Cài Đặt

### Phiên bản môi trường
- **Node.js**: `v18.x` hoặc `v20.x`
- **npm**: `v9.x` hoặc `v10.x`
- **React**: `v18.2.0`
- **React Router DOM**: `v6.x`
- **Build Tool**: Vite `v5.x`

### Hướng dẫn cài đặt & Chạy ứng dụng

1. **Clone repository và cài đặt dependencies:**
   ```bash
   git clone <repository-url>
   cd traintrack
   npm install
   ```

2. **Cấu hình môi trường (Mẫu .env):**

    Tạo file .env tại thư mục gốc:
    ```bash
    VITE_API_BASE_URL=http://localhost:3001/api
    ```
3. **Khởi chạy ứng dụng (Development Mode):**
    ```bash
    npm run dev
    ```
4. **Build cho môi trường Production:**
    ```bash
    npm run build
    ```

## 2. API Contract
Cấu trúc URL API mặc định: http://localhost:3001/api

### Authentication Endpoints
- POST /api/auth/login: Đăng nhập hệ thống.
    - Request Body: { "email": "string", "password": "string" }
    - Response (200): { "token": "string", "user": { "id": "string", "name": "string", "role": "ADMIN" | "USER" } }
- GET /api/auth/me: Re-validate session bằng JWT Token.
    - Headers: Authorization: Bearer <token>

    - Response (200): { "id": "string", "name": "string", "role": "ADMIN" | "USER" }
### Courses Endpoints
- GET /api/courses?q=&level=&sort=&order=: Lấy danh sách khóa học kèm bộ lọc/tìm kiếm.
    - Query Params: q (mô tả/tên), level (BEGINNER | INTERMEDIATE | ADVANCED), sort (price | duration), order (asc | desc).
    - Response (200): Array<Course>
- GET /api/courses/:id: Lấy chi tiết khóa học.
    - Response (200): Course Object
- POST /api/courses (ADMIN): Tạo khóa học mới. 
    - Headers: Authorization: Bearer <token>
    - Request Body: { "title": "string", "level": "string", "duration": number, "price": number, "instructorId": "string", "seats": number, "summary": "string" }
- PUT /api/courses/:id (ADMIN): Cập nhật thông tin khóa học.
    - Headers: Authorization: Bearer <token>
- DELETE /api/courses/:id (ADMIN): Xóa khóa học.
    - Response (204): No Content.
### Instructors Endpoints
- GET /api/instructors: Lấy danh sách giảng viên chọn trong Form.

## 3. Bảng Kiểm Tra Tính Năng (Feature Checklist)

| Task | Mô tả tính năng | Trạng thái |
| :--- | :--- | :---: |
| **Task 1** | Cấu trúc SPA, Layout chính, Routing tĩnh/động, Error Boundary |  Hoàn thành |
| **Task 2** | Danh mục khóa học, Bộ lọc URL SearchParams, Sắp xếp, Phân trang |  Hoàn thành |
| **Task 3** | Chi tiết khóa học (Overview / Syllabus Tabs), Điều hướng đăng ký |  Hoàn thành |
| **Task 4** | Form Đăng nhập & Form Khóa học (Validate 7 quy tắc, UX, Accessibility) |  Hoàn thành |
| **Task 5** | AuthContext & BasketContext (`useReducer`), LocalStorage versioning (`traintrack_v1_*`) |  Hoàn thành |
| **Task 6** | Bắt lỗi render (Error Boundary), Báo cáo AI, Clean Code (không console.log/dead code) |  Hoàn thành |

## 4. Routing Map & State Map

### Routing Map
- /: Trang chủ Landing Page.
- /courses: Danh mục tất cả khóa học (Lọc/Tìm kiếm qua URL Query).
- /courses/:courseId: Trang chi tiết khóa học.
    - /courses/:courseId: Tab tổng quan (Overview).
    - /courses/:courseId/syllabus: Tab giáo trình (Syllabus).
- /basket: Giỏ hàng hiện tại.
- /my-enrolments: Danh sách khóa học đã đăng ký thành công.
- /login: Trang đăng nhập (Chỉ dành cho Guest).
- /admin/courses: Trang quản lý danh sách khóa học dành cho Admin.
- /admin/courses/new: Trang tạo khóa học mới (Admin).
- /admin/courses/:courseId/edit: Trang cập nhật thông tin khóa học (Admin).
- *: Trang 404 Not Found.

### State Map
| State | Vị trí lưu trữ | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Auth State** | `AuthContext` + `localStorage` (`traintrack_v1_auth`) | Cần truy cập toàn cục (Header, Route Protection) và duy trì đăng nhập sau F5. |
| **Basket State** | `BasketContext` + `localStorage` (`traintrack_v1_basket`) | Cần hiển thị Badge số lượng trên Header và bảo toàn giỏ hàng khi người dùng chuyển trang. |
| **Search/Filter State** | URL Query Params (`useSearchParams`) | Cho phép lưu bookmark, chia sẻ URL tìm kiếm và quay lại bằng nút Back/Forward của trình duyệt. |
| **Form State** | Local Component State (`useState`) | Dữ liệu nhập liệu mang tính ngắn hạn, không cần chia sẻ sang component khác. |

## 5. Effects Note (Danh Sách useEffect)
1. useEffect trong AuthContext (Re-validate session):
    - Lý do: Tự động gửi request GET /api/auth/me khi ứng dụng khởi chạy để xác thực lại token trong localStorage.
2. useEffect trong AuthContext & BasketContext (Sync Storage):
    - Lý do: Theo dõi sự thay đổi của State và đồng bộ liên tục vào localStorage dưới key namespace traintrack_v1_*.
3. useEffect trong CataloguePage (Fetch danh sách khóa học):
    - Lý do: Gửi API lấy dữ liệu mỗi khi tham số bộ lọc trên URL (searchParams) thay đổi.
4. useEffect trong AdminCourseEditPageWrapper (Fetch thông tin cũ):
    - Lý do: Tải dữ liệu khóa học theo courseId và danh sách Giảng viên để đổ (Pre-fill) vào CourseForm.
5. useEffect trong Custom Hook useHeaderBadgeAnimation:
    - Lý do: Kích hoạt timeout thay đổi class CSS tạo hiệu ứng nảy (bounce) khi itemCount giỏ hàng tăng.

## 6. React Compiler & Security Notes

### React Compiler Note
- Mã nguồn viết theo chuẩn React 18 Pure Component Functions, tuân thủ nguyên tắc không biến đổi trực tiếp (mutate) state.

- Các hàm Reducer đều là Pure Functions độc lập, sẵn sàng tương thích tốt với các công cụ tối ưu hóa như React Compiler hoặc useMemo/useCallback.

### Security Note
- Kiểm soát truy cập (Access Control): Các route quản trị (/admin/*) được bảo vệ nghiêm ngặt bằng AdminRoute. Nếu người dùng không có role ADMIN, hệ thống sẽ tự động điều hướng về /login hoặc /courses.

- Lưu trữ dữ liệu an toàn: Token được lưu trữ trong localStorage. Dữ liệu nhạy cảm như Mật khẩu (Password) không bao giờ được lưu vào State toàn cục hoặc LocalStorage, đồng thời bị xóa sạch (reset) ngay sau khi bấm Submit hoặc khi xảy ra lỗi đăng nhập.

- Xác thực Header: Mọi API request cần quyền Admin đều tự động gắn header Authorization: Bearer <token>.

## 7. Báo Cáo Sử Dụng AI (AI Usage Report)

Trong quá trình nghiên cứu và hoàn thiện dự án TrainTrack, công cụ AI (Gemini / ChatGPT) đã được sử dụng như một trợ lý lập trình (AI Coding Assistant) nhằm tối ưu hóa năng suất, kiểm tra chất lượng mã nguồn và hỗ trợ biên soạn tài liệu. Dưới đây là báo cáo chi tiết các hạng mục ứng dụng:

### 1. Hỗ Trợ Kiến Trúc & Thiết Kế Luồng Dữ Liệu
* **Tư vấn State Management**: Tham vấn AI để triển khai mô hình quản lý state bằng `useReducer` kết hợp React Context API. Tách biệt hoàn toàn Pure Reducer Functions ra khỏi UI Component để đảm bảo nguyên tắc Clean Architecture.
* **Đặt tên Action Type chuẩn mực**: Đề xuất quy chuẩn đặt tên các Action theo dạng `EVENT_NAME` (ví dụ: `BASKET_ITEM_ADDED`, `AUTH_LOGIN_SUCCESS`) thay vì tên lệnh thụ động, giúp lịch sử Dispatch rõ ràng và dễ Debug.
* **Custom Hooks & Persistence**: Hỗ trợ thiết kế Custom Hook `useLocalStorage` đồng bộ dữ liệu với LocalStorage theo chuẩn Namespace `traintrack_v1_*`, xử lý an toàn các trường hợp lỗi JSON parsing hoặc storage bị khóa.

### 2. Tối Ưu UX, Form Validation & Accessibility (a11y)
* **Xây dựng Quy tắc Validate**: Hỗ trợ thiết lập hàm kiểm tra dữ liệu cho 7 quy tắc bắt buộc của Form (Rượt đuổi lỗi realtime, kiểm tra định dạng Email, mật khẩu mạnh, giá trị số dương, v.v.).
* **Hỗ trợ Chuẩn Accessibility**: Đề xuất tích hợp đầy đủ các thuộc tính ARIA (`aria-invalid`, `aria-describedby`, `aria-live`) cho ô nhập liệu và thông báo lỗi, giúp ứng dụng thân thiện hơn với Screen Reader.

### 3. Xử Lý Lỗi, Debug & Kiểm Soát Chất Lượng Code
* **Bắt lỗi Render & Resilience**: Hỗ trợ triển khai `ErrorBoundary` class component nhằm ngăn ngừa sự cố trắng màn hình (White Screen of Death), cung cấp giao diện khôi phục (Fallback UI) thân thiện với người dùng.
* **Phát hiện & Sửa lỗi Asynchronous**: Trợ giúp phát hiện và phòng tránh các lỗi Unmounted Component Memory Leak bằng cách hướng dẫn sử dụng `AbortController` trong `useEffect` khi gọi API.
* **Rà soát Clean Code**: Kiểm tra tự động nhằm loại bỏ các đoạn code thừa (dead code), các dòng `console.log` thử nghiệm và đảm bảo không để rò rỉ mã thông báo/bí mật (Secrets/API keys) trong mã nguồn Client.

### 4. Biên Soạn Tài Liệu Đồ Án
* Hỗ trợ chuẩn hóa cấu trúc file `README.md`, trình bày API Contract, Routing Map, State Map.