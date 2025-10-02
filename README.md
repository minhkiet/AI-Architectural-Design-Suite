# AI Architectural Design Suite / Bộ công cụ Thiết kế Kiến trúc AI

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react" alt="React 19.1.1" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript 5.8.2" />
  <img src="https://img.shields.io/badge/Vite-6.2.0-purple?style=for-the-badge&logo=vite" alt="Vite 6.2.0" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-Powered-orange?style=for-the-badge&logo=google" alt="Google Gemini AI" />
</div>

---

## 🏗️ English

### Overview

The **AI Architectural Design Suite** is a comprehensive web application that leverages Google's Gemini AI to provide architects, designers, and construction professionals with powerful AI-driven tools for architectural visualization, planning, and project management. The application features a modern dark-mode interface with bilingual support (English/Vietnamese).

### ✨ Key Features

#### 🎨 **Design & Visualization Tools**
1. **Surreal Exterior Render** - Transform photos or create stunning exterior visualizations from scratch
2. **Instant Interior Design** - Redesign interior spaces by changing styles and furnishings
3. **Master Plan Project** - Generate comprehensive site planning and urban design layouts
4. **Smart Edit / Add Detail** - Edit images using natural language or add details from reference images
5. **Finalize SketchUp Drawing** - Convert rough sketches into photorealistic renders
6. **Convert 2D Plan to 3D** - Transform floor plans into 3D block models

#### 📐 **Technical & Analysis Tools**
7. **Real Photo to 2D Tech Drawing** - Convert photographs into professional technical drawings
8. **Cost & Size Calculation** - Get preliminary cost estimates and area calculations
9. **Task List Generator** - Create detailed project schedules with worker assignments

#### 🔧 **Advanced Features**
- **Bilingual Interface** (English/Vietnamese)
- **Real-time Image Refinement** - Edit generated images with additional prompts
- **Render History** - Track and rerun previous generations
- **Export Capabilities** - Export cost analyses and task lists to Excel
- **Drag & Drop Interface** - Easy file uploads with preview
- **Responsive Design** - Works on desktop and mobile devices

### 🚀 Installation & Setup

#### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Google Gemini API Key** (required for AI functionality)

#### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Architectural-Design-Suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   REACT_APP_API_KEY=your_gemini_api_key_here
   # or alternatively
   API_KEY=your_gemini_api_key_here
   ```

   **To get a Gemini API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key to your `.env.local` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### 📖 Usage Guide

#### Getting Started
1. **Select a Tool** - Choose from 9 specialized AI tools on the homepage
2. **Upload Images** (if required) - Drag and drop or browse for image files
3. **Enter Prompts** - Describe what you want to create or modify
4. **Configure Settings** - Adjust style, aspect ratio, and other parameters
5. **Generate** - Click the generate button and wait for AI processing
6. **Refine** - Use the edit feature to make adjustments to generated images
7. **Export** - Download images or export data to Excel

#### Tool-Specific Instructions

**For Image Generation Tools:**
- Use descriptive prompts for best results
- Experiment with different style presets
- Utilize negative prompts to exclude unwanted elements

**For Analysis Tools (Cost/Task):**
- Provide detailed project descriptions
- Include dimensions when available
- Set realistic timeframes for task generation

**For Technical Drawing Tools:**
- Upload clear, well-lit photographs
- Specify desired drawing scale and line styles
- Choose appropriate symbol libraries

### 🛠️ Build & Deployment

#### Production Build
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Deployment Options
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after building
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Traditional Hosting**: Upload the `dist` folder contents to your web server

### 🔧 Technical Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Integration**: Google Gemini AI (@google/genai)
- **Styling**: CSS-in-JS with responsive design
- **File Processing**: Native File API with drag-and-drop
- **Export Features**: XLSX library for Excel exports
- **Icons**: Font Awesome 6

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🏗️ Tiếng Việt

### Tổng quan

**Bộ công cụ Thiết kế Kiến trúc AI** là một ứng dụng web toàn diện sử dụng Google Gemini AI để cung cấp cho các kiến trúc sư, nhà thiết kế và chuyên gia xây dựng những công cụ mạnh mẽ được hỗ trợ bởi AI cho việc trực quan hóa kiến trúc, quy hoạch và quản lý dự án. Ứng dụng có giao diện tối hiện đại với hỗ trợ song ngữ (Tiếng Anh/Tiếng Việt).

### ✨ Tính năng chính

#### 🎨 **Công cụ Thiết kế & Trực quan hóa**
1. **Render Ngoại thất Siêu thực** - Biến đổi ảnh hoặc tạo ra các hình ảnh ngoại thất ấn tượng từ đầu
2. **Thiết kế Nội thất Tức thì** - Thiết kế lại không gian nội thất bằng cách thay đổi phong cách và đồ nội thất
3. **Quy hoạch Dự án Tổng thể** - Tạo ra các bố cục quy hoạch địa điểm và thiết kế đô thị toàn diện
4. **Chỉnh sửa Thông minh / Thêm chi tiết** - Chỉnh sửa hình ảnh bằng ngôn ngữ tự nhiên hoặc thêm chi tiết từ hình ảnh tham khảo
5. **Hoàn thiện Nét vẽ SketchUp** - Chuyển đổi các bản phác thảo thô thành các render chân thực
6. **Chuyển Mặt bằng 2D sang 3D** - Biến đổi mặt bằng thành mô hình khối 3D

#### 📐 **Công cụ Kỹ thuật & Phân tích**
7. **Chuyển Ảnh Thực thành Bản vẽ Kỹ thuật 2D** - Chuyển đổi ảnh chụp thành bản vẽ kỹ thuật chuyên nghiệp
8. **Tính toán Kích thước & Chi phí** - Nhận ước tính chi phí sơ bộ và tính toán diện tích
9. **Tạo Danh sách Công việc** - Tạo lịch trình dự án chi tiết với phân công nhân công

#### 🔧 **Tính năng Nâng cao**
- **Giao diện Song ngữ** (Tiếng Anh/Tiếng Việt)
- **Tinh chỉnh Hình ảnh Thời gian thực** - Chỉnh sửa hình ảnh đã tạo với các prompt bổ sung
- **Lịch sử Render** - Theo dõi và chạy lại các lần tạo trước đó
- **Khả năng Xuất dữ liệu** - Xuất phân tích chi phí và danh sách công việc ra Excel
- **Giao diện Kéo & Thả** - Tải file dễ dàng với xem trước
- **Thiết kế Responsive** - Hoạt động trên máy tính để bàn và thiết bị di động

### 🚀 Cài đặt & Thiết lập

#### Yêu cầu hệ thống
- **Node.js** (phiên bản 16 trở lên)
- **npm** hoặc **yarn** package manager
- **Google Gemini API Key** (bắt buộc cho chức năng AI)

#### Hướng dẫn Cài đặt từng bước

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd AI-Architectural-Design-Suite
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Thiết lập biến môi trường**
   
   Tạo file `.env.local` trong thư mục gốc:
   ```env
   REACT_APP_API_KEY=your_gemini_api_key_here
   # hoặc có thể dùng
   API_KEY=your_gemini_api_key_here
   ```

   **Để lấy Gemini API key:**
   - Truy cập [Google AI Studio](https://aistudio.google.com/)
   - Đăng nhập bằng tài khoản Google
   - Tạo API key mới
   - Sao chép key vào file `.env.local`

4. **Khởi động development server**
   ```bash
   npm run dev
   ```

5. **Mở trình duyệt**
   
   Điều hướng đến `http://localhost:5173` (hoặc port hiển thị trong terminal)

