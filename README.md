# Pondok Pesantren K3 Arafah - Web Application

Website resmi untuk Pondok Pesantren K3 Arafah, meliputi Landing Page Publik, Sistem Penerimaan Santri Baru (PSB), dan Dashboard Admin/CMS.

## Tech Stack

### Frontend (`/frontend-next`)

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI (Radix Primitives)
- **State/Form**: React Hook Form + Zod
- **Animations**: Framer Motion

### Backend (`/backend-go`)

- **Language**: Go (Golang)
- **Framework**: Gin Gonic
- **Database**: PostgreSQL (via GORM)
- **Auth**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js & npm
- Go 1.25+
- PostgreSQL Database

### 1. Setup Backend

```bash
cd backend-go
# Salin contoh env dan sesuaikan kredensial DB Anda
cp .env.example .env
# Install dependencies
go mod tidy
# Jalankan Server (Default: Port 8080)
go run cmd/api/main.go
```

### 2. Setup Frontend

```bash
cd frontend-next
# Install dependencies
npm install
# Jalankan Development Server (Default: Port 3000)
npm run dev
```

## Features

1.  **Public Landing Page**: Informasi pondok, berita terkini (CMS), profil.
2.  **PSB System**: Formulir pendaftaran santri baru online.
3.  **Admin Dashboard**:
    - Manajemen Berita (CRUD)
    - Manajemen Data Santri Pendaftar
    - Autentikasi Admin Aman

## Project Structure

- `backend-go/`: Kode sumber API server.
- `frontend-next/`: Kode sumber antarmuka pengguna Next.js.
