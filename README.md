# Pondok Pesantren K3 Arafah - Web Application

Website resmi untuk Pondok Pesantren K3 Arafah, meliputi Landing Page Publik, Sistem Penerimaan Santri Baru (PSB), dan Dashboard Admin/CMS yang modern dan aman.

## 🚀 Fitur Utama

- **Public Landing Page**: Informasi profil, berita terkini, dan galeri kegiatan.
- **Sistem PSB Online**: Pendaftaran santri baru, upload berkas, dan pengecekan status pendaftaran.
- **Admin Dashboard**:
  - Manajemen Artikel & Berita (WYSIWYG dengan Sanitasi XSS).
  - Manajemen Galeri Foto (Cloudinary Integration).
  - Verifikasi Data Santri Baru.
  - Role-Based Access Control (Admin & Super Admin).
- **Keamanan & Performa**:
  - **HttpOnly Cookies** untuk autentikasi (Anti-XSS).
  - **Input Sanitization** menggunakan `bluemonday`.
  - **Rate Limiting** pda endpoint login & upload.
  - **Embedded Migrations** untuk kemudahan deployment.
  - **Server Components** (Next.js 15) untuk performa maksimal.

## 🛠 Tech Stack

### Frontend (`/frontend-next`)

- **Core**: Next.js 16 (App Router), TypeScript, React 19
- **Styling**: Tailwind CSS v4, Shadcn UI, Framer Motion
- **State**: Zustand, React Query
- **Testing**: Vitest, React Testing Library
- **Forms**: React Hook Form, Zod

### Backend (`/backend-go`)

- **Core**: Go (Golang) 1.25+, Gin Framework
- **Database**: PostgreSQL, GORM, Redis (Caching)
- **Security**: JWT, Bluemonday (Sanitization), Tollbooth (Rate Limit)
- **Migration**: Golang-Migrate (Embedded IOFS)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ & npm
- Go 1.24+
- PostgreSQL Database
- Redis (Optional, for caching)

### 1. Setup Backend

```bash
cd backend-go

# 1. Konfigurasi Environment
cp .env.example .env
# Edit .env sesuaikan dengan kredensial DB Anda

# 2. Install Dependencies
go mod tidy

# 3. Setup Database (Migration)
# Flag -migrate akan menjalankan migrasi embedded
go run cmd/api/main.go -migrate

# Jika error "version dirty", gunakan force:
# go run cmd/api/main.go -force 1

# 4. Jalankan Server (Port 8080)
go run cmd/api/main.go
```

### 2. Setup Frontend

```bash
cd frontend-next

# 1. Install Dependencies
npm install

# 2. Konfigurasi Environment
cp .env.example .env.local
# Pastikan NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 3. Jalankan Development Server (Port 3000)
npm run dev
```

### 3. Testing

**Frontend Tests:**

```bash
cd frontend-next
npm run test
```

## 📂 Project Structure

```
├── backend-go/
│   ├── cmd/            # Entry points (api, seeder)
│   ├── config/         # App configuration
│   ├── internal/       # Private application code
│   │   ├── handlers/   # HTTP Transports
│   │   ├── services/   # Business Logic
│   │   ├── models/     # Data Structures
│   │   └── repository/ # Data Access Layer
│   └── migrations/     # Embedded SQL Migrations
│
├── frontend-next/
│   ├── app/            # Next.js App Router Pages
│   ├── components/     # Reusable UI Components
│   ├── lib/            # Utilities & API Clients
│   └── store/          # Zustand State Management
```