### 📖 Hướng dẫn Sử dụng

#### Bắt đầu
1. **Chọn Công cụ** - Chọn từ 9 công cụ AI chuyên biệt trên trang chủ
2. **Tải lên Hình ảnh** (nếu cần) - Kéo thả hoặc duyệt file hình ảnh
3. **Nhập Prompt** - Mô tả những gì bạn muốn tạo hoặc chỉnh sửa
4. **Cấu hình Cài đặt** - Điều chỉnh phong cách, tỷ lệ khung hình và các tham số khác
5. **Tạo** - Nhấn nút tạo và chờ AI xử lý
6. **Tinh chỉnh** - Sử dụng tính năng chỉnh sửa để điều chỉnh hình ảnh đã tạo
7. **Xuất** - Tải xuống hình ảnh hoặc xuất dữ liệu ra Excel

#### Hướng dẫn theo từng Công cụ

**Cho Công cụ Tạo Hình ảnh:**
- Sử dụng prompt mô tả chi tiết để có kết quả tốt nhất
- Thử nghiệm với các style preset khác nhau
- Sử dụng negative prompt để loại trừ các yếu tố không mong muốn

**Cho Công cụ Phân tích (Chi phí/Công việc):**
- Cung cấp mô tả dự án chi tiết
- Bao gồm kích thước khi có sẵn
- Đặt khung thời gian thực tế cho việc tạo công việc

**Cho Công cụ Bản vẽ Kỹ thuật:**
- Tải lên ảnh chụp rõ nét, đủ ánh sáng
- Chỉ định tỷ lệ bản vẽ và kiểu đường nét mong muốn
- Chọn thư viện ký hiệu phù hợp

### 🛠️ Build & Triển khai

#### Production Build
```bash
npm run build
```

#### Xem trước Production Build
```bash
npm run preview
```

#### Tùy chọn Triển khai
- **Vercel**: Kết nối GitHub repository để triển khai tự động
- **Netlify**: Kéo thả thư mục `dist` sau khi build
- **GitHub Pages**: Sử dụng GitHub Actions để triển khai tự động
- **Hosting truyền thống**: Tải lên nội dung thư mục `dist` lên web server

### 🔧 Công nghệ sử dụng

- **Frontend Framework**: React 19.1.1 với TypeScript
- **Build Tool**: Vite 6.2.0
- **Tích hợp AI**: Google Gemini AI (@google/genai)
- **Styling**: CSS-in-JS với thiết kế responsive
- **Xử lý File**: Native File API với drag-and-drop
- **Tính năng Xuất**: Thư viện XLSX cho xuất Excel
- **Icons**: Font Awesome 6

### 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/tinh-nang-tuyet-voi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. Push lên branch (`git push origin feature/tinh-nang-tuyet-voi`)
5. Mở Pull Request

### 📄 Giấy phép

Dự án này được cấp phép theo MIT License - xem file LICENSE để biết chi tiết.

---

## 📞 Support / Hỗ trợ

For support or questions, please open an issue in the GitHub repository.
Để được hỗ trợ hoặc có câu hỏi, vui lòng tạo issue trong GitHub repository.

**Copyright © No Border Place**
